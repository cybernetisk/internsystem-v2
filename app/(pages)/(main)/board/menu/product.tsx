import {MenuProduct} from "@prisma/client";
import {useEffect, useState} from "react";
import {Button, Checkbox, FormControlLabel, Grid, Stack, TextField, Tooltip} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {DeletionConfirmationDialog} from "@/app/components/input/DeletionConfirmationDialog";
import {MenuProductCreate} from "@/app/api/utils/types/MenuProductTypes";

export function updateProduct(product: MenuProduct, newAttributes: Partial<MenuProduct>): Promise<Response> {
    return fetch("/api/v2/escape/menu/products", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({...product, ...newAttributes})
    });
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

function deleteProduct(productId: number): Promise<Response> {
    return fetch(`/api/v2/escape/menu/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export function swapProductOrder(swapId: number, withId: number): Promise<Response> {
    return fetch(`/api/v2/escape/menu/products/ordering`, {
        method: "PATCH",
        body: JSON.stringify({
            swapId,
            withId
        }),
        headers: {
            "Content-Type": "application/json",
        }
    });
}

export function Product(props: {
    product: MenuProduct,
    onUpdate: () => void,
    onMove: (direction: "up" | "down") => void
}) {
    let [hasBeenUpdated, setHasBeenUpdated] = useState<boolean>(false);
    let [isFirst, setIsFirst] = useState<boolean>(true);

    let [isUpdating, setIsUpdating] = useState<boolean>(false);

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

    let [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    let [isDeleting, setIsDeleting] = useState<boolean>(false);


    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [newProduct]);

    return (

        <>
            <Grid item xs={1}>
                <Stack direction="column">
                    <Button onClick={() => props.onMove("up")}>Up</Button>
                    <Button onClick={() => props.onMove("down")}>Down</Button>
                </Stack>
            </Grid>
            { /* shared inputs */}
            <ProductInputs state={newProduct} onUpdate={value => {
                setValid(value.valid.allValid);
                setNewProduct(value);
            }}></ProductInputs>

            <Grid item xs={1}>
                <Button
                    disabled={!valid || !hasBeenUpdated || isUpdating}
                    onClick={() => {
                        setIsUpdating(true);
                        updateProduct(props.product, newProduct.product).then(() => {
                            setIsUpdating(false);
                            setHasBeenUpdated(false);
                            props.onUpdate();
                        })
                    }}

                >{isUpdating ? <CircularProgress/> : <>Update</>}</Button>
            </Grid>

            <Grid item xs={1}>

                <Button
                    color="error"
                    disabled={isUpdating}
                    onClick={() => setDeleteDialogOpen(true)}
                >
                    Delete
                </Button>

                <DeletionConfirmationDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onDelete={() => {
                        setIsDeleting(true);
                        deleteProduct(props.product.id).then(() => {
                            setIsDeleting(false);
                            setDeleteDialogOpen(false);

                            props.onUpdate();
                        });
                    }}
                    showSpinner={isDeleting}
                    title={"Delete product?"}
                >
                    Are you sure you want to delete this product?
                </DeletionConfirmationDialog>
            </Grid>
        </>
    )
}

type ProductInputs = {
    name: string,
    price: number,
    volume: number,
    glutenfree: boolean,
    hidden: boolean,
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

// Due to the fact that NewProduct and Product share the same inputs, they are extracted here.
// This component *does not* keep track of any state.
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
            <Grid item xs={2}>
                <TextField
                    type="text"
                    value={product.name}
                    onChange={e => { // all the inputs here are essentially the same.
                        const newProduct = {...product, name: e.target.value}; // create new product.
                        props.onUpdate( // propagate upwards.
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    }}

                    label="Product Name"
                    placeholder="Product Name"


                    error={!props.state.valid.name && validateInputs}
                    helperText={!props.state.valid.name && validateInputs ? "Name must be set" : ""}
                ></TextField>
            </Grid>


            <Grid item xs={2}>
                <TextField
                    type="number"
                    value={product.price}
                    onChange={e => {
                        const newProduct = {...product, price: Number(e.target.value)};
                        props.onUpdate(
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    }}

                    placeholder="Product Price"
                    label="Product Price"
                    error={!props.state.valid.price && validateInputs}
                    helperText={!props.state.valid.price && validateInputs ? "Price must be greater than 0" : ""}
                ></TextField>
            </Grid>

            <Grid item xs={2}>
                <TextField
                    type="number"
                    value={product.volume}
                    onChange={e => {
                        const newProduct = {...product, volume: Number(e.target.value)};
                        props.onUpdate(
                            {
                                valid: isValid(newProduct),
                                product: newProduct
                            }
                        );
                    }}

                    label="Volume (cL)"
                    placeholder="Volume (cL)"

                    error={!props.state.valid.volume && validateInputs}
                    helperText={!props.state.valid.volume && validateInputs ? "Volume must be greater than 0" : ""}
                ></TextField>
            </Grid>

            <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={product.glutenfree}

                            onChange={e => {
                                const newProduct = {...product, glutenfree: e.target.checked};
                                props.onUpdate(
                                    {
                                        valid: isValid(newProduct),
                                        product: newProduct
                                    }
                                );
                            }}
                        />
                    }
                    label={"Gluten-free"}
                />
            </Grid>

            <Grid item xs={1} display="flex" justifyContent="center" alignItems="center">
                <Tooltip title="If this is checked, the item is hidden from the menu.">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={product.hidden}

                                onChange={e => {
                                    const newProduct = {...product, hidden: e.target.checked};
                                    props.onUpdate(
                                        {
                                            valid: isValid(newProduct),
                                            product: newProduct
                                        }
                                    );
                                }}
                            />
                        }
                        label="Hidden"
                    />
                </Tooltip>
            </Grid>

        </>
    )
}

export function NewProduct(props: { onUpdate: () => void, categoryId: number | null }) {
    const initialState: ProductInputsState = {
        product: {
            name: "",
            price: 0,
            volume: 0,
            glutenfree: false,
            hidden: false,
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

    let [isCreating, setIsCreating] = useState<boolean>(false);


    useEffect(() => {
        if (isFirst) {
            setIsFirst(false);
            return;
        }

        setHasBeenUpdated(true);
    }, [newProduct]);


    return (
        <>
            <ProductInputs validateInputs={hasBeenUpdated} state={newProduct} onUpdate={(value) => {
                setNewProduct(value);

            }}/>

            <Grid item xs={1}>
                <Button disabled={!newProduct.valid.allValid || isCreating}
                        onClick={() => {
                            setIsCreating(true);
                            createProduct({
                                ...newProduct.product,
                                priceVolunteer: newProduct.product.price, // default to price because there is no input for volunteer price yet
                                category_id: props.categoryId
                            }).then(() => {
                                setNewProduct(initialState);
                                setIsCreating(false);

                                setHasBeenUpdated(false);
                                setIsFirst(true);
                                props.onUpdate();
                            });

                        }}

                >{isCreating ? <CircularProgress/> : <>Create</>}</Button>

            </Grid>
        </>
    );
}