import { NextResponse } from "next/server";

export function middleware(req) {
    console.log("Main middleware")
    return NextResponse.next()
}