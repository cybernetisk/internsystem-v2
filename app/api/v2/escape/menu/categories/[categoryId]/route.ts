import { NextRequest, NextResponse } from "next/server";
import { Auth } from "@/app/api/utils/oldAuth";
import prisma from "@/prisma/prismaClient";
import {auth} from "@/app/api/utils/auth";
import {headers} from "next/headers";

export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ categoryId: string }> }
) {
    const params = await context.params;

    let session = await auth.api.getSession({headers: await headers()});
    let authCheck = new Auth(session, params)
        .requireRoles(["board"])
        .requireParams(["categoryId"]);

    if (authCheck.failed) return authCheck.response;

    let categoryId = Number(params.categoryId);
    // verify productId is an integer
    if (isNaN(categoryId) || !categoryId) {
        return authCheck.verify(NextResponse.json({error: "categoryId must be an integer"}, {status: 400}));
    }

    try {
        await prisma.$transaction(async transaction => {
            await transaction.menuProduct.deleteMany({
                where: {
                    category_id: categoryId
                }
            });

            await transaction.menuCategory.delete(
                {
                    where: {
                        id: categoryId,
                    },
                }
            );
        });

        return authCheck.verify(NextResponse.json({}))
    } catch (e) {
        return authCheck.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}