
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
      const groups = await prisma.WorkGroup.findMany();

    return NextResponse.json({ groups: groups });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}