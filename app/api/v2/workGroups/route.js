
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

export async function POST(req) {
  const args = await req.json()
  
  if (!(
    args.hasOwnProperty("userId") && 
    args.hasOwnProperty("workGroupId")
  )) return NextResponse.json({error: "Malformed request"}, {status: 400})

  const userId = args.userId
  const workGroupId = args.workGroupId

  try {
    const res = await prisma.userToWorkGroup.create({
      data: {
        userId: userId,
        workGroupId: workGroupId
      }
    })

    if (res)
      return NextResponse.json({status: 200})

  } catch (error) {
    console.log("User to workgroup already exist in database")
    return NextResponse.json({status: 200})
  }

}