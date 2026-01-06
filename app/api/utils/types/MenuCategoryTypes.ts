import { Prisma } from "@prisma/client";
import MenuCategoryDefaultArgs = Prisma.MenuCategoryDefaultArgs;

// see https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
// for an explanation over these two lines. Note: this code is using `satisfies` instead of `Prisma.validator` (also see https://www.prisma.io/blog/satisfies-operator-ur8ys8ccq7zb).
const menuCategoryWithProductsArgs = {include: {menu_products: true}} satisfies MenuCategoryDefaultArgs;
export type MenuCategoryWithProducts = Prisma.MenuCategoryGetPayload<typeof menuCategoryWithProductsArgs>

export type MenuCategoryCreate = Prisma.MenuCategoryCreateArgs["data"]
