import prisma from "@/prisma/prismaClient";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    let menuCategories = await prisma.menuCategory.findMany(
        {
            include: {
                menu_products: true
            }
        }
    );
    
    return NextResponse.json(menuCategories);
}