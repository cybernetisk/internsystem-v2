
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { authOptions } from "@/app/api/v2/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";


export async function GET(req) {
  
  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles([])

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

  const session = await getServerSession(authOptions)
  const params = await req.json()
  const authCheck = new Auth(session, params)
  .requireRoles([])
  .requireParams(["userId", "workGroupId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  

  
  const { userId, workGroupId } = params;

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