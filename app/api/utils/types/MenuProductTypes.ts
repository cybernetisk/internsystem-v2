import { Prisma } from "@prisma/client";

export type MenuProductCreate = Prisma.MenuProductCreateArgs["data"]

export interface MenuProductSwapOrderingRequestData {
    swapId: number;
    withId: number;
}