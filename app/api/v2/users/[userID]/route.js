
import { NextResponse } from "next/server";
import { useRouter } from 'next/navigation'

export default function GET(req) {
    const router = useRouter()
  
  if (req.method != "GET") {
    return NextResponse.json(
      { error: `Invalid method '${req.method}'` },
      { status: 405 }
    );
  }
 
    return NextResponse.json(
      { error: `frefew: ${router.query.userID}` },
      { status: 200 }
    );
  
}