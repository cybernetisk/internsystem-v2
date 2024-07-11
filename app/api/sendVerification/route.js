
import { mailOptions, transporter } from "@/app/pages/auth/email";
import { NextResponse } from "next/server";

export async function POST(req) {
  
  if (req.method == "POST") {
    
    const args = await req.json();
    const { user, activateToken } = args
    const link = `http://localhost:3000/api/activate/${activateToken.token}`;
    const html = `
    Hello ${user.firstName} ${user.lastName}, You have successfully created a user-account at CYB.no. <br><br>
    
    Please verify your email by clicking the following link: ${link} <br><br>
    If you have not created a user, ignore this message. <br><br>
    You cannot reply to this email.
    `;
    
    let success = false
    
    try {
      await transporter.sendMail(mailOptions(user.email, html));
      success = true
      
    } catch (error) {
      console.error("Error with sending email: ", error);
    }
    
    return NextResponse.json({ success: success }, { status: 200 });
  }

  return NextResponse.json(
    { error: `Method '${req.method}' does not match POST` },
    { status: 405 }
  );
  
}