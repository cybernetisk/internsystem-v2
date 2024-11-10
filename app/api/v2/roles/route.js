
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";

export async function GET(req) {
  
  const authCheck = await new Auth(req.clone())
  await authCheck.requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  try {
    const roles = await prisma.role.findMany({
        select: {
            name: true
        }
    });

    return authCheck.verify(NextResponse.json({ roles: roles.map(e => e.name) }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}