
import { NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { randomBytes } from "crypto";
import { mailOptions, transporter } from "@/app/(pages)/auth/email";
import { Auth } from "../../utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/v2/auth/[...nextauth]/route";




const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";

async function sendVerificationEmail(user, activateToken) {
  const link = `${NEXTAUTH_URL}/activate/${activateToken.token}`;
  const html = `
  Hello ${user.firstName} ${user.lastName}, You have successfully created a user-account at ${NEXTAUTH_URL}. <br><br>
  
  Please verify your email by clicking the following link: ${link} <br><br>
  If you have not created a user, ignore this message. <br><br>
  You cannot reply to this email.
  `;
      
  try {
    await transporter.sendMail(mailOptions(user.email, html));
  } catch (error) {
    console.log(error)
    return {success: false}
  }
  
  return {success: true}

}

async function createUser(email, firstName, lastName) {
  try {
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email: email,
          firstName: firstName,
          lastName: lastName,
        },
      });

      const activateToken = await prisma.activateToken.create({
        data: {
          token: `${randomBytes(32).toString("hex")}`,
          userId: newUser.id,
        },
      });

      return { newUser, activateToken };
    });
    return result
  } catch (error) {
    console.log(error)
    return false
  }

}

async function registerUser(email, firstName, lastName) {
  if (!email || !firstName || !lastName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

    const userRes = await createUser(email, firstName, lastName)
    if (!userRes)
      return NextResponse.json({ ok: false, error: "Could not create user" }, {status: 400});

    const {newUser, activateToken} = userRes

    const res = await sendVerificationEmail(newUser, activateToken)
    if (res.success) {
      return NextResponse.json({ok: true}, {status: 200})
    } 

    return NextResponse.json({ ok: false, error: "Could not send verification email" }, {status: 400});
 
  
}

export async function POST(req) {

  const params = req.json()

  const authCheck = new Auth(null, params)
  .requireParams(["email", "firstName", "lastName"])

  const { email, firstName, lastName } = params;

  return authCheck.verify(await registerUser(email, firstName, lastName));
  
}

export async function GET(req) {

  const session = await getServerSession(authOptions)
  const authCheck = new Auth(session)
  .requireRoles(["intern"])

  if (authCheck.failed) return authCheck.verify(authCheck.response)

  const params = req.nextUrl.searchParams

  const queryParams = {}
  if (params.get("active") === "true") {
    queryParams.update({where: {active: true}})
  }
  const res = await prisma.user.findMany(queryParams)
  return authCheck.verify(NextResponse.json(
    {users: res},
    {status: 200}
  ));
}