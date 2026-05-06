import {NextRequest, NextResponse} from "next/server";
import prisma from "@/prisma/prismaClient";
import prismaClient from "@/prisma/prismaClient";
import {MenuProduct} from "@prisma/client";
import {Auth} from "@/app/api/utils/oldAuth";
import {MenuProductCreate} from "@/app/api/utils/types/MenuProductTypes";
import {auth} from "@/app/api/utils/auth";
import {headers} from "next/headers";


// Modify a product. Modifies the product based on the id in the request body.
export async function PATCH(
    req: NextRequest
) {
    const product: MenuProduct = await req.json();

    const session = await auth.api.getSession({headers: await headers()});
    const authCheck = new Auth(session, product)
        .requireRoles(["board"])
        .requireParams(["id"]);

    if (authCheck.failed) return authCheck.response;

    try {
        const newProduct = await prismaClient.menuProduct.update({
            where: {
                id: product.id
            },
            data: product
        });

        return authCheck.verify(NextResponse.json(JSON.stringify(newProduct)));
    } catch (e) {
        return authCheck.verify(NextResponse.json(
            {error: `something went wrong: ${e}`},
            {status: 500}
        ));
    }
}


// Create new product.
export async function POST(
    req: NextRequest
) {
    const product: MenuProductCreate = await req.json();

    const session = await auth.api.getSession({headers: await headers()});
    const authCheck = new Auth(session, product)
        .requireRoles(["board"])
        .requireParams(["name", "hidden", "price", "volume", "glutenfree", "category_id", "priceVolunteer"]);

    if (authCheck.failed) return authCheck.response;

    try {
        const newProduct = await prisma.menuProduct.create({
            data: product
        });
        // set the ordering to the product's id to make the ordering system work
        await prisma.menuProduct.update({
            where: {
                id: newProduct.id
            },
            data: {
                ordering: newProduct.id
            }
        })

        // 201 Created
        return authCheck.verify(NextResponse.json(JSON.stringify({}), {status: 201}));
    } catch (e) {
        return authCheck.verify(NextResponse.json(
            {error: `something went wrong: ${e}`},
            {status: 500}
        ));
    }
}

