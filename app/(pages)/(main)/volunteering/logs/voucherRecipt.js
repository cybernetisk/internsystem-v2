import { Modal, Box, Typography, Button, SvgIcon } from "@mui/material";
import { borderRadius, display, height } from "@mui/system";

export default function voucherRecipt(showRecipt, setShowRecipt, vouchersUsed, description) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vh',
        bgcolor: 'text.primary',
        color: 'black',
        border: '5px solid #d2a30e',
        borderRadius: '10px',
        boxShadow: 24,
        display: "grid",
        gridTemplateRows: '1fr .5fr 1rem 1fr 1fr',
        alignItems: 'center',
        justifyItems: 'center'
    };

    const closeModal = () => {
        setShowRecipt(false);
    }

    return (
        <Modal 
          open={showRecipt}
          >
            <Box sx={style}>
                <Typography sx={{fontSize:"2rem", fontWeight:"bold", margin: "0 10%"}} variant="body1" component="h1" align="center">Vouchers used!</Typography>
                <Typography id="modal-modal-title" variant="h2" component="h2" sx={{alignSelf:"end", textAlign: "center"}}>
                    {vouchersUsed}
                </Typography>
                <Typography>
                    {description}
                </Typography>
                <SvgIcon sx={{width: "100%", height: "100%", paddingTop: "10%"}}>
                    <svg enable-background="new 0 0 24 24" viewBox="0 0 24 24" fill="#000">
                        <g>
                            <path d="M0,0h24v24H0V0z" fill="none"/>
                        </g>
                        <g>
                            <g>
                                <path d="M11,13V9c0-0.55-0.45-1-1-1H6V6h5V4H8.5V3h-2v1H5C4.45,4,4,4.45,4,5v4c0,0.55,0.45,1,1,1h4v2H4v2h2.5v1h2v-1H10 C10.55,14,11,13.55,11,13z"/>
                                <polygon fill="#090" points="19.59,12.52 13.93,18.17 11.1,15.34 9.69,16.76 13.93,21 21,13.93"/>
                            </g>
                        </g>
                    </svg>
                </SvgIcon>
                <Button variant="text" sx={{width: "70%", height: 50, bgcolor: "#333"}} onClick={closeModal}>
                    Confim
                </Button>
            </Box>

        </Modal>
    )

}   