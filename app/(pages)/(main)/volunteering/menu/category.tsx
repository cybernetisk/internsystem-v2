import { useEffect, useState } from "react";
import { Button, Input, Stack, Typography } from "@mui/material";
import {
    MenuCategoryCreate,
    MenuCategoryWithProducts,
    MenuProductCreate
} from "@/app/api/v2/escape/menu/products/route";
import { MenuCategory } from "@prisma/client";

import { Product } from "@/app/(pages)/(main)/volunteering/menu/product";

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
                props.category.id !== null ? (
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
                    )
                    : <Typography variant="h2">{ props.category.name }</Typography>
            }


            <Stack justifyContent="space-between" direction="row">
                <Typography variant="h5">Name</Typography>
                <Typography variant="h5">Price</Typography>
                <Typography variant="h5">Volume (cL)</Typography>
                <Typography variant="h5"></Typography>
            </Stack>

            {
                props.category.menu_products.map((item) => (
                        <Product product={ item } key={ item.id } onUpdate={ props.onUpdate }></Product>
                    )
                )
            }

            <NewProduct onUpdate={ props.onUpdate } categoryId={ props.category.id }></NewProduct>
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

function NewProduct(props: { onUpdate: () => void, categoryId: number | null }) {
    let [productName, setProductName] = useState<string>("");
    let [productPrice, setProductPrice] = useState<number | null>(null);
    let [productVolume, setProductVolume] = useState<number | null>(null);

    return (
        <Stack
            direction="row"
            spacing={ 2 }
            justifyContent="space-between"
        >

            <Input
                type="text"
                value={ productName }
                onChange={ e => setProductName(e.target.value) }
                placeholder="Name"
            ></Input>
            <Input
                type="number"
                value={ productPrice ?? "" }
                onChange={ e => setProductPrice(Number(e.target.value)) }
                placeholder="Price"
            ></Input>

            <Input
                type="number"
                value={ productVolume ?? "" }
                onChange={ e => setProductVolume(Number(e.target.value)) }
                placeholder="Volume"
            ></Input>

            <Button
                onClick={ () => createProduct({
                    name: productName,
                    price: productPrice,
                    volume: productVolume,
                    priceVolunteer: 0,
                    glutenfree: 0,
                    category_id: props.categoryId
                }).then(() => {
                    setProductVolume(null);
                    setProductPrice(null)
                    setProductName("");
                    props.onUpdate();
                }) }

            >Create</Button>
        </Stack>
    );
}

function createProduct(product: MenuProductCreate): Promise<Response> {
    return fetch("/api/v2/escape/menu/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(product)
    });
}
