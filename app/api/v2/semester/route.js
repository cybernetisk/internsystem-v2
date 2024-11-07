
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";


export async function GET(req) {
  
  const authCheck = await new Auth(req)
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