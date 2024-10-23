
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";


/**
 * @param {NextRequest} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  
  // TODO: update logic so that session is ONLY checked if method is NOT "find".
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in" },
      { status: 401 }
    );
  }

  const args = await req.json();

  if (!isValidRequest(args)) {
    return NextResponse.json(
      { error: `Request body ${JSON.stringify(args)} is not correct` },
      { status: 405 }
    );
  }

  if (args.debug) console.log("PMH Request", args);

  try {
    let data;
    switch (args.method) {
      case "find":
        data = await prisma[args.model].findMany(args.request);
        break;
      case "create":
        data = await prisma[args.model].create(args.request);
        break;
      case "update":
        data = await prisma[args.model].update(args.request);
        break;
      case "delete":
        data = await handleDelete(args);
        break;
      default:
        throw new Error(`Invalid method ${args.method} for request`);
    }

    if (args.fields) {
      return NextResponse.json({
        data: data,
        fields: Object.keys(prisma[args.model].fields),
        extra: prisma[args.model].fields,
      });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.log(`uh oh, Error with model "${args.model}"`, error);
    return NextResponse.json(
      { error: `Error with ${args.model}: ${error.message}` },
      { status: 400 }
    );
  }
}

function isValidRequest(args) {
  const check1 = Object.hasOwn(args, "model");
  const check2 = Object.hasOwn(args, "method");
  const check3 = Object.hasOwn(args, "request");
  return check1 && check2 && check3;
}

async function handleDelete(args) {
  switch (args.model) {
    case "user":
      const user = await prisma.user.findUnique({
        ...args.request,
        include: {
          activateToken: true,
          sessions: true,
        },
      });

      const data = await prisma.$transaction([
        prisma.activateToken.deleteMany({
          where: {
            id: {
              in: user.ActivateToken.map((e) => e.id),
            },
          },
        }),
        prisma.session.deleteMany({
          where: {
            id: {
              in: user.sessions.map((e) => e.id),
            },
          },
        }),
        prisma.user.delete({
          where: {
            id: user.id,
          },
        }),
      ]);

      return data;

    default:
      throw new Error(`Unsupported model ${args.model} for deletion.`);
  }
}
