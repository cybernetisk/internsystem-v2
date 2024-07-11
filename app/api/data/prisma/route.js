


import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { PrismaClient } from "@prisma/client";

/**
 * @param {*} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  if (req.method == "POST") {
    const args = await req.json();
    let data;

    if (!isValidRequest(args)) {
      return NextResponse.json(
        { error: `Request body ${args} is not correct` },
        { status: 405 }
      );
    }
    // console.log("PMH Request", args);
    
    try {
      switch (args.method) {
        case "find":
          if (Object.hasOwn(args.request, "where")) {
            data = await prisma[args.model].findFirst(args.request);
          }
          else {
            data = await prisma[args.model].findMany(args.request);
          }
          break;
        case "create":
          data = await prisma[args.model].create(args.request);
          break;
        case "update":
          data = await prisma[args.model].update(args.request);
          break;
        case "delete": 
          data = await handleDelete(args)
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

      return NextResponse.json({ data: data });
    } catch (error) {
      console.log(`uh oh, Error with model "${args.model}"`, error);
      
      return NextResponse.json(
        { error: `Error with ${args.model}: ${error}` },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: `Method '${req.method}' does not match POST` },
      { status: 405 }
    );
  }
}

function isValidRequest(args) {
  const check1 = Object.hasOwn(args, "model");
  const check2 = Object.hasOwn(args, "method");
  const check3 = Object.hasOwn(args, "request");
  return check1 & check2 & check3;
}

async function handleDelete(args) {
  
  switch (args.model) {
    case ("user"):
      const user = await prisma.user.findUnique({
        ...args.request,
        include: {
          activateToken: true,
          sessions: true
        }
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
      break;
  }
  
  
}