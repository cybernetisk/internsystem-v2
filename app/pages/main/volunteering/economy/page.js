
"use client"

import {
  Box,
  Card,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import authWrapper from "@/app/middleware/authWrapper";
import Link from "next/link";
import { cybTheme } from "@/app/components/themeCYB";
import prismaRequest from "@/app/middleware/prisma/prismaRequest";
import CustomTable from "@/app/components/table";
import { format, parseISO } from "date-fns";

const FINANCE_TABLES = [
  { id: "varer_konto", title: "konto" },
  { id: "varer_salgskalkyle", title: "salgskalkyle" },
  { id: "varer_salgskalkylevare", title: "salgskalkylevare" },
  { id: "varer_salgsvare", title: "salgsvare" },
  { id: "varer_salgsvarepris", title: "salgsvarepris" },
  { id: "varer_varetelling", title: "varetelling" },
  { id: "varer_varetellingvare", title: "varetellingvare" },
  { id: "varer_leverandor", title: "leverandør" },
  { id: "varer_raavare", title: "råvare" },
  { id: "varer_raavarepris", title: "råvarepris" },
  { id: "varer_salgsvareraavare", title: "salgsvareråvare" },
]

function EconomyPage() {
  
  const [selectedTable, setSelectedTable] = useState("")
  const [headerData, setHeaderData] = useState([])
  const [tableData, setTableData] = useState([])
  
  const handleLinkClick = (model) => {
    
    setSelectedTable(model)
    
    prismaRequest({
      model: model,
      method: "find",
      callback: (data) => {
        
        setHeaderData(data.fields.map((e) => {
          return { id: e, name: e }
        }));
        
        let timestampFields = data.fields.filter((e) => data.extra[e].typeName == "DateTime")
        
        setTableData(data.data.map((e) => {
          
          let transformed = {}
          for (const field of timestampFields) {
            if (e[field] != null) {
              transformed[field] = format(
                parseISO(e[field]),
                "dd MMM yyyy, 'kl.'kk:mm"
              )
            }
          }
          
          return {
            ...e,
            ...transformed
          }
          
        }));
      },
      fields: true,
      debug: true
    })
    
  }
  
  const buttons = FINANCE_TABLES.map((e) => {
    return (
      <Link key={"link_" + e.id} href="#" onClick={() => handleLinkClick(e.id)}>
        <Typography
          key={"link_typography" + e.id}
          variant="body1"
          gutterBottom
          sx={{
            color: (e.id == selectedTable) ? cybTheme.palette.primary.main : "",
            "&:hover": { color: cybTheme.palette.primary.main },
          }}
        >
          {e.title}
        </Typography>
      </Link>
    );
  });
  
  return (
    <Box>
      <Container disableGutters sx={{ my: 2 }}>
        <Typography variant="h4">Stock overview</Typography>
      </Container>

      <Grid container>
        <Grid item md={2.5} xs={12} spacing={0} alignContent="start">
          <Card sx={{ padding: 3 }}>
            <Typography variant="body1" gutterBottom>
              Select table
            </Typography>
            <Divider variant="fullWidth" sx={{ marginBottom: 2 }}></Divider>

            {buttons}
          </Card>
        </Grid>

        {/* <Grid item md={2.5} xs={12} width="100%" p={1}>
          <Card>
            <CardContent>
              {headerData.map((e) => {
                return (
                  <TextField
                    key={"textfield_" + e.name}
                    size="small"
                    sx={{ mt: 2 }}
                    label={e.name}
                    InputLabelProps={{ shrink: true }}
                  />
                );
              })}
            </CardContent>
          </Card>
        </Grid> */}

        <Grid item xs={12} p={1}>
          <Typography variant="h4" gutterBottom>
            {selectedTable}
          </Typography>
          <CustomTable headers={headerData} data={tableData} />
        </Grid>
      </Grid>
    </Box>
  );
}

export default authWrapper(EconomyPage, "finance");