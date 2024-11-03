
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";

export async function GET(req) {
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  
  
  try {
    const users = await prisma.user.findMany({
        select: {
            firstName: true,
            lastName: true,
            id: true,
            recruitedById: true
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

    return NextResponse.json({ nodes: nodes, edges: edges });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}