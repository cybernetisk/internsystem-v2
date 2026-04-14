import prisma from "@/prisma/prismaClient";
import {NextResponse} from "next/server";
import {getServerSession} from "next-auth";
import {Auth} from "@/app/api/utils/auth";
import {authOptions} from "@/app/api/utils/authOptions";
import {MenuCategoryWithProducts} from "@/app/api/utils/types/MenuCategoryTypes";

// Gets the whole menu
export async function GET(): Promise<NextResponse> {
    const session = getServerSession(authOptions);
    const auth = new Auth(session);

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

    return auth.verify(NextResponse.json(menuCategories));
}