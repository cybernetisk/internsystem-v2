import { Auth } from "@/app/api/utils/auth";
import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";

export async function GET() {
    const authCheck = new Auth();
    
    const cafeStatus = await prisma.cafeStatus.findFirst({
        where: {id:0},
    });

    console.log(cafeStatus);

    return authCheck.verify(
        NextResponse.json({
            isOpen: cafeStatus.open, 
            opens: cafeStatus.start, 
            closes: cafeStatus.end, 
            emoji: cafeStatus.emoji
        }, {status: 200})
    );
}