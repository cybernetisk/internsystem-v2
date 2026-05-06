
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";


export async function GET(req) {

  const session = await auth.api.getSession({headers: await headers()})
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.response
  
  
  try {
      const semester = await prisma.UserMembership.findMany({
        select: {
          lifetime: true,
          honorary: true,
          name: true,
          comment: true,
          date_joined: true
        },
        where: {
          OR: [
            {semester_id: session.semester.id},
            {lifetime: true}
          ]
        }
      });

    return authCheck.verify(NextResponse.json({ memberships: semester }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}

export async function POST(req) {

  const session = await auth.api.getSession({headers: await headers()})
  const params = await req.json()
  const authCheck = new Auth(session, params)
  .requireRoles([])
  .requireParams(["name", "email", "comment", "seller_id", "semester_id"])

  if (authCheck.failed) return authCheck.response


  const res = await prisma.UserMembership.create({
    data: {
      name: params.name,
      email: params.email,
      comment: params.comment,
      seller_id: params.seller_id,
      semester_id: params.semester_id
    }
  })

  if (res)
    return authCheck.verify(NextResponse.json({status: 200}))
}

