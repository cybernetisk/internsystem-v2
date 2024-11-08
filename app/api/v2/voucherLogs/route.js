
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";


export async function GET(req) {

  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])

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
  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])
  authCheck.requireParams(["loggedFor", "amount", "description", "semesterId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  const args = await req.json()
  
  let res = await prisma.voucherLog.create({
    data: {
      loggedFor: args.loggedFor,
      amount: args.amount,
      description: args.description,
      semesterId: args.semesterId
    }
  })

  if (res) {
    return authCheck.verify(NextResponse.json({status: 200}))
  }

}