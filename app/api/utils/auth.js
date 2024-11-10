import { getServerSession } from "next-auth";
import { authOptions } from "../v2/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

const NOT_AUTHORIZED = NextResponse.json({error: "Not authorized"}, {status: 403})
const NOT_SIGNED_IN = NextResponse.json({error: "Not logged in"}, {status: 401})
const MISSING_PARAMS = NextResponse.json({error: "Malformed request, missing params"}, {status: 400})

/**
 * This class is meant to be used in a chain-fassion
 *  1. Make an instance of the class
 *  2. Chain together checks
 *  3. Check the failed attribute to check if the auth-check failed or not
 *  4. Return the reponse attribute which contain a NextResponse if the checks failed
 * 
 * @param {NextRequest} req
 */
export class Auth {
    constructor(session, params = null) {
        this.response = null
        this.failed = false
        this.session = session
        this.params = params
    }

    /**
     * @param {string[]} requiredRoles List of roles required to access page, leave empty to require user to be logged in
     * @returns {Auth}
    */
    requireRoles(requiredRoles) {
        if (this.failed) return this
        
        // If no roles are required, the user just needs to be logged in which can be checked with the existance of the session object
        if (requiredRoles.length >= 0 && this.session === null) {
            this.response = NOT_SIGNED_IN
            this.failed = true
            return this
        }

        if (requiredRoles.every(role => this.session.user.roles.includes(role))) {
            return this
        }
        
        this.response = NOT_AUTHORIZED
        this.failed = true
        
        return this
    }

    /**
     * @param {string[]} params Parameters required to access page
     * @returns {Auth}
    */
    requireParams(params) {
        if (this.params === null) throw new Error("params attribute is required to be set by constructor to use this function")
            
        if (this.failed) return this

        const givenParams = this.params
        for (const reqParam of params){
            if (!(reqParam in givenParams)){
                this.response = MISSING_PARAMS
                this.failed = true
                break
            }
        }

        return this
    }

    requireOwnership(owner) {
        if (this.failed) return this
    
        if (this.session.user.roles.includes("admin")) return this // Admin buypass on ownership requirement
        if (this.session.user.id === owner) { // Checking to see if userID is equal in stead of checking not null in case this.session is null which would give false positive
            return this
        }
        
        this.failed = true
        this.response = NOT_AUTHORIZED
        return this
    }

    /**
     * 
     * @param {NextResponse} res 
     * @returns {NextResponse}
     */
    verify(res) {
        if (this.failed) {
            const failedRes = this.response.clone()
            failedRes.headers.set("X-Auth-Checked", "true")
            return failedRes
        }

        res.headers.set("X-Auth-Checked", "true")
        return res
    }
}
