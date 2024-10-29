
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