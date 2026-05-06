import { NextRequest, NextResponse } from "next/server";
import { MenuCategory } from "@prisma/client";
import prismaClient from "@/prisma/prismaClient";
import { Auth } from "@/app/api/utils/oldAuth";
import { MenuCategoryCreate } from "@/app/api/utils/types/MenuCategoryTypes";
import {auth} from "@/app/api/utils/auth";
import { headers } from "next/headers";


// Modify a category. Does not allow modifying products inside the category.
export async function PATCH(
    req: NextRequest
) {
    const category: MenuCategory = await req.json();

    const session = await auth.api.getSession({headers: await headers()});
    const authCheck: Auth = new Auth(session, category)
        .requireRoles(["board"])
        .requireParams(["id"]); // only id is strictly required

    if (authCheck.failed) return authCheck.response;

    try {

        const newProduct = await prismaClient.menuCategory.update({
            where: {
                id: category.id
            },
            data: category
        });

        return authCheck.verify(NextResponse.json(JSON.stringify(newProduct)));
    } catch (e) {
        return authCheck.verify(NextResponse.json(
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

    const session = await auth.api.getSession({headers: await headers()});
    const authCheck = new Auth(session, category)
        .requireRoles(["board"])
        .requireParams(["name"]);

    if (authCheck.failed) return authCheck.response;

    try {
        const newCategory = await prismaClient.menuCategory.create({
            data: category
        });

        // 201 Created
        return authCheck.verify(NextResponse.json(JSON.stringify(newCategory), {status: 201}));
    } catch (e) {
        return authCheck.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}
