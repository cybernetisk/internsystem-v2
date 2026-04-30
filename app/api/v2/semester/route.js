
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";




export async function GET(req) {
  
  const session = await auth.api.getSession({headers: await headers()});
  const authCheck = new Auth(session)

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  try {
      const semester = await prisma.semester.findFirst({
        orderBy: {
            id: "desc"
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