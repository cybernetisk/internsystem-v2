import prisma from "@/prisma/prismaClient";
import {NextResponse} from "next/server";
import {Auth} from "@/app/api/utils/oldAuth";
import {MenuCategoryWithProducts} from "@/app/api/utils/types/MenuCategoryTypes";
import {auth} from "@/app/api/utils/auth";
import {headers} from "next/headers";

// Gets the whole menu
export async function GET(): Promise<NextResponse> {
    const session = auth.api.getSession({headers: await headers()});
    const authCheck = new Auth(session);

    let menuCategories: MenuCategoryWithProducts[] = await prisma.menuCategory.findMany(
        {
            include: {
                menu_products: {
                    orderBy: [
                        {ordering: "asc"},
                        {id: "asc"}
                    ]
                }
            }
        }
    );

    return authCheck.verify(NextResponse.json(menuCategories));
}