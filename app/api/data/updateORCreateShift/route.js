

import prisma from "@/prisma/prismaClient";
import { getHours } from "date-fns";
import { NextResponse } from "next/server";

/**
 * @param {*} req
 * @returns {NextResponse}
 */
export async function POST(req) {
  if (req.method == "POST") {
    const args = await req.json();

    const {
      selectedDay,
      shiftManagerId,
      shiftWorker1Id,
      shiftWorker2Id,
      comment,
    } = args;
    
    // console.log(args);
    
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
            // startAt: selectedDay,
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

      return NextResponse.json({ data: data });
    } catch (error) {
      const message = `Error with assigning roles: ${error}`;

      console.log(message);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  } else {
    const message = `Method '${req.method}' does not match POST`;

    console.log(message);
    return NextResponse.json({ error: message }, { status: 405 });
  }
}