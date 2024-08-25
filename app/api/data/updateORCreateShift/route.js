

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
      selectedShiftId,
      selectedDay,
      shiftManagerId,
      shiftWorker1Id,
      shiftWorker2Id,
    } = args;
    
    console.log(args);
    
    let title;
    let shiftPosition;
    const selectedStartTime = getHours(selectedDay);
    
    const hasWorkers = shiftManagerId || shiftWorker1Id || shiftWorker2Id;
    
    switch (selectedStartTime) {
      case 10:
        title = "Opening Shift";
        shiftPosition = 0;
        break;
      case 12:
        title = "Middle Shift";
        shiftPosition = 1;
        break;
      case 14:
        title = "Closing Shift";
        shiftPosition = 2;
        break;
    }
    
    try {
      let data;
      
      if (selectedShiftId && hasWorkers) {
        data = await prisma.shiftCafe.update({
          where: {
            id: selectedShiftId
          },
          data: {
            title: title,
            startAt: selectedDay,
            shiftPosition: shiftPosition,
            shiftManager: shiftManagerId,
            shiftWorker1: shiftWorker1Id,
            shiftWorker2: shiftWorker2Id,
          }
        });
      } else if (hasWorkers) {
        data = await prisma.shiftCafe.create({
          data: {
            title: title,
            startAt: selectedDay,
            shiftPosition: shiftPosition,
            shiftManager: shiftManagerId,
            shiftWorker1: shiftWorker1Id,
            shiftWorker2: shiftWorker2Id,
          },
        });
      } else {
        data = await prisma.shiftCafe.delete({
          where: {
            id: selectedShiftId
          }
        })
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