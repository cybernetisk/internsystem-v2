import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import prismaClient from "@/prisma/prismaClient";
import { MenuProduct } from "@prisma/client";
import { authOptions } from "@/app/api/utils/authOptions";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";
import { MenuProductCreate } from "@/app/api/utils/types/MenuProductTypes";


// Modify a product. Modifies the product based on the id in the request body.
export async function PATCH(
    req: NextRequest
) {
    const product: MenuProduct = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, product)
        .requireRoles(["admin"])
        .requireParams(["id"]);

    if (auth.failed) return auth.response;

    try {
        const newProduct = await prismaClient.menuProduct.update({
            where: {
                id: product.id
            },
            data: product
        });

        return auth.verify(NextResponse.json(JSON.stringify(newProduct)));
    } catch (e) {
        return auth.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}


// Create new product.
export async function POST(
    req: NextRequest
) {
    const product: MenuProductCreate = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, product)
        .requireRoles(["admin"])
        .requireParams(["name", "hidden", "price", "volume", "glutenfree", "category_id", "priceVolunteer"]);

    if (auth.failed) return auth.response;

    try {
        await prisma.menuProduct.create({
            data: product
        });

        // 201 Created
        return auth.verify(NextResponse.json(JSON.stringify({}), {status: 201}));
    } catch (e) {
        return auth.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}

