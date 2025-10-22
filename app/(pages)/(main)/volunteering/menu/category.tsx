import { useEffect, useState } from "react";
import { Button, Grid, Input, Stack, Typography } from "@mui/material";
import { MenuCategoryCreate, MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";
import { MenuCategory } from "@prisma/client";

import { NewProduct, Product } from "@/app/(pages)/(main)/volunteering/menu/product";

function updateCategory(category: MenuCategoryWithProducts, newAttributes: Partial<MenuCategory>): Promise<Response> {

    return fetch("/api/v2/escape/menu/categories", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...category, ...newAttributes, ...{menu_products: undefined}})
    });
}

function createCategory(category: MenuCategoryCreate): Promise<Response> {
    return fetch("/api/v2/escape/menu/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category)
    });
}

export function Category(props: { category: MenuCategoryWithProducts, onUpdate: () => void }) {

    let [categoryName, setCategoryName] = useState<string>(props.category.name);

    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);


    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [categoryName]);

    return (
        <Stack>
            {

                <Stack direction="row" justifyContent="space-between">
                    <Input
                        type="text"
                        value={ categoryName }
                        onChange={ (e) => {
                            setCategoryName(e.target.value)
                        } }

                        style={
                            {
                                fontSize: "3.75rem"
                            }
                        }

                    ></Input>
                    <Button
                        disabled={ !hasBeenUpdated }
                        onClick={ () => {
                            updateCategory(
                                props.category,
                                {name: categoryName}
                            ).then(() => {
                                setHasBeenUpdated(false);
                                props.onUpdate();
                            })
                        }
                        }

                    >Update</Button>
                </Stack>
            }

            <Grid container columns={ 8 }>

                <Grid item xs={ 2 }>
                    <Typography variant="h5">Name</Typography>
                </Grid>
                <Grid item xs={ 2 }>
                    <Typography variant="h5">Price</Typography>
                </Grid>
                <Grid item xs={ 2 }>
                    <Typography variant="h5">Volume (cL)</Typography>
                </Grid>
                <Grid item xs={ 2 }>
                    <div></div>
                </Grid>

                {
                    props.category.menu_products.map((item) => (
                            <Product product={ item } key={ item.id } onUpdate={ props.onUpdate }></Product>
                        )
                    )
                }

                <NewProduct onUpdate={ props.onUpdate } categoryId={ props.category.id }></NewProduct>
            </Grid>
        </Stack>
    )
}

export function NewCategory(props: { onUpdate: () => void }) {
    let [categoryName, setCategoryName] = useState<string>("");

    return (
        <Stack justifyContent="space-between">
            <Input
                type="text"
                value={ categoryName }
                placeholder="New Category"
                onChange={ (e) => setCategoryName(e.target.value) }
                style={ {fontSize: "3.75rem"} }

            ></Input>

            <Button
                onClick={ () => createCategory(
                    {name: categoryName}
                ).then(() => {
                    setCategoryName("");
                    props.onUpdate();
                })

                }
            >Create</Button>

        </Stack>
    )
}
