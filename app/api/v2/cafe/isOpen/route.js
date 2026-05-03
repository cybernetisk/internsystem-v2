import { Auth } from "@/app/api/utils/auth";
import { NextResponse } from "next/server";

export function GET() {
    const authCheck = new Auth();
    
    return authCheck.verify(NextResponse.json({isOpen: false}, {status: 200}));
}