"use client"

import { Box, Button, createSvgIcon, Grid2, Input, InputLabel, Modal, Switch, TextField, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { CustomSwitch } from "../input/CustomSwitch";


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
      'OpenIndicator'
    );

    const ISOTimeStringTo24hTime = (str) => new Date(str).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })

    useEffect(() => {
      fetch("/api/v2/cafe/status").then(async (res) => {
        if (res.status == 200) {
          const data = await res.json()
          setCafeOpen(data.isOpen);

          setOpenText(
            `open (${ISOTimeStringTo24hTime(data.opens)} - ${ISOTimeStringTo24hTime(data.closes)}) ${data.emoji}`
          )
        }
      })
    }, [])

    const openEditModal = () => setModalOpen(true);

    return (
        <>
        <OpenIndicator/>
        <Typography pl={1}>Café {cafeOpen ? openText : "closed"}</Typography>

        {!session?.data?.user?.roles.includes("cafe-master") ? "" : 
        <>
          <Button onClick={openEditModal}>edit</Button>
          <CafeEditModal cafeOpen={cafeOpen} isModalOpen={modalOpen} setIsModalOpen={setModalOpen}/>
        </>
        }
        </>
    )
  }
  
  function CafeEditModal({isModalOpen, setIsModalOpen, cafeOpen}) {
    
    const [checked, setChecked] = useState(cafeOpen);
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '60vw',
        height: '60vh',
        bgcolor: 'background.main',
        color: 'text.primary',
        border: '5px solid #d2a30e',
        borderRadius: '10px',
        boxShadow: 24,
        display: "grid",
        gridTemplateRows: '1fr .5fr auto auto auto 1fr',
        alignItems: 'center',
        justifyItems: 'center'
    };


  const closeModal = (e) => {
    e.preventDefault(true)

    const formdata = new FormData(e.target);

    formdata.set("isOpen", checked);

    let opens = new Date();
    opens.setHours(formdata.get("opens").split(":")[0], formdata.get("opens").split(":")[1], 0, 0)
    
    let closes = new Date();
    closes.setHours(formdata.get("closes").split(":")[0], formdata.get("closes").split(":")[1], 0, 0)

    formdata.set("opens", opens.toISOString())
    formdata.set("closes", closes.toISOString())
  
    fetch(e.target.action, {
      method: "POST",
      body: formdata
    });

    setIsModalOpen(false);
  };

  const updateModal = (event) => {
    setChecked(event.target.checked)
  }


  return (
    <Modal 
      open={isModalOpen}
      >
      <form onSubmit={closeModal} action="/api/v2/cafe/status" method="POST">
        <Grid2 sx={style}>

          <Typography sx={{fontSize:"2rem", fontWeight:"bold", margin: "0 10%"}} variant="body1" component="h1" align="center">
            Open or Close the Cafè
          </Typography>

          <Grid2 container alignItems="center" justifyContent="center">
            <Typography>Closed</Typography>
            <CustomSwitch name="isOpen" checked={checked} onChange={updateModal}></CustomSwitch>
            <Typography>Open</Typography>
          </Grid2>

          <Grid2 container>
            <Typography sx={{marginRight: "10px"}} color="textSecondary">Opens: </Typography>
            <Input name="opens" type="time" disabled={!checked}/>
          </Grid2>

          <Grid2 container>
            <Typography sx={{marginRight: "10px"}} color="textSecondary">Opens: </Typography>
            <Input name="closes" type="time" disabled={!checked}/>
          </Grid2>

          <Grid2 container justifyContent="center" alignItems="center">
            <Typography sx={{marginRight: "10px"}} color="textSecondary">Emoji: </Typography>
            <TextField name="emoji" variant="filled" disabled={!checked} placeholder="☕"/>
          </Grid2>
          
          <Button type="submit" variant="text" sx={{width: "70%", height: 50, bgcolor: "#333", marginBottom: "10px"}}>
              Confim
          </Button>

        </Grid2>

      </form>
    </Modal>
  )

}