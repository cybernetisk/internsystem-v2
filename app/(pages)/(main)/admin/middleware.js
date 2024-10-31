import { NextResponse } from "next/server";

export function middleware(req) {
    console.log("Admin middleware")
    return NextResponse.next()
}