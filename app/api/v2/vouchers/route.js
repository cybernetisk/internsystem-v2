
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";
import { getServerSession } from "next-auth";


async function getVoucherAmount(userId) {
  try {
    const availableVouchers = (await prisma.Voucher.aggregate({
      _count: true,
      where: {
        userId: userId,
        usedAt: null,
        expirationDate: {
          gt: new Date()
        }
      }
    }))._count;

    const voucherBuffer = (await prisma.VoucherBuffer.findFirst({
      select: {
        buffer: true
      },
      where: {
        userId: userId
      }
    }))?.buffer;

    return NextResponse.json({ voucherAmount: availableVouchers + (voucherBuffer??0) });
  }

  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

async function getVoucherLogs() {
  const semesterId = (await prisma.Semester.findFirst({
    select: {
      id: true
    },
    orderBy: {
      id: 'desc'
    }
  })).id
  const voucherLogs = (await prisma.VoucherLog.findMany({
    select: {
      usedAt: true,
      amount: true,
      description: true,
      LoggedForUser: {
        select: {
          firstName: true,
          lastName: true
        }
      }
    },
    where: {
      semesterId: semesterId
    }
  }))
  
  return NextResponse.json(voucherLogs.map(log => ({
    usedAt: log.usedAt,
    amount: log.amount,
    description: log.description,
    loggedFor: `${log.LoggedForUser.firstName} ${log.LoggedForUser.lastName}`
  })), {status: 200})
}

export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
    .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)

  const params = req.nextUrl.searchParams;

  if (params && params.has("action")) {
    switch (params.get("action")) {
      case "logs":
        return authCheck.verify(await getVoucherLogs());
      case "amount":
        return authCheck.verify(await getVoucherAmount(session.user.id));
      default:
        return authCheck.verify(NextResponse.json({error: "Invalid action type"}, {status: 400}))
    }
  }

  return authCheck.verify(NextResponse.json({error: ""}, {status:400}))

}

export async function POST(req) {

  const params = await req.json();

  const userId = params.userId;

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
    .requireRoles([])
    .requireOwnership(userId)

  if (authCheck.failed) return authCheck.verify(authCheck.response);

  const amount = params.amount;

  const error = await prisma.$transaction(async transaction => {
    const voucherIds = (await transaction.Voucher.findMany({
      select: {
        id: true
      },
      where: {
        userId: userId,
        usedAt: null,
        expirationDate: {
          gt: new Date()
        }
      },
      orderBy: {
        loggedDate: 'asc'
      },
      take: amount
    })).map(voucher => voucher.id)

    if (voucherIds.length != amount) {
      return "Not enough vouchers"
    }

    await transaction.Voucher.updateMany({
      where: {
        id: {
          in: voucherIds
        }
      },
      data: {
        usedAt: new Date()
      }
    });

    const semesterId = (await transaction.Semester.findFirst({
      select: {
        id: true
      },
      orderBy: {
        id: 'desc'
      }
    })).id;

    await transaction.VoucherLog.create({
      data: {
        loggedFor: userId,
        semesterId: semesterId,
        description: params.description,
        amount: params.amount
      }
    })


    return null; // No error in transaction
  })

  if (!error)
    return authCheck.verify(NextResponse.json({ status: 200, amount: amount, description: params.description }, { status: 200 }))
  else
    return authCheck.verify(NextResponse.json({ status: 400, error: error }, { status: 400 }))
}