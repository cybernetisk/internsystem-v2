"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PageHeader } from "@/app/components/sanity/PageBuilder";
import CustomTable from "@/app/components/CustomTable";
import authWrapper from "@/app/middleware/authWrapper";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const MEMBERSHIP_TABLE_HEADERS = [
  {
    id: "date_joined",
    type: "date",
    name: "Member since",
    sortBy: "date_joined_num",
    flex: 2,
  },
  {
    id: "honorary",
    type: "boolean",
    name: "Honorary",
    flex: 1,
  },
  {
    id: "lifetime",
    type: "boolean",
    name: "Lifetime",
    flex: 1,
  },
  {
    id: "name",
    type: "string",
    name: "Name",
    flex: 3,
  },
  {
    id: "comments",
    type: "string",
    name: "Comment",
    flex: 2,
  },
];

function MembershipPage() {
  const session = useSession();

  const [membershipData, setMembershipData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [numSpecialMembers, setNumSpecialMembers] = useState(0);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberComment, setNewMemberComment] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetch("/api/v2/memberships").then(res => {
      res.json().then((data) => {
        console.log(data)
        if (data.length == 0) return;

        const newMembershipData = data.memberships.map((e) => {
          return {
            ...e,
            date_joined_num: parseISO(e.date_joined).getTime(),
            date_joined: format(
              parseISO(e.date_joined),
              "dd.MM.yyyy"
            ).toLowerCase(),
          };
        });

        const newNumSpecialMembers = data.memberships.filter((e) => {
          return e.honorary || e.lifetime;
        }).length;

        setMembershipData(newMembershipData);
        setTableData(newMembershipData);

        setNumSpecialMembers(newNumSpecialMembers);
      })
    })
  }, [refresh]);

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
          semester_id: session.data.semester.id,
        },
      },
      callback: (data) => {
        setRefresh(!refresh);
      },
    });
  };

  return (
    <Box>
      <PageHeader
        text={`Membership ${session.data.semester.semester} ${session.data.semester.year}`}
        variant="h4"
      />

      <Grid container direction="row" spacing={2} rowGap={2} rowSpacing={2}>
        <Grid item container direction="column" md={3} spacing={2}>
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

          <Grid item>
            <Typography variant="body1">
              lifetime: {numSpecialMembers}
            </Typography>
            <Typography variant="body1">
              new: {membershipData.length - numSpecialMembers}
            </Typography>
          </Grid>
        </Grid>

        <Grid item md={9}>
          <CustomTable
            headers={MEMBERSHIP_TABLE_HEADERS}
            data={tableData}
            defaultFilterBy="name"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default authWrapper(MembershipPage);
