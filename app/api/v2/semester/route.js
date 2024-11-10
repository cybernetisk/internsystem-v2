
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";




export async function GET(req) {
  
  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  try {
      const semester = await prisma.semester.findFirst({
        orderBy: {
            year: "desc"
        }
      });

    return authCheck.verify(NextResponse.json({ semester: semester }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}