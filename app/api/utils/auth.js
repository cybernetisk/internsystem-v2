import { getServerSession } from "next-auth";
import { authOptions } from "../v2/auth/[...nextauth]/route";
import { NextResponse } from "next/server";


/**
 * This function takes roles need to access page.
 * Returns either a redirect or error NextResponse if the user is not authenticated
 * Returns null if user should be able to access page
 * 
 * @param {string[] | null} requiredRoles A list of required roles to access page / route. Leave empty to only require user to be signed in to access page / route
 * @returns {NextResponse | null} Returns null if user is authenticated and a redirect or error if not
 */
export async function auth(requiredRoles = null) {
    const session = await getServerSession(authOptions)

}

export function authWrapper() {
    return () => {
        
    }
}