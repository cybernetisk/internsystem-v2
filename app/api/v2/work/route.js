
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";


export async function POST(req) {

  const session = await auth.api.getSession({headers: await headers()})
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
    }))?.buffer;

    const numVouchersToLog = (params.duration / 2) + (voucherBuffer??0); // TODO: Update to make vouchers per hour ajustable and not hardcoded
    
    const loggedDate = new Date();
    const workLogId = workLogEntry.id;

    const voucherExpirationDate = (await transaction.Semester.findFirst({
      select: {
        voucherExpirationDate: true
      },
      orderBy:{
        id: 'desc'
      }
    })).voucherExpirationDate

    const voucherData = [];
    for (let i = 0; i < Math.floor(numVouchersToLog); i++) {
      voucherData.push({
        userId: params.loggedFor,
        loggedDate: loggedDate,
        expirationDate: voucherExpirationDate,
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

  const session = await auth.api.getSession({headers: await headers()})
  const authCheck = new Auth(session)
    .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)

  try {
    const semester = await prisma.Semester.findFirst({ select: { id: true }, orderBy: { id: "desc" } })
    const workLogs = await prisma.WorkLog.findMany({
      select: {
        LoggedByUser: { select: { name: true, id: true } },
        LoggedForUser: { select: { name: true, id: true } },
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