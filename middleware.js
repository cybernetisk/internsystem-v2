import { NextResponse } from "next/server"
import { middleware as AdminHandler } from "@/app/(pages)/(main)/admin/middleware"
import { middleware as ApiHandler } from "@/app/api/middleware"

const middlewareMap = {
    "/admin": AdminHandler,
    "/api": ApiHandler
}

const allowList = new Set([
    "/olejohan.svg",
    "/icon.png"
])

export async function middleware(req) {
    // Prevent infinate redirect to unauthorized
    const path = req.nextUrl.pathname;
    if (path === "/unauthorized") return NextResponse.next()
        console.log(path)
    if (allowList.has(path)) return NextResponse.next()

    for (let route of Object.keys(middlewareMap)) {
        if (path.indexOf(route) === 0) return middlewareMap[route](req)
    }

    // Redirect to authorized if no page has allowed the request through
    return NextResponse.redirect(new URL("/unauthorized", req.url))
}

export const config = {
    matcher: [
        {
            source: "/((?!_next).*)",
        }
    ],
}