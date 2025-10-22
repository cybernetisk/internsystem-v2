import { MenuProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button, Grid, Input } from "@mui/material";
import { MenuProductCreate } from "@/app/api/v2/escape/menu/products/route";

function updateProduct(product: MenuProduct, newAttributes: Partial<MenuProduct>): Promise<Response> {
    return fetch("/api/v2/escape/menu/products", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...product, ...newAttributes})
    })
}

export function Product(props: { product: MenuProduct, onUpdate: () => void }) {
    const product = props.product;

    let [productName, setProductName] = useState<string>(product.name);
    let [productPrice, setProductPrice] = useState<number>(product.price);
    let [productVolume, setProductVolume] = useState<number>(product.volume);

    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);

    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [productName, productPrice, productVolume]);

    return (

        <>
            <Grid item xs={ 2 }>
                <Input
                    type="text"
                    value={ productName }
                    onChange={ e => setProductName(e.target.value) }
                ></Input>
            </Grid>


            <Grid item xs={ 2 }>
                <Input
                    type="number"
                    value={ productPrice }
                    onChange={ e => setProductPrice(Number(e.target.value)) }
                ></Input>
            </Grid>

            <Grid item xs={ 2 }>
                <Input
                    type="number"
                    value={ productVolume }
                    onChange={ e => setProductVolume(Number(e.target.value)) }
                ></Input>
            </Grid>

            <Grid item xs={ 1 }>
                <Button
                    disabled={ !hasBeenUpdated }
                    onClick={ () => updateProduct(product, {
                        name: productName,
                        price: productPrice,
                        volume: productVolume
                    }).then(() => {
                        setHasBeenUpdated(false)
                        props.onUpdate()
                    }) }

                >Update</Button>
            </Grid>
        </>
    )
}

export function NewProduct(props: { onUpdate: () => void, categoryId: number | null }) {
    let [productName, setProductName] = useState<string>("");
    let [productPrice, setProductPrice] = useState<number | null>(null);
    let [productVolume, setProductVolume] = useState<number | null>(null);

    return (
        <>
            <Grid item xs={ 2 }>
                <Input
                    type="text"
                    value={ productName }
                    onChange={ e => setProductName(e.target.value) }
                    placeholder="Name"
                ></Input>
            </Grid>

            <Grid item xs={ 2 }>
                <Input
                    type="number"
                    value={ productPrice ?? "" }
                    onChange={ e => setProductPrice(Number(e.target.value)) }
                    placeholder="Price"
                ></Input>
            </Grid>

            <Grid item xs={ 2 }>
                <Input
                    type="number"
                    value={ productVolume ?? "" }
                    onChange={ e => setProductVolume(Number(e.target.value)) }
                    placeholder="Volume"
                ></Input>
            </Grid>

            <Grid item xs={ 1 }>
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
            </Grid>
        </>
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