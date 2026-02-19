import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/utils/authOptions";
import {Auth} from "@/app/api/utils/auth";
import {NextRequest, NextResponse} from "next/server";
import {MenuProductSwapOrderingRequestData} from "@/app/api/utils/types/MenuProductTypes";
import prisma from "@/prisma/prismaClient";

export async function PATCH(
    req: NextRequest
) {
    const params: MenuProductSwapOrderingRequestData = await req.json();

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, params)
        .requireRoles(["board"])
        .requireParams(["swapId", "withId"]);

    await prisma.$transaction(async (tx) => {
        const swap = await prisma.menuProduct.findFirst({
            where: {id: params.swapId}
        });
        const withProduct = await prisma.menuProduct.findFirst({
            where: {id: params.withId}
        });

        // swap ordering
        await tx.menuProduct.update({
            where: {
                id: swap.id
            },
            data: {
                ordering: withProduct.ordering
            }
        });
        await tx.menuProduct.update({
            where: {
                id: withProduct.id
            },
            data: {
                ordering: swap.ordering
            }
        });
    });


    return auth.verify(
        NextResponse.json({})
    );
}