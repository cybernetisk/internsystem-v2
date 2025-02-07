
import { Box, Button, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";

export default function voucherLogInput(
  session,
  vouchersEarned,
  vouchersUsed,
  setRefresh,
  vouchersEarnedLastSemester,
  vouchersUsedLastSemester,
  startOfSemester
) {
  const [numVouchers, setNumVouchers] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("");

  const [numVouchersError, setNumVouchersError] = useState(false);
  const [descriptionVoucherError, setDescriptionVoucherError] = useState(false);

  const [requestResponse, setRequestResponse] = useState("");
  
  const diff = vouchersEarned - vouchersUsed;
  const diffLastSemester = vouchersEarnedLastSemester - vouchersUsedLastSemester;
  
  const handleClick = async () => {

    let vouchersLeft = numVouchers;
    if (startOfSemester && diffLastSemester >= 1) {
      vouchersLeft = await handleUseLastSemVouchers();
    }

    if (vouchersLeft <= 0) return;

    const isInvalid = validateVoucherLogRequest(
      vouchersLeft,
      descriptionVoucher,
      diff,
      setNumVouchersError,
      setDescriptionVoucherError
    );

    if (isInvalid) return;

    fetch("/api/v2/voucherLogs", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        loggedFor: session.data.user.id,
        amount: vouchersLeft,
        description: descriptionVoucher,
        semesterId: session.data.semester.id,
      })
    }).then(res => {
      setDescriptionVoucher("");
      if (!res.ok) {
        setRequestResponse("Failed to use voucher. Please try again.");
        return
      }
      setRequestResponse(numVouchers.toString() + " vouchers used.");
      setNumVouchers(0);
      setRefresh();
      setTimeout(() => {
        setRequestResponse("");
      }, 7000);
      })
  };

  async function handleUseLastSemVouchers() {
    const isInvalid = validateVoucherLogRequest(
      numVouchers,
      descriptionVoucher,
      diff + diffLastSemester,
      setNumVouchersError,
      setDescriptionVoucherError
    );
    if (isInvalid) return numVouchers;

    const vouchersToUse = Math.min(numVouchers, Math.floor(diffLastSemester));

    const res = await fetch("/api/v2/voucherLogs", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        loggedFor: session.data.user.id,
        amount: vouchersToUse,
        description: descriptionVoucher,
        semesterId: session.data.semester.id - 1,
      })
    });

    if (!res.ok) {
      setRequestResponse("Failed to use last semester vouchers. Please try again.");
      return numVouchers;
    }
    
    if (vouchersToUse === numVouchers) {
      setDescriptionVoucher("");
      setRequestResponse(numVouchers.toString() + " vouchers used.");
      setNumVouchers(0);
      setRefresh()
      setTimeout(() => {
        setRequestResponse("");
      }, 7000);
      return 0;
    }
    return numVouchers - vouchersToUse;
  }
    

  return (
    <Stack direction="column" spacing={1}>
      <Stack direction="column" spacing={2}>
        <Stack direction="column">
          <Typography variant="body2">Vouchers remaining: </Typography>
          <Typography variant="body2">{diff.toFixed(1)}</Typography>
          {lastSemesterVoucherCount(diffLastSemester, startOfSemester)}

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

function lastSemesterVoucherCount(vouchersEarned, startOfSemester) {
  if (!startOfSemester) return null;
  return (
    <div>
      <Typography variant="body2">Vouchers remaining from last semester: </Typography>
      <Typography variant="body2">{vouchersEarned.toFixed(1)}</Typography>
    </div>
  )
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
