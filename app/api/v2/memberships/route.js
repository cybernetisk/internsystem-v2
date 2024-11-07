
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";


export async function GET(req) {

  const authCheck = await new Auth(req)
  .requireRoles(["intern"])

  if (authCheck.failed) return authCheck.response
  
  
  try {
      const semester = await prisma.UserMembership.findMany({
        select: {
          lifetime: true,
          honorary: true,
          name: true,
          comments: true,
          date_joined: true
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

  const authCheck = await new Auth(req)
  .requireRoles(["intern"])
  .requireParams(["name", "email", "comments", "seller_id", "semester_id"])

  if (authCheck.failed) return authCheck.response

  const res = await prisma.UserMembership.create({
    data: {
      name: args.name,
      email: args.email,
      comments: args.comments,
      seller_id: args.seller_id,
      semester_id: args.semester_id
    }
  })

  if (res)
    return authCheck.verify(NextResponse.json({status: 200}))
}

