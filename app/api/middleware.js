import { NextResponse } from "next/server";

export function middleware(req) {
    console.log("API middleware")
    return NextResponse.next()
}