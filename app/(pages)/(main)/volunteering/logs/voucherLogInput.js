
import { Box, Button, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";

export default function voucherLogInput(
  session,
  voucherAmount,
  setRefresh
) {
  const [numVouchersToUse, setNumVouchersToUse] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("");

  const [numVouchersError, setNumVouchersError] = useState(false);
  const [descriptionVoucherError, setDescriptionVoucherError] = useState(false);

  const [requestResponse, setRequestResponse] = useState("");
    
  const handleClick = async () => {
    const isInvalid = validateVoucherLogRequest(
      numVouchersToUse,
      descriptionVoucher,
      voucherAmount,
      setNumVouchersError,
      setDescriptionVoucherError
    );

    if (isInvalid) return;

    fetch("/api/v2/voucher", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        action: "use",
        amount: numVouchersToUse,
        description: descriptionVoucher,
      })
    }).then(res => {
        setNumVouchersToUse(0);
        setDescriptionVoucher("");
        
        if (!res.ok) {
          setRequestResponse("Failed to use voucher. Please try again.");
          return
        }
        setRefresh();
        setRequestResponse("Voucher used.");
        setTimeout(() => {
          setRequestResponse("");
        }, 5000);
      })
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="column" spacing={2}>
        <Stack direction="column">
          <Typography variant="body2">Vouchers remaining: </Typography>
          <Typography variant="body2">{voucherAmount.toFixed(1)}</Typography>

          <Stack alignItems="end" width="100%">
            <Typography variant="caption">25kr / voucher</Typography>
          </Stack>
        </Stack>

        <CustomNumberInput
          label={"Vouchers to use"}
          value={numVouchersToUse}
          setValue={setNumVouchersToUse}
          check={(data) => data.match(/[^0-9]/)}
          error={numVouchersError}
        />
        <TextField
          label="Description"
          size="small"
          multiline
          InputLabelProps={{ shrink: true }}
          value={descriptionVoucher}
          error={descriptionVoucherError}
          onChange={(e) => setDescriptionVoucher(e.target.value)}
        />
        <Button variant="outlined" onClick={handleClick}>
          Use voucher
        </Button>
      </Stack>

      <Typography variant="subtitle1">
        {requestResponse != "" ? (
          requestResponse
        ) : (
          <Skeleton
            animation={false}
            variant="text"
            sx={{ bgcolor: "inherit" }}
          />
        )}
      </Typography>
    </Stack>
  );
}

function validateVoucherLogRequest(
  numVouchersToUse,
  descriptionVoucher,
  voucherAmount,
  setNumVouchersError,
  setDescriptionVoucherError
) {
  
  // Define an object to store the errors
  const errors = {
    numVouchersError: voucherAmount-numVouchersToUse < 0,
    descriptionVoucherError: descriptionVoucher.length === 0,
  };

  // Update the error states using the setters
  setNumVouchersError(errors.numVouchersError);
  setDescriptionVoucherError(errors.descriptionVoucherError);

  // Return true if any error exists
  return Object.values(errors).some((error) => error);
}
