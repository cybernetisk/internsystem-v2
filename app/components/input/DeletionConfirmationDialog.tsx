import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactNode } from "react";

export type DeletionConfirmationDialogProps = {
    open: boolean,
    onClose: () => void; // called when "Cancel" is clicked, or the dialog is closed in any other way.
    onDelete: () => void; // called when "Delete" is clicked.
    showSpinner: boolean; // when true, shows a spinner instead of "Delete" in the button.

    title: ReactNode; // Title of the dialog
    children: ReactNode; // content
}

export function DeletionConfirmationDialog(
    props: DeletionConfirmationDialogProps
) {

    return (
        <Dialog
            open={ props.open }
            onClose={ props.onClose }
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                { props.title }
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    { props.children }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={ props.onClose }>Cancel</Button>
                <Button onClick={ props.onDelete } color="error">
                    { props.showSpinner ? <CircularProgress/> : <>Delete</> }
                </Button>
            </DialogActions>
        </Dialog>
    )
}