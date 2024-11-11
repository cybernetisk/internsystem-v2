
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "@/app/api/utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/v2/auth/[...nextauth]/route";




export async function GET(req, {params}) {
    await params
    const userID = params.userID
    
    const session = await getServerSession(authOptions)
    const authCheck = new Auth(session)
    .requireRoles([])
    .requireOwnership(userID)
    
    if (authCheck.failed) return authCheck.verify(authCheck.response)
  
    return authCheck.verify(NextResponse.json(
        { error: `${userID}` },
        { status: 200 }
    ));
    
}

export async function PATCH(req, {params}) {
    await params
    const userID = params.userID

    const session = await getServerSession(authOptions)
    const authCheck = new Auth(session)
    .requireRoles([])
    .requireOwnership(userID)
  
    if (authCheck.failed) return authCheck.verify(authCheck.response)
    

    const args = await req.json()
    
    const result = {}

    for (let [arg, val] of Object.entries(args)) {
        result[arg] = false
        switch (arg) {
            case "firstName":
            case "lastName":
            case "recruitedById":
                let res = await updateField(arg, val, userID)
                if (res)
                    result[arg] = true
                break
            default: continue
        }
    }
  
      return authCheck.verify(NextResponse.json(
            result,
          { status: 200 }
      ));
  
}

async function updateField(fieldName, val, userID) {

    const data = {}
    data[fieldName] = val

    let res = await prisma.User.update({
        where: {
            id: userID
        },
        data: data
    })

    return res
}