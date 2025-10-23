import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import prismaClient from "@/prisma/prismaClient";
import { MenuProduct, Prisma } from "@prisma/client";
import { authOptions } from "@/app/api/utils/authOptions";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";

export async function PATCH(
    req: NextRequest
) {
    const session = await getServerSession(authOptions);
    const authCheck = new Auth(session)
        .requireRoles([]);

    if (authCheck.failed) return authCheck.response;


    const product: MenuProduct = await req.json();

    const newProduct = await prismaClient.menuProduct.update({
        where: {
            id: product.id
        },
        data: product
    });



    return NextResponse.json(JSON.stringify(newProduct));
}

export async function POST(
    req: NextRequest
) {
    const session = await getServerSession(authOptions);
    const authCheck = new Auth(session)
        .requireRoles([]);

    if (authCheck.failed) return authCheck.response;


    const product: MenuProductCreate = await req.json();

    await prisma.menuProduct.create({
        data: product
    });

    return NextResponse.json(JSON.stringify({}));
}

const menuCategoryWithProducts = Prisma.validator<Prisma.MenuCategoryDefaultArgs>()({include: {menu_products: true}})
export type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<typeof menuCategoryWithProducts>

export type MenuProductCreate = Prisma.MenuProductCreateArgs["data"]
export type MenuCategoryCreate = Prisma.MenuCategoryCreateArgs["data"]