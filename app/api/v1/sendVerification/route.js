
import { mailOptions, transporter } from "@/app/(pages)/auth/email";
import { NextResponse } from "next/server";

const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "";

export async function POST(req) {
  
  if (req.method == "POST") {
    
    const args = await req.json();
    const { user, activateToken } = args
    const link = `/api/v2/activate/${activateToken.token}`;
    const html = `
    Hello ${user.firstName} ${user.lastName}, You have successfully created a user-account at ${NEXTAUTH_URL}. <br><br>
    
    Please verify your email by clicking the following link: ${link} <br><br>
    If you have not created a user, ignore this message. <br><br>
    You cannot reply to this email.
    `;
    
    let success = false
    
    console.log(html)
    
    try {
      await transporter.sendMail(mailOptions(user.email, html));
      success = true
      
    } catch (error) {
      console.error("Error with sending email: ", error);
      return NextResponse.json({ success: success, email: user.email, error: error }, { status: 400, statusText: `Can't send email to ${user.email}` })
    }
    
    return NextResponse.json({ success: success, email: user.email,  link: link }, { status: 200 });
  }

  return NextResponse.json(
    { error: `Method '${req.method}' does not match POST` },
    { status: 405 }
  );
  
}