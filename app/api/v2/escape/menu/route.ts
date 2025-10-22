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


    let nullCategoryProducts = await prisma.menuProduct.findMany(
        {
            where: {
                category_id: {
                    equals: null
                }
            },
        }
    );
    let nullCategory = {
        name: "Uncategorized",
        id: null,
        menu_products: nullCategoryProducts
    };

    menuCategories.push(nullCategory)

    return NextResponse.json(menuCategories);
}