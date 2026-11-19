"use client";

import CustomMultiAutoComplete from "@/app/components/input/CustomMultiAutocomplete";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import SnackbarAlert from "@/app/components/feedback/snackbarAlert";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import { Box, Link, Stack, Button, Card, CardContent, useMediaQuery, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Forcegraph from "@/app/components/RecruitmentGraph"
import { cybTheme } from "@/app/components/themeCYB";

export default function BoardPage() {

    const [data, setData] = useState({ nodes: [], edges: [] });
    const [users, setUsers] = useState([]);
    const [registeredFor, setRegisteredFor] = useState([]);
    const [amount, setAmount] = useState(0);

    const [response, setResponse] = useState("")
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [severity, setSeverity] = useState("")

    const [registeredForError, setRegisteredForError] = useState(false);
    const [amountError, setAmountError] = useState(false);

    useEffect(() => {
        fetch(`/api/v2/recruitGraph`)
            .then(res => res.json())
            .then(data => {
                setData({ nodes: data.nodes, edges: data.edges })
            })

        fetch("/api/v2/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data.users);
            })
    }, []);

    const handleClick = async () => {
        let responses = []
        for (let user of registeredFor) {
            let res = await fetch(`/api/v2/users/${user.id}/vouchers`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    amount: amount
                }),
            });
            responses.push(res)
        }

        let failedUsers = []

        for (let res of responses) {
            if (res.ok) continue
            const data = await res.json()
            if (res.status == 403) {
                setResponse(data.error)
                setSnackbarOpen(true)
                setSeverity("error")
                return
            }
            failedUsers.push(data)
        }

        if (failedUsers.length != 0) {
            let names = failedUsers.map((id) => users.find(u => u.id = id).name)
            setResponse("Registering failed for " + names.toString() + " user(s)")
            setSnackbarOpen(true)
            setSeverity("error")
            setTimeout(() => {
                setRefresh("");
            }, 3000);
            return
        }

        setRegisteredFor([]);
        setAmount(0);

        let names = registeredFor.map((id) => users.find(u => u.id = id).name)
        setResponse("Vouchers registered for " + names.toString())
        setSeverity("success")
        setSnackbarOpen(true)
    }

    const width = useMediaQuery(cybTheme.breakpoints.down("md")) ? "100%" : "30%"

    const style = {
        width: width,
        "minWidth": "300px",
        "maxWidth": "500px"
    }

    return (
        <Box>
            <PageHeader text="Board tools" />

            <Stack spacing={2}>
                <Link href="/board/menu">
                    Menu editor
                </Link>

                <Forcegraph data={data} />

                <Card elevation={3} sx={style}>
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="h5">
                                Voucher Registration
                            </Typography>

                            <Typography variant="body1">
                                Give vouchers without registering worked hours.
                            </Typography>


                            <CustomMultiAutoComplete
                                label="Registered for"
                                dataLabel="name"
                                subDataLabel="email"
                                data={users}
                                value={registeredFor}
                                callback={setRegisteredFor}
                                error={registeredForError}
                            />

                            <CustomNumberInput
                                className="amount"
                                label="Amount of vouchers"
                                value={amount}
                                setValue={(value) => {
                                    setAmount(value);
                                }}
                                check={(data) => data.match(/[^0-9.]/) || data.match(/[.]{2,}/g)}
                                error={amountError}
                            />

                            <Button variant="outlined" onClick={handleClick}>
                                Register vouchers
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>
                <SnackbarAlert
                    open={snackbarOpen}
                    setOpen={setSnackbarOpen}
                    response={response}
                    severity={severity}
                />
            </Stack>
        </Box>
    );
}
