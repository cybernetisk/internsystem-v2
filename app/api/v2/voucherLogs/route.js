
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { authOptions } from "@/app/api/v2/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";



export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles(["intern"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  
  try {
    const semester = await prisma.Semester.findFirst({select: {id:true}, orderBy: {year: "desc"}})
    const voucherLogs = await prisma.voucherLog.findMany({
      select: {
        LoggedForUser: {select: {firstName: true, lastName: true, id: true}},
        usedAt: true,
        amount: true,
        description: true
      },
      where: {
        semesterId: semester.id,
      }
    });

    return authCheck.verify(NextResponse.json({ voucherLogs: voucherLogs }));
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
  const session = await getServerSession(authOptions)
  const params = await req.json()
  const authCheck = new Auth(session, params)
  .requireRoles(["intern"])
  .requireParams(["loggedFor", "amount", "description", "semesterId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  let res = await prisma.voucherLog.create({
    data: {
      loggedFor: params.loggedFor,
      amount: params.amount,
      description: params.description,
      semesterId: params.semesterId
    }
  })

  if (res) {
    return authCheck.verify(NextResponse.json({status: 200}))
  }

}