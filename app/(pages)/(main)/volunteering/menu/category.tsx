import { useEffect, useState } from "react";
import { Button, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import { MenuCategoryCreate, MenuCategoryWithProducts } from "@/app/api/v2/escape/menu/products/route";
import { MenuCategory } from "@prisma/client";

import { NewProduct, Product } from "@/app/(pages)/(main)/volunteering/menu/product";
import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";

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

const LargeTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "3.75rem",
    }
})

export function Category(props: { category: MenuCategoryWithProducts, onUpdate: () => void }) {

    let [categoryName, setCategoryName] = useState<string>(props.category.name);

    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);
    let [isUpdating, setIsUpdating] = useState<boolean>(false);

    const categoryNameInvalid: boolean = categoryName.trim() === "";

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
                    <LargeTextField
                        type="text"
                        value={ categoryName }
                        onChange={ (e) => {
                            setCategoryName(e.target.value)
                        } }

                        required
                        label="Category Name"
                        placeholder="Category Name"
                        error={ categoryNameInvalid }
                        helperText={ categoryNameInvalid ? "Name must not be empty" : "" }

                    ></LargeTextField>
                    <Button
                        disabled={ !hasBeenUpdated || categoryNameInvalid || isUpdating }
                        onClick={ () => {
                            setIsUpdating(true);
                            updateCategory(
                                props.category,
                                {name: categoryName}
                            ).then(() => {
                                setHasBeenUpdated(false);
                                setIsFirst(true);
                                setIsUpdating(false);
                                props.onUpdate();
                            });
                        }
                        }

                    >{ isUpdating ? <CircularProgress/> : <>Update</> }</Button>
                </Stack>
            }

            <Grid container spacing={ 2 } columns={ 9 }>

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
    let [isCreating, setIsCreating] = useState<boolean>(false);


    const invalid = categoryName.trim() === "";
    return (
        <Stack justifyContent="space-between" spacing={ 2 }>
            <Typography variant="h3">New Category</Typography>

            <TextField
                type="text"
                value={ categoryName }
                placeholder="Category Name"
                label="Category Name"
                onChange={ (e) => setCategoryName(e.target.value) }
                style={ {fontSize: "3.75rem"} }

                required
                error={ invalid }
                helperText={ invalid ? "Name must not be empty" : "" }
            ></TextField>

            <Button

                disabled={ invalid }

                onClick={ () => {
                    setIsCreating(true);
                    createCategory(
                        {name: categoryName}
                    ).then(() => {
                        setCategoryName("");
                        setIsCreating(false);
                        props.onUpdate();
                    });
                }

                }
            >{ isCreating ? <CircularProgress/> : <>Create</> }</Button>


        </Stack>
    )
}
