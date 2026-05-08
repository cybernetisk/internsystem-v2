"use client"

import { Box, Button, createSvgIcon, Grid2, Input, Modal, Switch, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
const CustomSwitch = styled(Switch)(() => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      // '& .MuiSwitch-thumb:before': { // TODO: Add custom images
      // backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
      //   '#fff',
      // )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      // },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#001e3c',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      // TODO: Add custom images
      // backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
      //   '#fff',
      // )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: '#aab4be',
    borderRadius: 20 / 2,
  },
}));


export function CafeOpen() {
    const [cafeOpen, setCafeOpen] = useState(false);
    const [openText, setOpenText] = useState("open");
    const [modalOpen, setModalOpen] = useState(false);

    const session = useSession();

    const OpenIndicator = createSvgIcon(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={cafeOpen ? "lime" : "red"}
        viewBox="0 0 46 46"
        className="h-6 w-6"
      >
        <circle cx="21" cy="21" r="20"/>
      </svg>,
      'Plus',
    );

    useEffect(() => {
      fetch("/api/v2/cafe/status").then(async (res) => {
        if (res.status == 200) {
          const data = await res.json()
          setCafeOpen(data.isOpen);

          
          setOpenText(
            `open (${data.opens} - ${data.closes}) ${data.emoji}`
          )
        }
      })
    }, [])

    const openEditModal = () => setModalOpen(true);

    return (
        <>
        <OpenIndicator/>
        <Typography pl={1}>Cafè {cafeOpen ? openText : "closed"}</Typography>
        {!session?.data?.user?.roles.includes("cafe-master") ? "" : 
        <>
        <Button onClick={openEditModal}>edit</Button>
        <CafeEditModal cafeOpen={cafeOpen} isOpen={modalOpen} setIsOpen={setModalOpen}/>
        </>
        }
        </>
    )
  }
  
  function CafeEditModal({isOpen, setIsOpen, cafeOpen}) {
    
    const [checked, setChecked] = useState(cafeOpen);
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
        gridTemplateRows: '1fr .5fr auto auto 1fr',
        alignItems: 'center',
        justifyItems: 'center'
    };


  const closeModal = (e) => {
    e.preventDefault(true)

    const formdata = new FormData(e.target);

    formdata.set("isOpen", checked);

    fetch(e.target.action, {
      method: "POST",
      body: formdata
    });

    setIsOpen(false);
  };

  const updateModal = (event) => {
    setChecked(event.target.checked)
  }


  return (
    <Modal 
      open={isOpen}
      >
        <Grid2 sx={style}>
          <Typography sx={{fontSize:"2rem", fontWeight:"bold", margin: "0 10%"}} variant="body1" component="h1" align="center">Open or Close the Cafè</Typography>
          <form onSubmit={closeModal} action="/api/v2/cafe/status" method="POST">
            <Grid2
              container
              size="grow"
              sx= {{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography>Closed</Typography>
              <CustomSwitch name="isOpen" checked={checked} onChange={updateModal}></CustomSwitch>
              <Typography>Open</Typography>
            </Grid2>

            <Grid2
            container
            size="grow"
            direction="column"
            >
                
              <Typography>Opening time: </Typography>
              <Input name="opens" type="time" disabled={!checked} sx={{color:"black"}} color="primary"/>
              <Typography>Closing time: </Typography>
              <Input name="closes" type="time" disabled={!checked}sx={{color:"black"}} color="primary"/>

              <Typography>Emoji: </Typography>
              <Input name="emoji" type="text" disabled={!checked} value={"☕"} sx={{color:"black"}} color="primary"/>
            </Grid2>

            <Button type="submit" variant="text" sx={{width: "70%", height: 50, bgcolor: "#333", marginBottom: "10px"}}>
                Confim
            </Button>
          </form>
        </Grid2>

    </Modal>
  )

}