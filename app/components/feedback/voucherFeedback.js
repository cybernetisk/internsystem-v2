import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { DialogContent, DialogContentText } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { bgcolor, color } from "@mui/system";

export default function VoucherFeedback({ open, setOpen, response }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
        onClick={handleClose}

      >
        <SimpleDialog open={open} onClose={handleClose} response={response} />
      </Backdrop>
    </div>
  );
}

function SimpleDialog(props) {
  const { onClose, selectedValue, open, response } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ backgroundColor:"#181817" }} >
      <DialogTitle>{response.message}</DialogTitle>
      <DialogContent sx={{ alignContent:"center" }}>
        {response.ok 
          ? <CheckCircleIcon sx={{ color: "green", fontSize: 100, alignSelf: "center", margin: "auto" }} />
          : <ErrorIcon sx={{ color: "red", fontSize: 100, alignSelf: "center" }} />
        }
        <DialogContentText></DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
