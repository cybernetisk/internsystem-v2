import { MenuProduct } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button, Checkbox, FormControlLabel, Grid, TextField } from "@mui/material";
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
    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);

    let [valid, setValid] = useState<boolean>(false);
    let [newProduct, setNewProduct] = useState<ProductInputs>(props.product);


    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [newProduct]);

    return (

        <>
            <ProductInputs product={ newProduct } onUpdate={ value => {
                console.log(value)
                setValid(value.valid);
                setNewProduct(value.product);
            } }></ProductInputs>

            <Grid item xs={ 1 }>
                <Button
                    disabled={ !valid || !hasBeenUpdated }
                    onClick={ () => updateProduct(props.product, newProduct).then(() => {
                        setHasBeenUpdated(false);
                        props.onUpdate();
                    }) }

                >Update</Button>
            </Grid>
        </>
    )
}

type ProductInputs = {
    name: string,
    price: number,
    volume: number,
    glutenfree: boolean,
};

function ProductInputs(
    props: {

        product: ProductInputs,
        onUpdate: (value: {
            product: ProductInputs
            valid: boolean
        }) => void,

        validateInputs?: boolean
    }
) {
    const validateInputs = props.validateInputs ?? true;

    const nameValid = props.product.name.trim() !== "";
    const priceValid = props.product.price > 0;
    const volumeValid = props.product.volume > 0;

    const valid = nameValid && priceValid && volumeValid;

    return (
        <>
            <Grid item xs={ 2 }>
                <TextField
                    type="text"
                    value={ props.product.name }
                    onChange={ e => props.onUpdate({valid, product: {...props.product, name: e.target.value}}) }

                    label="Product Name"
                    placeholder="Product Name"


                    error={ !nameValid && validateInputs }
                    helperText={ !nameValid && validateInputs ? "Name must be set" : "" }
                ></TextField>
            </Grid>


            <Grid item xs={ 2 }>
                <TextField
                    type="number"
                    value={ props.product.price }
                    onChange={ e => props.onUpdate({
                        valid,
                        product: {...props.product, price: Number(e.target.value)}
                    }) }

                    placeholder="Product Price"
                    label="Product Price"
                    error={ !priceValid && validateInputs }
                    helperText={ !priceValid && validateInputs ? "Price must be greater than 0" : "" }
                ></TextField>
            </Grid>

            <Grid item xs={ 2 }>
                <TextField
                    type="number"
                    value={ props.product.volume }
                    onChange={ e => props.onUpdate({
                        valid,
                        product: {...props.product, volume: Number(e.target.value)}
                    }) }

                    label="Volume (cL)"
                    placeholder="Volume (cL)"

                    error={ !volumeValid && validateInputs }
                    helperText={ !volumeValid && validateInputs ? "Volume must be greater than 0" : "" }
                ></TextField>
            </Grid>

            <Grid item xs={ 1 } display="flex" justifyContent="center" alignItems="center">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={props.product.glutenfree}

                            onChange={ e => props.onUpdate({
                                valid,
                                product: {...props.product, glutenfree: e.target.checked}
                            }) }
                        />
                    }
                    label={ "Gluten-free" }
                />
            </Grid>
        </>)
}

export function NewProduct(props: { onUpdate: () => void, categoryId: number | null }) {
    const initialState: ProductInputs = {
        name: "",
        price: 0,
        volume: 0,
        glutenfree: false,
    };

    let [newProduct, setNewProduct] = useState<ProductInputs>(initialState);

    let [isFirst, setIsFirst] = useState<boolean>(true);
    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [newProduct]);


    return (
        <>
            <ProductInputs validateInputs={ hasBeenUpdated } product={ newProduct } onUpdate={ (value) => {
                setNewProduct(value.product);

            } }/>

            <Grid item xs={ 1 }>
                <Button
                    onClick={ () => createProduct({
                        ...newProduct,
                        priceVolunteer: 0,
                        category_id: props.categoryId
                    }).then(() => {
                        setNewProduct(initialState);
                        props.onUpdate();
                    }) }

                >Create</Button>
            </Grid>
        </>
    )
        ;
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