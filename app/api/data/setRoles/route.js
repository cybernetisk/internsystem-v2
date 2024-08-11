
import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";

/**
 * @param {*} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  if (req.method == "POST") {
    
    const args = await req.json();
    
    const { user, roles } = args;
    // console.log("post roles", user, roles);
    
    try {
      const data = await prisma.$transaction(async (prisma) => {
        
        await prisma.userRole.deleteMany({
          where: { userId: user.id }
        });
        
        const userRoles = roles.map((role) => ({
          userId: user.id,
          roleId: role.id
        }))
        
        await prisma.userRole.createMany({
          data: userRoles
        })
      });
      
      return NextResponse.json({ data: data });
    }
    
    catch (error) {
      const message = `Error with assigning roles: ${error}`;
      
      console.log(message)
      return NextResponse.json(
        { error: message },
        { status: 400 }
      );
    }  
  }
  
  else {
    const message = `Method '${req.method}' does not match POST`;
    
    console.log(message);
    return NextResponse.json(
      { error: message },
      { status: 405 }
    );
  }
}