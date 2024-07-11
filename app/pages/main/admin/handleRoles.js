

import { useState } from "react";
import { Autocomplete, Button, Stack, TextField, Typography } from "@mui/material";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";

export default function handleRoles(users, roles, setRoles) {
  
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRole, setSelectedRole] = useState(null)
  
  // const [name, setName] = useState("")
  // const [description, setDescription] = useState("")
  
  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">Set role</Typography>

      <Autocomplete
        size="small"
        options={users.map((e) => e.firstName)}
        onChange={(e, v) => setSelectedUser(users.filter((e) => e.firstName == v)[0]) }
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{ shrink: true }}
            label="User"
          />
        )}
      />
      <Autocomplete
        size="small"
        options={roles.map((e) => e.name)}
        onChange={(e, v) => setSelectedRole(roles.filter((e) => e.name == v)[0]) }
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{ shrink: true }}
            label="Role"
          />
        )}
      />

      <Button
        variant="outlined"
        onClick={() => {
          console.log(selectedUser, selectedRole)
          prismaRequest({
            model: "userRole",
            method: "create",
            request: {
              data: {
                userId: selectedUser.id,
                roleId: selectedRole.id,
              },
            },
            callback: setRoles,
          });
        }}
      >
        Remove
      </Button>
    </Stack>
  );
  
}

// async function handleAddition(name, description, refresh, setRefresh) {
  
//   const data = await prismaRequest({
//     model: "workGroup",
//     method: "create",
//     request: {
//       data: {
//         name: name,
//         description: description,
//         leaderTitle: "",
//       }
//     },
//   });
  
//   setRefresh(!refresh);
// }

// async function handleDeletion(group, refresh, setRefresh) {
//   console.log(group)
  
//   const data = await prismaRequest({
//     model: "workGroup",
//     method: "delete",
//     request: {
//       where: {
//         id: group.id
//       },
//     },
//   });
  
//   setRefresh(!refresh);
// }