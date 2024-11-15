
import { Box, Button, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import VoucherFeedback from "@/app/components/feedback/voucherFeedback";

export default function voucherLogInput(
  session,
  vouchersEarned,
  vouchersUsed,
  setRefresh
) {
  const [numVouchers, setNumVouchers] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("");

  const [numVouchersError, setNumVouchersError] = useState(false);
  const [descriptionVoucherError, setDescriptionVoucherError] = useState(false);

  const [requestResponse, setRequestResponse] = useState({
    message: "",
    ok: false,
  });
  
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  
  const diff = vouchersEarned - vouchersUsed;
  
  const handleClick = async () => {
    const isInvalid = validateVoucherLogRequest(
      numVouchers,
      descriptionVoucher,
      diff,
      setNumVouchersError,
      setDescriptionVoucherError
    );

    if (isInvalid) return;

    const response = await prismaRequest({
      model: "voucherLog",
      method: "create",
      request: {
        data: {
          loggedFor: session.data.user.id,
          amount: numVouchers,
          description: descriptionVoucher,
          semesterId: session.data.semester.id,
        },
      },
      callback: (data) => {
        setNumVouchers(0);
        setDescriptionVoucher("");
        setRefresh(data);
      },
    });
    
    if (!response.ok) {
      setRequestResponse({
        message: "Failed to use voucher. Please try again.",
        ok: response.ok,
      });
      setFeedbackOpen(true)
      return;
    }
    
    console.log("response.ok", response.ok)
    setRequestResponse({
      message: `Used ${response.data.amount} voucher(s)`,
      ok: response.ok,
    });
    setFeedbackOpen(true)
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="column" spacing={2}>
        <Stack direction="column">
          <Typography variant="body2">Vouchers remaining: </Typography>
          <Typography variant="body2">{diff.toFixed(1)}</Typography>

          <Stack alignItems="end" width="100%">
            <Typography variant="caption">25kr / voucher</Typography>
          </Stack>
        </Stack>

        <CustomNumberInput
          label={"Vouchers to use"}
          value={numVouchers}
          setValue={setNumVouchers}
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
          <VoucherFeedback open={feedbackOpen} setOpen={setFeedbackOpen} response={requestResponse}/>
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
  numVouchers,
  descriptionVoucher,
  vouchersEarned,
  setNumVouchersError,
  setDescriptionVoucherError
) {
  
  // Define an object to store the errors
  const errors = {
    numVouchersError: numVouchers <= 0 || numVouchers > vouchersEarned,
    descriptionVoucherError: descriptionVoucher.length === 0,
  };

  // Update the error states using the setters
  setNumVouchersError(errors.numVouchersError);
  setDescriptionVoucherError(errors.descriptionVoucherError);

  // Return true if any error exists
  return Object.values(errors).some((error) => error);
}
