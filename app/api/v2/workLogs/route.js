
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

    return NextResponse.json({ workLogs: workLogs });
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
    args.hasOwnProperty("loggedBy") &&
    args.hasOwnProperty("loggedFor") &&
    args.hasOwnProperty("workedAt") &&
    args.hasOwnProperty("duration") &&
    args.hasOwnProperty("description") &&
    args.hasOwnProperty("semesterId")
  )) return NextResponse.json({error: "Malformed request"}, {status: 400})

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
    return NextResponse.json({status: 200})
}