
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";


export async function GET(req, {params}) {
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }

  await params
  const userID = params.userID

  
  return NextResponse.json(
      { error: `${userID}` },
      { status: 200 }
    );
    
}

export async function PATCH(req, {params}) {
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
  
      return NextResponse.json(
            result,
          { status: 200 }
      );
  
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