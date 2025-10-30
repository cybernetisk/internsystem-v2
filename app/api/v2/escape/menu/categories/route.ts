import { NextRequest, NextResponse } from "next/server";
import { MenuCategory } from "@prisma/client";
import prismaClient from "@/prisma/prismaClient";
import { MenuCategoryCreate } from "@/app/api/v2/escape/menu/products/route";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";



// Modify a category. Does not allow modifying products inside the category.
export async function PATCH(
    req: NextRequest
) {

    const session = await getServerSession(authOptions);
    const authCheck: Auth = new Auth(session)
        .requireRoles([]);

    if (authCheck.failed) return authCheck.response;

    const category: MenuCategory = await req.json();

    const newProduct = await prismaClient.menuCategory.update({
        where: {
            id: category.id
        },
        data: category
    })


    return NextResponse.json(JSON.stringify(newProduct));
}


// Create a new category.
export async function POST(
    req: NextRequest
) {
    const session = await getServerSession(authOptions);
    const authCheck = new Auth(session)
        .requireRoles([]);

    if (authCheck.failed) return authCheck.response;

    const category: MenuCategoryCreate = await req.json();

    const newCategory = await prismaClient.menuCategory.create({
        data: category
    });

    return NextResponse.json(JSON.stringify(newCategory));
}