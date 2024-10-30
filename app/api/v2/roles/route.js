
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function GET(req) {
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  
  
  try {
    const roles = await prisma.role.findMany({
        select: {
            name: true
        }
    });

    return NextResponse.json({ roles: roles.map(e => e.name) });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}