import { NextRequest, NextResponse } from "next/server";
import { MenuCategory } from "@prisma/client";
import prismaClient from "@/prisma/prismaClient";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";
import { authOptions } from "@/app/api/utils/authOptions";
import { MenuCategoryCreate } from "@/app/api/utils/types/MenuCategoryTypes";


// Modify a category. Does not allow modifying products inside the category.
export async function PATCH(
    req: NextRequest
) {
    const category: MenuCategory = await req.json();

    const session = await getServerSession(authOptions);
    const auth: Auth = new Auth(session, category)
        .requireRoles(["board"])
        .requireParams(["id"]); // only id is strictly required

    if (auth.failed) return auth.response;

    try {

        const newProduct = await prismaClient.menuCategory.update({
            where: {
                id: category.id
            },
            data: category
        });

        return auth.verify(NextResponse.json(JSON.stringify(newProduct)));
    } catch (e) {
        return auth.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}


// Create a new category.
export async function POST(
    req: NextRequest
) {
    const category: MenuCategoryCreate = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, category)
        .requireRoles(["board"])
        .requireParams(["name"]);

    if (auth.failed) return auth.response;

    try {
        const newCategory = await prismaClient.menuCategory.create({
            data: category
        });

        // 201 Created
        return auth.verify(NextResponse.json(JSON.stringify(newCategory), {status: 201}));
    } catch (e) {
        return auth.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}
