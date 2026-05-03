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

export async function POST(req) {

    const params = await req.json();

    const session = await getServerSession(authOptions)
    const authCheck = new Auth(session, params);
    authCheck.requireParams(["isOpen", "opens", "closes", "emoji"])
    .requireRoles(["cafe-master"]);

    if (authCheck.failed) {
        return authCheck.verify(NextResponse.json({error: "Not authorized"}, {status: 403}))
    }

    // User is autorized and has passed the correct parameters
    
    const isOpen = params.isOpen;
    if (typeof(isOpen) !== "boolean") return authCheck.verify(NextResponse.json({error: "isOpen must be bool"}, {status: 400}))

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
        
        if (typeof(opens) !== "number") return authCheck.verify(NextResponse.json({error: "opens must be timestamp of type int/number"}, {status: 400}));
        if (typeof(closes) !== "number") return authCheck.verify(NextResponse.json({error: "closes must be timestamp of type int/number"}, {status: 400}));
        if (typeof(emoji) !== "string" || emoji.length !== 1) return authCheck.verify(NextResponse.json({error: "emoji must be string of length 1"}, {status: 400}));

        if (opens >= closes) return authCheck.verify(NextResponse.json({error: "Opening time must be after closing time"}, {status: 400}));

        await prisma.cafeStatus.update({
            where: {id: 0},
            data: {
                open: true,
                start: new Date(opens),
                end: new Date(closes),
                emoji: emoji
            }
        })
        
        
    }

    return authCheck.verify(NextResponse.json({}, {status: 200}))
}