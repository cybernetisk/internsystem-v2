
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getHours } from "date-fns";
import { Auth } from "../../utils/auth";



export async function GET(req) {
  const authCheck = await new Auth(req.clone())
  await authCheck.requireRoles(["intern"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  
  try {
    const shifts = await prisma.shiftCafe.findMany({
        select: {
            shiftPosition: true,
            startAt: true,
            UserForShiftManager: {select: {firstName: true, lastName: true}},
            UserForShiftWorker1: {select: {firstName: true, lastName: true}},
            UserForShiftWorker2: {select: {firstName: true, lastName: true}}
        }
    })

    return authCheck.verify(NextResponse.json({ shifts: shifts }));
  }
  
  catch (error) {
    console.error(error);
    return authCheck.verify(NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    ));
  }
  
}


export async function POST(req) {

  const authCheck = await new Auth(req.clone())
  await authCheck.requireRoles(["intern"])
  await authCheck.requireParams(["selectedDay", "shiftManagerId", "shiftWorker1Id", "shiftWorker2Id"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)
  
  const args = await req.json();

  const {
    selectedDay,
    shiftManagerId,
    shiftWorker1Id,
    shiftWorker2Id,
    comment,
  } = args;
  
  
  let title;
  let shiftPosition;
  const selectedStartTime = getHours(selectedDay);
  
  const hasWorkers = shiftManagerId || shiftWorker1Id || shiftWorker2Id;
  
  switch (selectedStartTime) {
    case 10:
      shiftPosition = 0;
      break;
    case 12:
      shiftPosition = 1;
      break;
    case 14:
      shiftPosition = 2;
      break;
  }
  
  try {
    
    
    const shiftExists = await prisma.shiftCafe.findFirst({
      where: {
        startAt: selectedDay,
      },
    });
    
    
    let data;
    
    // shift and workers exists
    if (hasWorkers && shiftExists) {
      data = await prisma.shiftCafe.update({
        where: {
          id: shiftExists.id,
        },
        data: {
          title: title,
          comment: comment,
          shiftPosition: shiftPosition,
          shiftManager: shiftManagerId,
          shiftWorker1: shiftWorker1Id,
          shiftWorker2: shiftWorker2Id,
        },
      });
    }

    // workers exist
    else if (hasWorkers && !shiftExists) {
      data = await prisma.shiftCafe.create({
        data: {
          title: title,
          comment: comment,
          startAt: selectedDay,
          shiftPosition: shiftPosition,
          shiftManager: shiftManagerId,
          shiftWorker1: shiftWorker1Id,
          shiftWorker2: shiftWorker2Id,
        },
      });
    } else if (shiftExists) {
      data = await prisma.shiftCafe.delete({
        where: {
          id: shiftExists.id,
        },
      });
    }

    return authCheck.verify(NextResponse.json({}, {status: 200}));
  } catch (error) {
    const message = `Error with assigning roles: ${error}`;

    console.log(message);
    return authCheck.verify(NextResponse.json({ error: message }, { status: 400 }));
  }
}