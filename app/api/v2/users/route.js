
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { randomBytes } from "crypto";

export async function POST(req) {
  
  if (req.method != "POST") {
    return NextResponse.json(
      { error: `Method '${req.method}' does not match POST` },
      { status: 405 }
    );
  }
  
  const args = await req.json();
  const { email, firstName, lastName } = args;
  
  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      });

      const activateToken = await prisma.activateToken.create({
        data: {
          token: `${randomBytes(32).toString("hex")}`,
          userId: newUser.id,
        },
      });

      return { newUser, activateToken };
    });

    return NextResponse.json({ data: result });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}

export async function GET(req) {
  const params = req.nextUrl.searchParams

  const queryParams = {}
  if (params.get("active") === "true") {
    queryParams.update({where: {active: true}})
  }
  const res = await prisma.user.findMany(queryParams)
  return NextResponse.json(
    {users: res},
    {status: 200}
  )
}