


import { Component } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  // makeStyles,
} from "@mui/material";

import { styled } from "@mui/system";
import { cybTheme } from "./themeCYB";
import Link from "next/link";
// import { headers } from "next/headers";

const ROW_HEIGHT = 44;
const HEAD_ROW_HEIGHT = 37;
const MAX_ROWS = 8;

const TableContainerStyle = styled(TableContainer)(({ theme }) => ({
  overflowY: "auto",
  maxHeight: MAX_ROWS * ROW_HEIGHT + HEAD_ROW_HEIGHT,
}));
const TableStyle = styled(Table)(({ theme }) => ({
  overflowY: "scroll",
  height: "100%",
}));


export default class CustomTable extends Component {
  constructor(props) {
    super();
    
    this.state = {
      sortBy: props.headers[0].id
    }
  }

  updateSortBy = (e) => {
    this.setState({
      sortBy: e
    });
  };

  render() {
    const { headers, data, path } = this.props;
    const { sortBy } = this.state;
    
    let tableHeaderData = headers ? headers : [];
    // let sortBy = headers ? headers[0].id : "";
    let rawTableData = data;

    const tableRowData = rawTableData
      ? rawTableData
          .sort((a, b) => {
            let elemA = a[sortBy];
            let elemB = b[sortBy];

            switch (typeof elemA) {
              case "string":
                return elemA.toLowerCase().localeCompare(elemB.toLowerCase());
              default:
                return elemB - elemA;
            }
          })
          .map((node) => tableBodyRow(node, tableHeaderData, path))
      : [];

    return (
      <TableContainerStyle component={Paper}>
        <TableStyle stickyHeader size="small">
          <TableHead>
            <TableRow>
              {tableHeaderData.map((h) => (
                <TableCell
                  key={h.id}
                  variant="head"
                  sx={{
                    backgroundColor: cybTheme.palette.background.paper,
                    border: `1px solid ${cybTheme.palette.primary.main}`,
                    borderRadius: "5px",
                    // color: cybTheme.palette.primary.contrastText,
                    textDecoration: h.id == sortBy ? "underline" : "none",
                    ":hover": {
                      cursor: "pointer",
                      opacity: 0.9,
                    },
                  }}
                  onClick={() => this.updateSortBy(h.id)}
                >
                  {h.onClick ? "" : h.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>{tableRowData}</TableBody>
        </TableStyle>
      </TableContainerStyle>
    );
  }
}

function tableBodyRow(rowData, tableHeaders, path) {
  
  if (!rowData || !tableHeaders) return <></>;
  

  const rows = tableHeaders.map((h) => {
    
    let data = rowData[h.id];
    let props = {}
    
    if (typeof rowData[h.id] == "boolean") {
      data = rowData[h.id] ? "yes" : "no";
    }
    
    else if (h.direct) {
      data = <Link href={`${path}/${rowData.id}`}>{rowData[h.id]}</Link>;
      props = {
        sx: { textDecoration: "underline" },
      }
    }
    
    else if (h.onClick) {
      data = (
        <Button
          variant="text"
          key={`${rowData.id}_${h.id}_button`}
          onClick={() => h.onClick(rowData[h.target])}
        >
          {h.name}
        </Button>
      );
    }
    
    return (
      <TableCell key={`${rowData.id}_${h.id}`} {...props}>
        {data}
      </TableCell>
    );
  });
  
  
  
  return (
    <TableRow key={rowData[tableHeaders[0].id]}>
      {rows}
    </TableRow>
  );
}