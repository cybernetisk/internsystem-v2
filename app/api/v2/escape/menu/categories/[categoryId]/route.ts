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
        .requireRoles([])
        .requireParams(["categoryId"]);

    if (auth.failed) return auth.response;

    let categoryId = Number(params.categoryId);
    // verify productId is an integer
    if (isNaN(categoryId) || !categoryId) {
        return NextResponse.json({error: "categoryId must be an integer"}, {status: 400});
    }


    await prisma.$transaction(async () => {
        await prisma.menuProduct.deleteMany({
            where: {
                category_id: categoryId
            }
        });

        await prisma.menuCategory.delete(
            {
                where: {
                    id: categoryId,
                },
            }
        );
    });

    return NextResponse.json({})
}