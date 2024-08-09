
"use client"

import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import CustomTable from "@/app/components/table";
import authWrapper from "@/app/middleware/authWrapper";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Card, CardContent, Divider, Grid, Stack, Table, TextField, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const MEMBERSHIP_TABLE_HEADERS = [
  { id: "date_joined", name: "Member since", sortBy: "date_joined_num", flex: 2 },
  { id: "honorary", name: "Honorary", flex: 1 },
  { id: "lifetime", name: "Lifetime", flex: 1 },
  { id: "name", name: "Name", flex: 3 },
  { id: "comment", name: "Comment", flex: 2 },
];

function MembershipPage() {
  
  const session = useSession();

  const [membershipData, setMembershipData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  const [search, setSearch] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberComment, setNewMemberComment] = useState("");
  const [refresh, setRefresh] = useState(false);
  
  
  useEffect(() => {
    prismaRequest({
      model: "userMembership",
      method: "find",
      request: {
        where: {
          semester_id: session.data.semester.id,
        },
      },
      callback: (data) => {
        if (data.length == 0) return;
        
        const NewData = data.data.map((e) => {
          return {
            ...e,
            date_joined_num: parseISO(e.date_joined).getTime(),
            date_joined: format(
              parseISO(e.date_joined),
              "dd MMM yyyy 'kl.'HH:mm"
            ).toLowerCase(),
          };
        });
        
        setMembershipData(NewData);
        setTableData(NewData);
      }
    });
  }, [refresh])
  
  const handleFilterTable = (text) => {
    setSearch(text);
    
    if (text != "") {
      setTableData(
        membershipData.filter((e) =>
          e.name.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setTableData(membershipData);
    }
  }
  
  const addNewMember = async () => {
    
    const response = await prismaRequest({
      model: "userMembership",
      method: "create",
      request: {
        data: {
          name: newMemberName,
          email: "",
          comments: newMemberComment,
          seller_id: session.data.user.id,
          semester_id: session.data.semester.id
        }
      },
      callback: (data) => {
        setRefresh(!refresh);
      }
    })
    
  }
   
  return (
    <Box>
      <PageHeader text="Membership overview" variant="h4" />

      <Typography variant="h6" gutterBottom pb={2}>
        Semester {session.data.semester.semester} {session.data.semester.year}{" "}
        {membershipData.length != 0 ? ` - (${membershipData.length})` : ""}
      </Typography>

      <Grid container direction="row" spacing={2} rowGap={2} rowSpacing={2}>
        <Grid item container direction="column" md={3} spacing={2}>
          <Grid item>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="search member"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key == "Enter") {
                        handleFilterTable(search);
                      }
                    }}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleFilterTable(search)}
                  >
                    Search
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <TextField
                    variant="outlined"
                    size="small"
                    label="new member"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                  />
                  <TextField
                    variant="outlined"
                    size="small"
                    label="comment"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={newMemberComment}
                    onChange={(e) => setNewMemberComment(e.target.value)}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => addNewMember()}
                  >
                    Add New Member
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid item md={9}>
          <CustomTable
            headers={MEMBERSHIP_TABLE_HEADERS}
            data={tableData}
            sortBy={"date_joined"}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default authWrapper(MembershipPage);