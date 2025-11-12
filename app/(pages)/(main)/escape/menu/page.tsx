import { Divider, Grid, Stack, Typography } from "@mui/material";
import { MenuProduct } from "@prisma/client";
import prisma from "@/prisma/prismaClient";
import { MenuCategoryWithProducts } from "@/app/api/utils/types/MenuCategoryTypes";


export default async function EscapeMenu() {
    const menu: MenuCategoryWithProducts[] = await prisma.menuCategory.findMany({
        include: {
            menu_products: {
                where: {
                    hidden: false
                }
            }
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

// Individual menu category.
function Category(props: {
    category: MenuCategoryWithProducts,
}) {
    const category = props.category;

    return (
        <Stack>
            <Typography variant="h4">{ category.name }</Typography>

            <Grid container rowSpacing={1} columnSpacing={2} columns={ 10 } paddingLeft={ {md: 4, xs: 0} }>

                {
                    category.menu_products.map((item) => (
                        <Product product={ item } key={ item.id }/>
                    ))
                }
            </Grid>
        </Stack>
    )

}

// Individual menu product.
function Product(
    props: {
        product: MenuProduct
    }
) {

    const product = props.product;

    return (
        <>
            <Grid item xs={ 6 } md={ 8 }>
                <Typography style={{overflowWrap: "anywhere", hyphens: "auto"}}>
                    { product.name }

                    { product.glutenfree ? <sup> (Gluten-free)</sup> : <></> }
                </Typography>
            </Grid>
            <Grid item xs={ 2 } md={ 1 }>
                <Typography>{ product.volume } CL</Typography>
            </Grid>
            <Grid item xs={ 2 } md={ 1 }>
                <Typography>{ product.price },-</Typography>
            </Grid>
        </>
    )

}