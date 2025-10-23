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
    let [newProduct, setNewProduct] = useState<ProductInputsState>({
        product: props.product,
        valid: {
            name: true,
            price: true,
            volume: true,
            allValid: true,
        }
    });


    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [newProduct]);

    return (

        <>
            <ProductInputs state={ newProduct } onUpdate={ value => {
                console.log(value)
                setValid(value.valid.allValid);
                setNewProduct(value);
            } }></ProductInputs>

            <Grid item xs={ 1 }>
                <Button
                    disabled={ !valid || !hasBeenUpdated }
                    onClick={ () => updateProduct(props.product, newProduct.product).then(() => {
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

type ProductInputsState = {
    product: ProductInputs;
    valid: {
        name: boolean;
        price: boolean;
        volume: boolean;
        allValid: boolean;
    };
}

function ProductInputs(
    props: {

        state: ProductInputsState,
        onUpdate: (state: ProductInputsState) => void,

        validateInputs?: boolean
    }
) {
    const validateInputs = props.validateInputs ?? true;
    const product = props.state.product;

    function isValid(product: ProductInputs): ProductInputsState["valid"] {
        const name = product.name.trim() !== "";
        const price = product.price > 0;
        const volume = product.volume > 0;
        return {
            name,
            price,
            volume,
            allValid: name && price && volume,
        }
    }


    return (
        <>
            <Grid item xs={ 2 }>
                <TextField
                    type="text"
                    value={ product.name }
                    onChange={ e => {
                        const newProduct = {...product, name: e.target.value};
                        props.onUpdate(
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    } }

                    label="Product Name"
                    placeholder="Product Name"


                    error={ !props.state.valid.name && validateInputs }
                    helperText={ !props.state.valid.name && validateInputs ? "Name must be set" : "" }
                ></TextField>
            </Grid>


            <Grid item xs={ 2 }>
                <TextField
                    type="number"
                    value={ product.price }
                    onChange={ e => {
                        const newProduct = {...product, price: Number(e.target.value)};
                        props.onUpdate(
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    } }

                    placeholder="Product Price"
                    label="Product Price"
                    error={ !props.state.valid.price && validateInputs }
                    helperText={ !props.state.valid.price && validateInputs ? "Price must be greater than 0" : "" }
                ></TextField>
            </Grid>

            <Grid item xs={ 2 }>
                <TextField
                    type="number"
                    value={ product.volume }
                    onChange={ e => {
                        const newProduct = {...product, volume: Number(e.target.value)};
                        props.onUpdate(
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    } }

                    label="Volume (cL)"
                    placeholder="Volume (cL)"

                    error={ !props.state.valid.volume && validateInputs }
                    helperText={ !props.state.valid.volume && validateInputs ? "Volume must be greater than 0" : "" }
                ></TextField>
            </Grid>

            <Grid item xs={ 1 } display="flex" justifyContent="center" alignItems="center">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={ product.glutenfree }

                            onChange={ e => {
                                const newProduct = {...product, glutenfree: e.target.checked};
                                props.onUpdate(
                                    {
                                        valid: isValid(newProduct),
                                        product: newProduct
                                    }
                                );
                            } }
                        />
                    }
                    label={ "Gluten-free" }
                />
            </Grid>
        </>)
}

export function NewProduct(props: { onUpdate: () => void, categoryId: number | null }) {
    const initialState: ProductInputsState = {
        product: {
            name: "",
            price: 0,
            volume: 0,
            glutenfree: false,
        },
        valid: {
            name: false,
            volume: false,
            allValid: false,
            price: false
        },
    };

    let [newProduct, setNewProduct] = useState<ProductInputsState>(initialState);

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
            <ProductInputs validateInputs={ hasBeenUpdated } state={ newProduct } onUpdate={ (value) => {
                setNewProduct(value);

            } }/>

            <Grid item xs={ 1 }>
                <Button
                    onClick={ () => createProduct({
                        ...newProduct.product,
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