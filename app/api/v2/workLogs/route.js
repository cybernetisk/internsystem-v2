
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles(["intern"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  try {
    const semester = await prisma.Semester.findFirst({select: {id:true}, orderBy: {year: "desc"}})
    const workLogs = await prisma.WorkLog.findMany({
      select: {
        LoggedByUser: {select: {firstName: true, lastName: true, id: true}},
        LoggedForUser: {select: {firstName: true, lastName: true, id: true}},
        workedAt: true,
        duration: true,
        description: true
      },
      where: {
        semesterId: semester.id,
      }
    });

    return authCheck.verify(NextResponse.json({ workLogs: workLogs }));
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
  .requireParams(["loggedBy", "loggedFor", "workedAt", "duration", "description", "semesterId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  

  const res = await prisma.workLog.create({
    data: {
      loggedBy: params.loggedBy,
      loggedFor: params.loggedFor,
      workedAt: params.workedAt,
      duration: params.duration,
      description: params.description,
      semesterId: params.semesterId
    }
  })

  if (res)
    return authCheck.verify(NextResponse.json({status: 200}))
}