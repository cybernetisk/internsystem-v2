
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

const VOUCHER_MODIFIER = 0.5

export async function GET(req) {
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  
  
  try {
    const currentSemester = (await prisma.Semester.findFirst({
      select: {
          id: true
      },
      orderBy: {
        id: "desc"
      }
    })).id

    const membershipsPaid = (await prisma.UserMembership.aggregate({
        where: {
          semester_id: currentSemester
        },
        _count: true
    }))._count

    const numberVolunteers = (await prisma.workLog.findMany({
      distinct: ["loggedFor"],
      select: {
        loggedFor: true,
      }
    })).length

    const totVolunteerHours = (await prisma.workLog.aggregate({
      _sum: {
        duration: true
      }
    }))._sum.duration

    const vouchersUsed = (await prisma.VoucherLog.aggregate({
      _sum: {
        amount: true
      }
    }))._sum.amount
    

    return NextResponse.json({ 
      membershipsPaid: membershipsPaid,
      numberVolunteers: numberVolunteers,
      volunteerHours: totVolunteerHours,
      vouchersEarned: totVolunteerHours * VOUCHER_MODIFIER,
      vouchersUsed: vouchersUsed
    });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}