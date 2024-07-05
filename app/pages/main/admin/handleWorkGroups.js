
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { prismaRequest } from "@/app/components/prisma/prismaRequest";

export default function handleWorkGroups(groups, refresh, setRefresh) {
  
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(null)
  
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">Work Groups</Typography>
      <TextField
        size="small"
        label="Group name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        size="small"
        label="Description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        InputLabelProps={{ shrink: true }}
      />
      <Button
        variant="outlined"
        onClick={() => {
          handleAddition(name, description, refresh, setRefresh);
          
        }}
      >
      Add
      </Button>

      <Autocomplete
        size="small"
        options={groups.map((e) => e.name)}
        onChange={(e, v) => {
          setSelectedGroup(groups.filter((e) => e.name == v)[0]);
          // console.log(v, selectedGroup)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{ shrink: true }}
            label="Work Group"
          />
        )}
      />
      <Button
        variant="outlined"
        onClick={() => {
          handleDeletion(selectedGroup, refresh, setRefresh);
          
        }}
      >
      Remove
      </Button>
    </Stack>
  );
  
}

async function handleAddition(name, description, refresh, setRefresh) {
  
  const data = await prismaRequest({
    model: "workGroup",
    method: "create",
    request: {
      data: {
        name: name,
        description: description,
        leaderTitle: "",
      }
    },
  });
  
  setRefresh(!refresh);
}

async function handleDeletion(group, refresh, setRefresh) {
  console.log(group)
  
  const data = await prismaRequest({
    model: "workGroup",
    method: "delete",
    request: {
      where: {
        id: group.id
      },
    },
  });
  
  setRefresh(!refresh);
}