
"use client"

import CustomAutoComplete from "@/app/components/input/CustomAutocomplete";
import CustomTable from "@/app/components/table";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { Box, Button, Card, CardContent, Divider, Grid, Stack, Table, TextField, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "react";

const MEMBERSHIP_TABLE_HEADERS = [
  { id: "date_joined", name: "Member since", sortBy: "date_joined_num", flex: 2 },
  { id: "honorary", name: "Honorary", flex: 1 },
  { id: "lifetime", name: "Lifetime", flex: 1 },
  { id: "name", name: "Name", flex: 3 },
  { id: "comment", name: "Comment", flex: 2 },
];

export default function MembershipPage() {
  
  const [semester, setSemester] = useState(null);
  const [membershipData, setMembershipData] = useState([]);
  const [tableData, setTableData] = useState([]);
  
  const [search, setSearch] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  
  useEffect(() => {
    prismaRequest({
      model: "semester",
      method: "find",
      request: {
        orderBy: {
          id: "desc",
        },
      },
      callback: (data) => {
        if (data.length == 0) return;
        setSemester(data.data[1]);
      },
    });
    
  }, [])
  
  useEffect(() => {
    if (semester != null) {
      prismaRequest({
        model: "userMembership",
        method: "find",
        request: {
          where: {
            semester_id: semester.id,
          },
        },
        callback: (data) => {
          if (data.length == 0) return;
          console.log(data, semester.id);
          
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
    }
  }, [semester])
  
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
  
  // console.log(newMemberName)
   
  return (
    <Box>
      {/* {page != null ? page.header : <Skeleton variant="text" />} */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
        Membership overview
      </Typography>
      <Divider sx={{ mb: 4 }}></Divider>

      <Typography variant="h6" gutterBottom pb={2}>
        Semester {semester ? `${semester.semester} ${semester.year}` : ""}
        {membershipData.length != 0 ? ` - (${membershipData.length})` : ""}
      </Typography>

      <Grid container direction="row" spacing={2} rowGap={2} rowSpacing={2}>
        <Grid item container direction="column" md={3} spacing={2}>
          <Grid item>
            <Card>
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

          {/* <Grid item>
            <Card>
              <CardContent>
                <Stack direction="column" spacing={2}>
                  <CustomAutoComplete
                    label="new members name"
                    dataLabel="name"
                    data={membershipData}
                    value={newMemberName}
                    callback={setNewMemberName}
                    allowAdding={true}
                  />
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleFilterTable(search)}
                  >
                    Add New Member
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>

        <Grid item md={9}>
          <CustomTable headers={MEMBERSHIP_TABLE_HEADERS} data={tableData} />
        </Grid>
      </Grid>
    </Box>
  );
}

