
import { Box, Button, Grid, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomNumberInput from "@/app/components/input/CustomNumberInput";
import TextFieldWithX from "@/app/components/input/TextFieldWithX";
import voucherRecipt from "./voucherRecipt";

export default function voucherLogInput(
  session,
  voucherAmount,
  setRefresh
) {
  const [numVouchersToUse, setNumVouchersToUse] = useState(0);
  const [descriptionVoucher, setDescriptionVoucher] = useState("");

  const [numVouchersError, setNumVouchersError] = useState(false);
  const [voucherErrorMessage, setVoucherErrorMessage] = useState("")
  const [descErrorMessage, setDescErrorMessage] = useState("")
  const [descriptionVoucherError, setDescriptionVoucherError] = useState(false);

  const [showRecipt, setShowRecipt] = useState(false);  
  const [lastNumberOfVouchersUsed, setlastNumberOfVouchersUsed] = useState();
  

  const handleClick = async () => {
    const isInvalid = validateVoucherLogRequest(
      numVouchersToUse,
      descriptionVoucher,
      voucherAmount,
      setNumVouchersError,
      setDescriptionVoucherError,
      setVoucherErrorMessage,
      setDescErrorMessage
    );

    if (isInvalid) return;

    fetch("/api/v2/vouchers", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        action: "use",
        amount: numVouchersToUse,
        description: descriptionVoucher,
        userId: session.data.user.id
      })
    }).then(async res => {
        setNumVouchersToUse(0);
        setDescriptionVoucher("");
        
        if (!res.ok) {
          const data = await res.json()
          if ("error" in data)
            setVoucherErrorMessage(data.error)
          else
            setVoucherErrorMessage("Error while trying to use vouchers")
          return
        }
        setRefresh();
        const data = await res.json()
        setlastNumberOfVouchersUsed(data.amount);
        setDescriptionVoucher(data.description);
        setShowRecipt(true);
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
          errorMessage={voucherErrorMessage}
          onChange={() => {
            setVoucherErrorMessage("");
            setNumVouchersError(false)
          }}
        />
        <TextFieldWithX
          label="Description"
          name="voucherdescription"
          value={descriptionVoucher}
          setValue={setDescriptionVoucher}
          size="small"
          multiline
          InputLabelProps={{ shrink: true }}
          error={descriptionVoucherError}
          helperText={descErrorMessage}
          onChange={(e) => {
            setDescriptionVoucher(e.target.value); 
            setVoucherErrorMessage("")
            setDescErrorMessage("")
            setDescriptionVoucherError(false)
          }
          }
        />
        <Button variant="outlined" onClick={handleClick}>
          Use voucher
        </Button>
      </Stack>

      <Typography variant="subtitle1">
        {showRecipt ? (
          voucherRecipt(showRecipt, setShowRecipt, lastNumberOfVouchersUsed, descriptionVoucher)
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
  numVouchersToUse,
  descriptionVoucher,
  voucherAmount,
  setNumVouchersError,
  setDescriptionVoucherError,
  setErrorMessage,
  setDescErrorMessage
) {
  
  // Define an object to store the errors
  const errors = {
    numVouchersError: voucherAmount-numVouchersToUse < 0 || numVouchersToUse <= 0,
    descriptionVoucherError: descriptionVoucher.length === 0,
  };

  // Update the error states using the setters
  if (errors.numVouchersError)
    setErrorMessage(numVouchersToUse <= 0 ? "You must have more than one voucher" : "Not enough vouchers")
  if (errors.descriptionVoucherError)
    setDescErrorMessage("Please describe the purchase")
  setNumVouchersError(errors.numVouchersError);
  setDescriptionVoucherError(errors.descriptionVoucherError);

  // Return true if any error exists
  return Object.values(errors).some((error) => error);
}
