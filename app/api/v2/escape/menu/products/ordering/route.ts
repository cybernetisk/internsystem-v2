import {Auth} from "@/app/api/utils/oldAuth";
import {NextRequest, NextResponse} from "next/server";
import {MenuProductSwapOrderingRequestData} from "@/app/api/utils/types/MenuProductTypes";
import prisma from "@/prisma/prismaClient";
import {auth} from "@/app/api/utils/auth";
import {headers} from "next/headers";

export async function PATCH(
    req: NextRequest
) {
    const params: MenuProductSwapOrderingRequestData = await req.json();

    const session = await auth.api.getSession({headers: await headers()})
    const authCheck = new Auth(session, params)
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


    return authCheck.verify(
        NextResponse.json({})
    );
}