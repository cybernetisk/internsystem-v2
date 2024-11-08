
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";

export async function GET(req) {

  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])

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

  const authCheck = await new Auth(req.clone())
  authCheck.requireRoles(["intern"])
  authCheck.requireParams(["loggedBy", "loggedFor", "workedAt", "duration", "description", "semesterId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  const args = await req.json()

  const res = await prisma.workLog.create({
    data: {
      loggedBy: args.loggedBy,
      loggedFor: args.loggedFor,
      workedAt: args.workedAt,
      duration: args.duration,
      description: args.description,
      semesterId: args.semesterId
    }
  })

  if (res)
    return authCheck.verify(NextResponse.json({status: 200}))
}