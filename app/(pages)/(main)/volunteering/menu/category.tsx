// This file contains react components for individual categories, and relevant utility functions.

import { useEffect, useState } from "react";
import { Button, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import { MenuCategory } from "@prisma/client";

import { NewProduct, Product } from "@/app/(pages)/(main)/volunteering/menu/product";
import { styled } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import { DeletionConfirmationDialog } from "@/app/components/input/DeletionConfirmationDialog";
import { MenuCategoryCreate, MenuCategoryWithProducts } from "@/app/api/utils/types/MenuCategoryTypes";


// Updates a given category.
function updateCategory(category: MenuCategoryWithProducts, newAttributes: Partial<MenuCategory>): Promise<Response> {

    return fetch("/api/v2/escape/menu/categories", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...category, ...newAttributes, ...{menu_products: undefined}}) // set menu_products to undefined, because trying to PATCH the category with products makes Prisma angry
    });
}

// Creates a given category.
function createCategory(category: MenuCategoryCreate): Promise<Response> {
    return fetch("/api/v2/escape/menu/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category)
    });
}

function deleteCategory(categoryId: number): Promise<Response> {
    return fetch(`/api/v2/escape/menu/categories/${ categoryId }`, {
        method: "DELETE",
    });
}

// a <Textfield> with larger text. Equivalent font-size to <h2>
const LargeTextField = styled(TextField)({
    "& .MuiOutlinedInput-input": {
        fontSize: "3.75rem",
    }
})

export function Category(
    props: {
        category: MenuCategoryWithProducts,
        onUpdate: () => void // called when the category has been updated in the database.
    }
) {

    let [categoryName, setCategoryName] = useState<string>(props.category.name);

    // validate category name. Category name cannot be empty.
    const categoryNameInvalid: boolean = categoryName.trim() === "";

    // these are used to disable the UPDATE button when user has not inputted anything yet.
    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);

    // is used for the spinner inside the UPDATE button
    let [isUpdating, setIsUpdating] = useState<boolean>(false);


    let [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    let [isDeleting, setIsDeleting] = useState<boolean>(false);


    useEffect(() => {
        // useEffect is always run once at the start.
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        // this happens when categoryName has been updated for the first time.
        setHasBeenUpdated(true);
    }, [categoryName]);

    return (
        <Stack>
            <Grid container spacing={ 2 } columns={ 10 }>

                <Grid item xs={ 8 }>
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
                </Grid>

                <Grid item xs={ 1 } display="flex" alignItems="center">
                    <Button // UPDATE button
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
                    >
                        {
                            isUpdating ? <CircularProgress/> : <>Update</> // show spinner when updating is in progress
                        }
                    </Button>
                </Grid>

                <Grid item xs={ 1 } display="flex" alignItems="center">
                    <Button
                        color="error"
                        onClick={ () => {
                            setDeleteDialogOpen(true);
                        } }
                    >
                        Delete
                    </Button>
                </Grid>
            </Grid>


            <Grid container spacing={ 2 } columns={ 10 }>

                <Grid item xs={ 2 }>
                    <Typography variant="h5">Name</Typography>
                </Grid>
                <Grid item xs={ 2 }>
                    <Typography variant="h5">Price</Typography>
                </Grid>
                <Grid item xs={ 2 }>
                    <Typography variant="h5">Volume (cL)</Typography>
                </Grid>
                <Grid item xs={ 3 }>
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

            <DeletionConfirmationDialog
                open={ deleteDialogOpen }
                onClose={ () => setDeleteDialogOpen(false) }
                onDelete={ () => {
                    setIsDeleting(true);
                    deleteCategory(props.category.id).then(() => {
                        props.onUpdate();
                    });
                } }
                showSpinner={ isDeleting }
                title="Delete category?"
            >
                Are you sure you want to delete this category?
            </DeletionConfirmationDialog>
        </Stack>
    )
}

export function NewCategory(props: { onUpdate: () => void }) {
    let [categoryName, setCategoryName] = useState<string>("");
    let [isCreating, setIsCreating] = useState<boolean>(false);

    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);

    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [categoryName]);


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
                error={ invalid && hasBeenUpdated}
                helperText={ invalid && hasBeenUpdated ? "Name must not be empty" : "" }
            ></TextField>

            <Button

                disabled={ invalid || !hasBeenUpdated }

                onClick={ () => {
                    setIsCreating(true);
                    createCategory(
                        {name: categoryName}
                    ).then(() => {
                        setCategoryName("");
                        setIsCreating(false);
                        props.onUpdate();
                    });
                } }
            >{ isCreating ? <CircularProgress/> : <>Create</> }</Button>


        </Stack>
    )
}
