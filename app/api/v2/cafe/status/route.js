import { Auth } from "@/app/api/utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";
import prisma from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const authCheck = new Auth();
    
    const cafeStatus = await prisma.cafeStatus.findFirst({
        where: {id:0},
    });


    return authCheck.verify(
        NextResponse.json({
            isOpen: cafeStatus.open, 
            opens: cafeStatus.start, 
            closes: cafeStatus.end, 
            emoji: cafeStatus.emoji
        }, {status: 200})
    );
}

export async function POST(req) {
    let formdata;
    try {
        formdata = await req.formData();
    } catch (e){
        return NextResponse.json({"msg": "Have some tea"}, {status: 418})
    }    

    const params = {
        isOpen: formdata.get("isOpen"),
        opens: formdata.get("opens"),
        closes: formdata.get("closes"),
        emoji: formdata.get("emoji"),
    }

    const session = await getServerSession(authOptions)
    const authCheck = new Auth(session, params);
    authCheck.requireParams(["isOpen", "opens", "closes", "emoji"])
    .requireRoles(["cafe-master"]);

    if (authCheck.failed) {
        return authCheck.verify(NextResponse.json({error: "Not authorized"}, {status: 403}))
    }

    // User is autorized and has passed the correct parameters
    const isOpen = params.isOpen === "true";

    if (!isOpen) {
        await prisma.cafeStatus.update({
            where: {id: 0},
            data: {
                open: false,
                start: null,
                end: null,
                emoji: null
            }
        })
    } else {
        const opens = params.opens;
        const closes = params.closes;
        const emoji = params.emoji;
        if (opens.match(/^\d{2}\:\d{2}$/) === null) return authCheck.verify(NextResponse.json({error: "opens field must match /^\d{2}\:\d{2}$/"}, {status: 400}));
        if (closes.match(/^\d{2}\:\d{2}$/) === null) return authCheck.verify(NextResponse.json({error: "closes field must match /^\d{2}\:\d{2}$/"}, {status: 400}));
        if (typeof(emoji) !== "string" || emoji.length !== 1) return authCheck.verify(NextResponse.json({error: "emoji must be string of length 1"}, {status: 400}));

        if (opens >= closes) return authCheck.verify(NextResponse.json({error: "Opening time must be after closing time"}, {status: 400}));

        await prisma.cafeStatus.update({
            where: {id: 0},
            data: {
                open: true,
                start: opens,
                end: closes,
                emoji: emoji
            }
        })
        
        
    }

    return authCheck.verify(NextResponse.json({}, {status: 200}))
}