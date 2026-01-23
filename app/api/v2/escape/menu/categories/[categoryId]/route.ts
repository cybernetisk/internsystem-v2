import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Auth } from "@/app/api/utils/auth";
import prisma from "@/prisma/prismaClient";
import { authOptions } from "@/app/api/utils/authOptions";

export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ categoryId: string }> }
) {
    const params = await context.params;

    let session = await getServerSession(authOptions);
    let auth = new Auth(session, params)
        .requireRoles(["board"])
        .requireParams(["categoryId"]);

    if (auth.failed) return auth.response;

    let categoryId = Number(params.categoryId);
    // verify productId is an integer
    if (isNaN(categoryId) || !categoryId) {
        return auth.verify(NextResponse.json({error: "categoryId must be an integer"}, {status: 400}));
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

        return auth.verify(NextResponse.json({}))
    } catch (e) {
        return auth.verify(NextResponse.json(
            {error: `something went wrong: ${ e }`},
            {status: 500}
        ));
    }
}