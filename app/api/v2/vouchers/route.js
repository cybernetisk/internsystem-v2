
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";
import { getServerSession } from "next-auth";



export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
    
  try {
    const availableVouchers = (await prisma.Voucher.aggregate({
      _count: true,
      where: {
        userId: session.id,
        used: false,
        expirationDate: {
          gt: new Date()
        }
      }
    }))._count;

    return authCheck.verify(NextResponse.json({ voucherAmount: availableVouchers }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  } 
}

// export async function POST(req) {

//   console.log(req)

//   const session = await getServerSession(authOptions)
//   const authCheck = new Auth(session)
//   .requireRoles([])

//   if (authCheck.failed) return authCheck.verify(authCheck.response)

// }