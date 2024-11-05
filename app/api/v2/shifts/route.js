
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { getHours } from "date-fns";


export async function GET(req) {
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
  
  
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

    return NextResponse.json({ shifts: shifts });
  }
  
  catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `something went wrong: ${error}` },
      { status: 500 }
    );
  }
  
}


/**
 * @param {*} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  const args = await req.json();

  if (!(
    args.hasOwnProperty("selectedDay") &&
    args.hasOwnProperty("shiftManagerId") &&
    args.hasOwnProperty("shiftWorker1Id") &&
    args.hasOwnProperty("shiftWorker2Id") &&
    args.hasOwnProperty("comment")
  )) return NextResponse.json({error: "Malformed request"}, {status: 400})

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

    return NextResponse.json({}, {status: 200});
  } catch (error) {
    const message = `Error with assigning roles: ${error}`;

    console.log(message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}