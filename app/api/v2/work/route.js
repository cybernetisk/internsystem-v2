
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/utils/authOptions";


export async function POST(req) {

  const session = await getServerSession(authOptions)
  const params = await req.json()
  const authCheck = new Auth(session, params)
    .requireRoles([])
    .requireParams(["loggedBy", "loggedFor", "workedAt", "duration", "description", "semesterId"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)



  const success = await prisma.$transaction(async (transaction) => {
    const workLogEntry = await transaction.workLog.create({
      data: {
        loggedBy: params.loggedBy,
        loggedFor: params.loggedFor,
        workedAt: params.workedAt,
        duration: params.duration,
        description: params.description,
        semesterId: params.semesterId
      }
    });

    const voucherBuffer = (await transaction.VoucherBuffer.findFirst({
      select: {
        buffer: true
      },
      where: {
        userId: params.loggedFor
      }
    })).buffer;

    const numVouchersToLog = (params.duration / 2) + voucherBuffer; // TODO: Update to make vouchers per hour ajustable and not hardcoded

    const loggedDate = new Date();
    const expirationDate = new Date(2025, 12, 31); // TODO: Set expiration date to end of semester
    const workLogId = workLogEntry.id;

    const voucherData = [];
    for (let i = 0; i < numVouchersToLog; i++) {
      voucherData.push({
        userId: params.loggedFor,
        loggedDate: loggedDate,
        expirationDate: expirationDate,
        workLogEntryId: workLogId
      })
    }

    await transaction.Voucher.createMany({
      data: voucherData
    })

    await transaction.VoucherBuffer.upsert({
      where: {
        userId: params.loggedFor
      },
      update: {
        buffer: numVouchersToLog % 1 // Set buffer to amount of partial vouchers
      },
      create: {
        userId: params.loggedFor,
        buffer: numVouchersToLog % 1
      }
    })
    return true
  })

  if (success)
    return authCheck.verify(NextResponse.json({ status: 200 }))
}

export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
    .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)

  try {
    const semester = await prisma.Semester.findFirst({ select: { id: true }, orderBy: { year: "desc" } })
    const workLogs = await prisma.WorkLog.findMany({
      select: {
        LoggedByUser: { select: { firstName: true, lastName: true, id: true } },
        LoggedForUser: { select: { firstName: true, lastName: true, id: true } },
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