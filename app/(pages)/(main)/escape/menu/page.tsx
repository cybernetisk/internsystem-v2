"use client";

import { Button, Card, Collapse, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";


export default function menu() {
    const [menuCategories, setMenuCategories] = useState<MenuCategoryWithProducts[]>([]);

    useEffect(() => {
        fetch("/api/v2/escape/menu")
            .then(res => res.json())
            .then(categories => setMenuCategories(categories))
    }, []);

    return (
        <div>
            <Typography
                variant="h2">
                Menu
            </Typography>

            { menuCategories.map((item) =>

                <Category key={ item.id } category={ item }></Category>
            ) }
        </div>
    )
}

function Category(props: {
    category: MenuCategoryWithProducts,
}) {
    const category = props.category;
    const [expanded, setExpanded] = useState(false);

    return (
        <Card>

            <Button
                fullWidth
                variant="contained"
                onClick={ () => setExpanded(!expanded) }
            >

                <Typography variant="h4">{ category.name }</Typography>
            </Button>

            <Collapse in={ expanded }>
                <Grid container spacing={ 2 } columns={ 3 }>
                    {
                        category.menu_products.map((item) =>
                            <>
                                <Grid item xs={ 1 }>
                                    <Typography>{ item.name }</Typography>
                                </Grid>
                                <Grid item xs={ 1 }>
                                    <Typography>{ item.volume } CL</Typography>
                                </Grid>
                                <Grid item xs={ 1 }>
                                    <Typography>{ item.price },-</Typography>
                                </Grid>
                            </>
                        )
                    }
                </Grid>


            </Collapse>
        </Card>
    )

}
