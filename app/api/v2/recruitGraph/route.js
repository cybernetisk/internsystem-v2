
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/utils/authOptions";



export async function GET(req) {
  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response) 
  
  try {
    const users = await prisma.user.findMany({
        select: {
            firstName: true,
            lastName: true,
            id: true,
            recruitedById: true
        },
        where: {
          OR: [
          {recruitedById: {
            not: null
          }},
          {recruitedUsers: {
            some: {}
          }}
          ]
        }
    });

    const userIdToId = {}
    for (const [i, user] of users.entries()) {
      userIdToId[user.id] = i
    }

    const nodes = users.map(user => {
      return {
        id: userIdToId[user.id], 
        firstName: user.firstName, 
        lastName: user.lastName
      }
    })

    const edges = users.filter(user => user.recruitedById).map(user => {
      return [userIdToId[user.id], userIdToId[user.recruitedById]]
    })

    return authCheck.verify(NextResponse.json({ nodes: nodes, edges: edges }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}