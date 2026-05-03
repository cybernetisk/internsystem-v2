
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";



export async function GET(req) {
  
  const session = await auth.api.getSession({headers: await headers()});
  const authCheck = new Auth(session)

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  try {
    const currentSemester = (await prisma.Semester.findFirst({
      select: {
          id: true
      },
      orderBy: {
        id: "desc"
      }
    }))?.id

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
    }))?.length

    const totVolunteerHours = (await prisma.workLog.aggregate({
      _sum: {
        duration: true
      }
    }))._sum.duration


    const vouchersUsed = (await prisma.Voucher.count({
      where: {
        usedAt: {not: null}
      }
    }));

    const vouchersEarned = (await prisma.Voucher.count({
      select:{
        id: true
      }
    }))?.id;

    return authCheck.verify(NextResponse.json({ 
      membershipsPaid: membershipsPaid,
      numberVolunteers: numberVolunteers,
      volunteerHours: totVolunteerHours ? totVolunteerHours : 0,
      vouchersEarned: vouchersEarned,
      vouchersUsed: vouchersUsed
    }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}