

import NextAuth from "next-auth";
import Email from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/prismaClient";

const handler = NextAuth({
  providers: [
    Email({
      server: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.NODEMAILER_NOREPLY_USER,
          pass: process.env.NODEMAILER_NOREPLY_PASSWORD,
        },
      },
      from: process.env.NODEMAILER_NOREPLY_USER
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      
      const cybUser = await prisma.user.findFirst({
        where: {
          email: user.email
        }
      })
      
      if (!cybUser) {
        throw "No user found"
      }
      
      if (!cybUser.active) {
        throw "Email has not been verified"
      }
      
      return true
    },
    async session({ session }) {
      
      const cybUser = await prisma.user.findFirst({
        where: {
          email: session.user.email,  
        },
        include: {
          recruitedByUser: true,
          recruitedUsers: true,
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
      
      const semesters = await prisma.semester.findMany({
        orderBy: {
          id: "desc"
        },
        take: 1,
      })
      const currentSemester = await semesters[0];
      
      if (cybUser) {
        session.user.name = `${cybUser.firstName} ${cybUser.lastName}`
        delete session.user.name;
        
        session.user = {
          ...session.user,
          ...cybUser,
          roles: cybUser.roles.map((e) => e.role),
          name: `${cybUser.firstName} ${cybUser.lastName ? cybUser.lastName : ""}`
        }
      }
      
      // console.log(currentSemester);
      if (currentSemester) {
        session.semester = currentSemester;
      }
      
      return session
    }
  },
  pages: {
    signIn: "/pages/auth/signIn"
  },
  adapter: PrismaAdapter(prisma),
});

export { handler as GET, handler as POST };