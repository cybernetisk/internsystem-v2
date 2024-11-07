
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "@/app/api/utils/auth";


export async function GET(req, {params}) {

    const authCheck = await new Auth(req)
    .requireRoles([])
  
    if (authCheck.failed) return authCheck.verify(authCheck.response)
    

  await params
  const userID = params.userID

  
  return authCheck.verify(NextResponse.json(
      { error: `${userID}` },
      { status: 200 }
    ));
    
}

export async function PATCH(req, {params}) {

    const authCheck = await new Auth(req)
    .requireRoles([])
  
    if (authCheck.failed) return authCheck.verify(authCheck.response)
    

    await params
    const userID = params.userID
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