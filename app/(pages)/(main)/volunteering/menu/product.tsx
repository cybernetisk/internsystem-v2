import { MenuProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button, Input, Stack } from "@mui/material";

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

        <Stack
            direction="row"
            spacing={ 2 }
            justifyContent="space-between"
        >

            <Input
                type="text"
                value={ productName }
                onChange={ e => setProductName(e.target.value) }
            ></Input>
            <Input
                type="number"
                value={ productPrice }
                onChange={ e => setProductPrice(Number(e.target.value)) }
            ></Input>

            <Input
                type="number"
                value={ productVolume }
                onChange={ e => setProductVolume(Number(e.target.value)) }
            ></Input>

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
        </Stack>
    )
}