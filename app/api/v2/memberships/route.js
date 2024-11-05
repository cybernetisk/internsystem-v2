
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { randomBytes } from "crypto";

export async function GET(req) {
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  
  
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

    return NextResponse.json({ memberships: semester });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}

export async function POST(req) {
  const args = await req.json()
  
  if (!(
    args.hasOwnProperty("name") &&
    args.hasOwnProperty("email") &&
    args.hasOwnProperty("comments") &&
    args.hasOwnProperty("seller_id") &&
    args.hasOwnProperty("semester_id")
  )) return NextResponse.json({error: "Malformed reqeust"}, {status: 400})

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
    return NextResponse.json({status: 200})
}