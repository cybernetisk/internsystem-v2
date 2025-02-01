
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/utils/authOptions";
import internal from "stream";

export async function GET(req) {

  const params = req.nextUrl.searchParams;
  let semesterId = Number(params.get("semesterId"));

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  try {
    if (!semesterId) {
      const semester = await prisma.Semester.findFirst({select: {id:true}, orderBy: {year: "desc"}});
      semesterId = semester.id;
    }
    const workLogs = await prisma.WorkLog.findMany({
      select: {
        LoggedByUser: {select: {firstName: true, lastName: true, id: true}},
        LoggedForUser: {select: {firstName: true, lastName: true, id: true}},
        workedAt: true,
        duration: true,
        description: true
      },
      where: {
        semesterId: semesterId,
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
  .requireRoles([])
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