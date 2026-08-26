import {betterAuth, BetterAuthError} from "better-auth";
import {createAuthMiddleware, APIError} from "better-auth/api";
import prisma from "@/prisma/prismaClient";
import {prismaAdapter} from "@better-auth/prisma-adapter";
import {customSession, magicLink} from "better-auth/plugins";
import {mailOptions, transporter} from "@/app/(pages)/auth/email";
import {captureException} from "@sentry/nextjs";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    basePath: "/api/v2/auth",
    hooks: {
        after: createAuthMiddleware(async ctx => {
            const returned = ctx.context.returned;

            // only log INTERNAL_SERVER_ERROR's and other non-APIError's (which would cause an INTERNAL_SERVER_ERROR)
            if ((returned instanceof APIError && returned.status === "INTERNAL_SERVER_ERROR") || ((returned instanceof Error) && !(returned instanceof APIError))) {
                captureException(returned, {tags: {"better-auth.error": true}});
            }
        }),
    },

    plugins: [
        magicLink({
            sendMagicLink: async ({email, token, url, metadata}, ctx) => {
                const existingUser = await prisma.user.findFirst({
                    where: {
                        email
                    }
                });

                const isNewUser = !existingUser;

                // error out if user is trying to sign in without a user
                if (isNewUser && metadata.action === "signInExistingUser")
                    throw new APIError("NOT_FOUND", {message: "User not found. Please sign up first.", code: "AUTH_SIGNIN_USER_NOT_FOUND"});
                // error out if user is trying to register an account with an e-mail that is already tied to another account
                else if (!isNewUser && metadata.action === "registerNewUser")
                    throw new APIError("CONFLICT", {message: "You are trying to sign up a user with an e-mail that already has a user attached to it. Please log in instead.", code: "AUTH_SIGNUP_USER_EXISTS"});

                const html = isNewUser ?
                    `Hello. You have successfully created an account at ${process.env.BETTER_AUTH_URL}.
  
                    Please verify your email by clicking the following link: <a href="${url}">${url}</a> <br>
                    If you have not created a user, ignore this email. <br>
                    You cannot reply to this email.`
                    :
                    `Hello. A sign-in request to your account has been made.
                    Click the following link to sign in: <a href="${url}">${url}</a> <br>
                    If you did not request this sign-in, ignore this email. <br>
                    You cannot reply to this email.`;

                transporter.sendMail(
                    mailOptions(email, html)
                );
            }
        }),

        // add relations to User object returned from authClient.useSession()
        customSession(async ({user, session}) => {
            const dbUser = await prisma.user.findFirst(
                {where: {id: user.id},
                    include: {
                        roles: {include: {role: {select: {name: true}}}},
                        recruitedByUser: true,
                        recruitedUsers: true
                    }
                }
            );

            const semester = await prisma.semester.findFirst({
                orderBy: {
                    id: "desc"
                }
            });

            return {
                user: {
                    ...user,
                    ...dbUser,
                    roles: dbUser.roles.map(role => role.role.name)
                },
                semester,
                session
            };
        }),
    ]
});
