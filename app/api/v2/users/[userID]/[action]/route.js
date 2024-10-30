
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { duration } from "@mui/material";


export async function GET(req, {params}) {
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }

  await params
  const userID = params.userID
  const action = params.action
  
  if (userID) {
    switch (action) {
      case "roles":
        return handleGetRoles(userID)
      case "workLogs":
        return handleGetWorkLogs(userID)
      default:
        return handleGetUser(req)
    }
  }
    return NextResponse.json(
      { error: `${userID}, ${action}` },
      { status: 200 }
    );
  
}

async function handleGetWorkLogs(userID) {
  const workLogs = await prisma.workLog.findMany({
    where: {
      loggedFor: userID
    },
    select: {
      duration: true,
      workedAt: true,
      description: true,
      LoggedByUser: {
        select: {
          firstName: true,
          lastName: true
        }
      },
    }
  })
  return NextResponse.json(
    {workLogs: workLogs},
    {status: 200}
  )
}

async function handleGetRoles(userID) {
  const userRoleIds = await prisma.user.findFirst({
    where: {
      id: userID
    },
    select: {
      roles: {
        select: {
          roleId: true
        }
      }
    }
  })

  const rolesList = await prisma.role.findMany({
    select: {
      name: true,
      id: true
    }
  })

  const roles = {}
  
  for (let role of rolesList) {
    roles[role.id] = role.name
  }

  const userRoles = userRoleIds.roles.map(e => roles[e.roleId])

  return NextResponse.json(
    {userRoles: userRoles},
    {status: 200}
  )
}