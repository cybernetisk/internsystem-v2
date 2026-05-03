import {betterAuth} from "better-auth";
import prisma from "@/prisma/prismaClient";
import {prismaAdapter} from "@better-auth/prisma-adapter";
import {customSession, magicLink} from "better-auth/plugins";
import {mailOptions, transporter} from "@/app/(pages)/auth/email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"

    }),

    basePath: "/api/v2/auth",


    plugins: [
        magicLink({
            sendMagicLink: async ({email, token, url, metadata}, ctx) => {
                const html = `Hello. Please verify your email: ${url}`;

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
