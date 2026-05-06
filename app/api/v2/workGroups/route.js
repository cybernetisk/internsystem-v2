
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Auth } from "../../utils/oldAuth.js";
import {auth} from "@/app/api/utils/auth.ts";
import {headers} from "next/headers";


export async function GET(req) {
  
  const session = await auth.api.getSession({headers: await headers()})
  const authCheck = new Auth(session)
  .requireRoles([])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  try {
      const groups = await prisma.WorkGroup.findMany();

    return authCheck.verify(NextResponse.json({ groups: groups }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}

// export async function POST(req) {

//  const session = await auth.api.getSession({headers: await headers()})
//   const params = await req.json()
//   const authCheck = new Auth(session, params)
//   .requireRoles([])
//   .requireParams(["userId", "workGroupId"])

//   if (authCheck.failed) return authCheck.verify(authCheck.response)
  

  
//   const { userId, workGroupId } = params;

//   try {
//     const res = await prisma.userToWorkGroup.create({
//       data: {
//         userId: userId,
//         workGroupId: workGroupId
//       }
//     })

//     if (res)
//       return authCheck.verify(NextResponse.json({status: 200}))

//   } catch (error) {
//     console.log("User to workgroup already exist in database")
//     return authCheck.verify(NextResponse.json({status: 200}))
//   }

// }