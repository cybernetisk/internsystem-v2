
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { duration } from "@mui/material";
import { inc } from "sanity";

export async function POST(req, {params}) {
  const args = await req.json()
  const {userID, action} = await params

  if (userID) {
    switch (action) {
      case "roles":
        return handlePostRoles(userID, args)
    }
  }

}

export async function GET(req, {params}) {
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  const {userID, action} = await params
  
  if (userID) {
    switch (action) {
      case "roles":
        return handleGetRoles(userID)
      case "workLogs":
        return handleGetWorkLogs(userID)
      case "recruitInfo":
        return handleGetRecruitInfo(userID)
      default:
        return handleGetUser(req)
    }
  }
  return NextResponse.json(
    { error: `${userID}, ${action}` },
    { status: 200 }
  );
  
}

async function handlePostRoles(userID, args) {
  if (!(
    args.hasOwnProperty("roles")
  )) return NextResponse.json({error: "Malformed request"}, {status: 400})

  const roles = args.roles;

  await prisma.UserRole.deleteMany({
    where: {
      userId: userID
    }
  })

  const roleList = await prisma.role.findMany({select: {id: true, name: true}})
  const roleMap = {}
  for (let role of roleList) roleMap[role.name] = role.id 

  for (let role of roles) {
    await prisma.UserRole.create({
      data: {
        userId: userID,
        roleId: roleMap[role]
      }
    })
  }

  return NextResponse.json({}, {status: 200})
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

async function handleGetRecruitInfo(userID) {
  const numRecruits = (await prisma.User.findFirst({
    where: {
      id: userID
    },
    select: {
      _count: {
        include: {
          recruitedUsers: true
        }
      }
    }
  }))._count.recruitedUsers

  const recruitLogs = await prisma.User.findFirst({
    where: {
      id: userID
    },
    select: {
      recruitedUsers: {
        select: {
          LoggedForUser: {
            select: {
              duration: true
            }
          }
        }
      }
    }
  })

  const recruitHours = recruitLogs.recruitedUsers.flatMap(user => user.LoggedForUser).reduce((sum, log) => sum + log.duration, 0)
  
  return NextResponse.json({
    numRecruits: numRecruits,
    recruitHours: recruitHours
  })
}