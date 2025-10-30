import { Divider, Grid, Stack, Typography } from "@mui/material";
import { MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";
import { MenuProduct } from "@prisma/client";
import prisma from "@/prisma/prismaClient";


export default async function EscapeMenu() {
    const menu: MenuCategoryWithProducts[] = await prisma.menuCategory.findMany({
        include: {
            menu_products: true
        }
    });


    return (
        <Stack direction="column" spacing={ 4 }>
            <Typography
                variant="h2">
                Menu
            </Typography>

            { menu.map((item) =>

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

            <Grid container rowSpacing={ 1 } columns={ 10 } paddingLeft={ 4 }>

                {
                    category.menu_products.map((item) => (
                        <Product product={ item } key={ item.id }/>
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
            <Grid item xs={ 4 } md={ 8 }>
                <Typography>
                    { product.name }

                    { product.glutenfree ? <sup> (Gluten-free)</sup> : <></> }
                </Typography>
            </Grid>
            <Grid item md={ 1 } xs={ 3 }>
                <Typography>{ product.volume } CL</Typography>
            </Grid>
            <Grid item md={ 1 } xs={ 3 }>
                <Typography>{ product.price },-</Typography>
            </Grid>
        </>
    )

}