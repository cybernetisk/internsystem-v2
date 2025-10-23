"use client";

import { Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";
import authWrapper from "@/app/middleware/authWrapper";
import { Category, NewCategory } from "@/app/(pages)/(main)/volunteering/menu/category";

// require login
export default authWrapper(MenuEditPage);

function MenuEditPage() {
    const [menuCategories, setMenuCategories] = useState<MenuCategoryWithProducts[]>([]);

    useEffect(() => {
        refetchMenu();
    }, []);

    const refetchMenu = () => fetchMenu().then(menu => setMenuCategories(menu));

    return (
        <Stack spacing={ 10 }>
            {
                menuCategories.map((item) => {
                    return (
                        <Category
                            category={ item }
                            key={ item.id }
                            onUpdate={
                                refetchMenu
                            }
                        ></Category>
                    );
                })
            }

            <NewCategory onUpdate={ refetchMenu }></NewCategory>
        </Stack>
    )
}

async function fetchMenu(): Promise<MenuCategoryWithProducts[]> {
    const menu = await fetch("/api/v2/escape/menu");
    return await menu.json();
}

