"use client";

import { Divider, Grid, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";
import { MenuProduct } from "@prisma/client";


export default function EscapeMenu() {
    const [menuCategories, setMenuCategories] = useState<MenuCategoryWithProducts[]>([]);

    useEffect(() => {
        fetch("/api/v2/escape/menu")
            .then(res => res.json())
            .then(categories => setMenuCategories(categories))
    }, []);

    return (
        <Stack direction="column" spacing={ 4 }>
            <Typography
                variant="h2">
                Menu
            </Typography>

            { menuCategories.map((item) =>

                <Stack direction="column" key={ item.id } spacing={ 1 }>
                    <Category category={ item }></Category>
                    <Divider/>
                </Stack>
            ) }
        </Stack>
    )
}

function Category(props: {
    category: MenuCategoryWithProducts,
}) {
    const category = props.category;

    return (
        <Stack>
            <Typography variant="h4">{ category.name }</Typography>

            <Grid container rowSpacing={ 1 } columns={10} paddingLeft={ 4 }>

                {
                    category.menu_products.map((item) => (
                        <Product product={ item }/>
                    ))
                }
            </Grid>
        </Stack>
    )

}

function Product(
    props: {
        product: MenuProduct
    }
) {

    const product = props.product;

    return (
        <>
            <Grid item xs={ 4 } md={8}>
                <Typography>
                    { product.name }

                    { product.glutenfree ? <sup> (Gluten-free)</sup> : <></> }
                </Typography>
            </Grid>
            <Grid item md={ 1 } xs={3}>
                <Typography>{ product.volume } CL</Typography>
            </Grid>
            <Grid item md={ 1 } xs={ 3}>
                <Typography>{ product.price },-</Typography>
            </Grid>
        </>
    )

}