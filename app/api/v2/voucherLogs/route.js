
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

    return NextResponse.json({ voucherLogs: voucherLogs });
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
  
  if (
    !(args.hasOwnProperty("loggedFor") &&
    args.hasOwnProperty("amount") &&
    args.hasOwnProperty("description") &&
    args.hasOwnProperty("semesterId"))
  ) return NextResponse.json({error: "Malformed request"}, {status: 400})

  let res = await prisma.voucherLog.create({
    data: {
      loggedFor: args.loggedFor,
      amount: args.amount,
      description: args.description,
      semesterId: args.semesterId
    }
  })

  if (res) {
    return NextResponse.json({status: 200})
  }

}