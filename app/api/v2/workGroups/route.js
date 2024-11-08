
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";

export async function GET(req) {
  
  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  try {
      const groups = await prisma.WorkGroup.findMany();

    return authCheck.verify(NextResponse.json({ groups: groups }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}

export async function POST(req) {

  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])
  authCheck.requireParams(["userId", "workGroupId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  

  const args = await req.json()
  
  const { userId, workGroupId } = args;

  try {
    const res = await prisma.userToWorkGroup.create({
      data: {
        userId: userId,
        workGroupId: workGroupId
      }
    })

    if (res)
      return authCheck.verify(NextResponse.json({status: 200}))

  } catch (error) {
    console.log("User to workgroup already exist in database")
    return authCheck.verify(NextResponse.json({status: 200}))
  }

}