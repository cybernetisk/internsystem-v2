import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/prismaClient";
import { Prisma } from "@prisma/client";
import { Auth } from "@/app/api/utils/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/utils/authOptions";


// delete a product with the given id
export async function DELETE(
    _req: NextRequest,
    context: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
    let params = await context.params;

    const session = await getServerSession(authOptions);
    const auth = new Auth(session, params)
        .requireRoles(["admin"])
        .requireParams(["productId"]);

    const productId = Number(params.productId);

    if (auth.failed) return auth.response;

    // verify productId is an integer
    if (isNaN(productId) || !productId) {
        return auth.verify(NextResponse.json({error: "productId must be an integer"}, {status: 400}));
    }

    try {
        await prisma.menuProduct.delete({
            where: {
                id: productId,
            }
        });
    } catch (error) {
        // error code P2015 means no product with the provided id exists
        // see https://www.prisma.io/docs/orm/reference/error-reference#p2015
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2015") {
            return auth.verify(NextResponse.json({error: "Not found"}, {status: 404}));
        } else {
            return auth.verify(NextResponse.json(
                {error: `something went wrong: ${ error }`},
                {status: 500}
            ));
        }
    }

    return auth.verify(NextResponse.json(JSON.stringify({})));
}