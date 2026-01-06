import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";

// Gets the whole menu
export async function GET(): Promise<NextResponse> {
    const session = getServerSession(authOptions);
    const auth = new Auth(session);

    let menuCategories = await prisma.menuCategory.findMany(
        {
            include: {
                menu_products: true
            }
        }
    );
    
    return auth.verify(NextResponse.json(menuCategories));
}