import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import prismaClient from "@/prisma/prismaClient";
import { MenuProduct, Prisma } from "@prisma/client";
import { authOptions } from "@/app/api/utils/authOptions";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";


// Modify a product. Modifies the product based on the id in the request body.
export async function PATCH(
    req: NextRequest
) {
    const product: MenuProduct = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, product)
        .requireRoles([])
        .requireParams(["id"]);

    if (auth.failed) return auth.response;


    const newProduct = await prismaClient.menuProduct.update({
        where: {
            id: product.id
        },
        data: product
    });

    return auth.verify(NextResponse.json(JSON.stringify(newProduct)));
}


// Create new product.
export async function POST(
    req: NextRequest
) {
    const product: MenuProductCreate = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, product)
        .requireRoles([])
        .requireParams(["name", "hidden", "price", "volume", "glutenfree", "category_id", "priceVolunteer"]);

    if (auth.failed) return auth.response;



    await prisma.menuProduct.create({
        data: product
    });

    return auth.verify(NextResponse.json(JSON.stringify({})));
}

const menuCategoryWithProducts = Prisma.validator<Prisma.MenuCategoryDefaultArgs>()({include: {menu_products: true}})
export type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<typeof menuCategoryWithProducts>

// Some utility types.
export type MenuProductCreate = Prisma.MenuProductCreateArgs["data"]
export type MenuCategoryCreate = Prisma.MenuCategoryCreateArgs["data"]