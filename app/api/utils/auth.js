import { getServerSession } from "next-auth";
import { authOptions } from "../utils/authOptions";
import { NextRequest, NextResponse } from "next/server";

const NOT_AUTHORIZED = NextResponse.json({error: "Not authorized"}, {status: 403})
const NOT_SIGNED_IN = NextResponse.json({error: "Not logged in"}, {status: 401})
const MISSING_PARAMS = NextResponse.json({error: "Malformed request, missing params"}, {status: 400})

/**
 * This class is meant to be used in a chain-fassion
 *  1. Make an instance of the class
 *  2. Chain together checks
 *  3. Check the failed attribute to check if the auth-check failed or not
 *  4. Fetch the reponse attribute which contain a NextResponse if the checks failed
 *  5. Return response wrapped with this class' verify function to add 'X-Auth-Checked' header to response
 * 
 * @param {Object} session 
 * @param {Object} params (Optional) Must be passed for requireParams function to work   
 */
export class Auth {
    constructor(session, params = null) {
        this.response = null
        this.failed = false
        this.session = session
        this.params = params
    }

    /**
     * @param {string[]} permittedRoles List of roles that will give access to page, pass empty list to require user to be logged in
     * @returns {Auth}
    */
    requireRoles(permittedRoles) {
        if (this.failed) return this
        
        if (this.session === null) {
            this.response = NOT_SIGNED_IN
            this.failed = true
            return this
        }

        if (this.session.user.roles.includes("admin")) return this;

        if (permittedRoles.some(role => this.session.user.roles.includes(role))) {
            return this
        }
        
        this.response = NOT_AUTHORIZED
        this.failed = true
        
        return this
    }

    /**
     * @param {string[]} params Parameters required to access endpoint
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

    /**
     * Require user's id to match the provided owner's id
     * @param {string} owner The user id of the owner of the page
     * @returns {Auth}
     */
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
     * Double checks that no auth-checks has failed, and then adds custom verification header to response to show that the request has been run through auth
     * This double check only ensures data is not returned to the user if a requirement failed. It does not prevent the endpoint for running.
     * Always check the failed attribute after running a chain before running code for the endpoint
     * @param {NextResponse} res Response to check and wrap
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
