
import prisma from "@/prisma/prismaClient";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
  
  const {token} = params
  
  const aToken = await prisma.activateToken.findFirst({
    where: {
      token: token,
      activatedAt: null
    }
  })
  
  if (!aToken) {
    throw new Error("Invalid activate token")
  }
  
  const user = await prisma.user.findFirst({
    where: {
      id: aToken.userId
    }
  })
  
  if (!user) {
    throw new Error("No user related to activate token");
  }
  
  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      active: true
    }
  })
  
  await prisma.activateToken.update({
    where: {
      token
    },
    data: {
      activatedAt: new Date()
    }
  })

  redirect("/auth/signIn")
}