
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";



export async function GET(req) {
  const session = await auth.api.getSession({headers: await headers()});
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response) 
  
  try {
    const users = await prisma.user.findMany({
        select: {
            name: true,
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
        name: user.name
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