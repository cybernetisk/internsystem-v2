


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

    if (data.constructor != Array) {
      console.error("table render error: ", data)
      return <></>
    }
    
    const tableBodyData = data
    ? data
        .sort((a, b) => sortTableRows(a, b, sortBy))
        .map((e, i) => createTableRow(e, i, tableHeaderData, path))
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
                      // opacity: 0.9,
                    },
                  }}
                  onClick={() => this.updateSortBy(h.id)}
                >
                  {h.onClick ? "" : h.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>{tableBodyData}</TableBody>
        </TableStyle>
      </TableContainerStyle>
    );
  }
}

function sortTableRows(a, b, sortBy) {
  
  let elemA = a[sortBy];
  let elemB = b[sortBy];

  switch (typeof elemA) {
    case "number":
      return elemB - elemA;
    case "string":
      if (typeof elemB == "string" && elemB.length != 0) {
        return elemB
          .toLowerCase()
          .localeCompare(elemA.toLowerCase());
      }
      return elemA;
    case "object":
      return elemA;
    default:
      return elemB - elemA;
  }
}

function createTableRow(rowData, rowIndex, tableHeaders, path) {
  
  if (!rowData || !tableHeaders) return <></>;

  const cells = tableHeaders.map((h) => {
    
    let data = rowData[h.id];
    let props = {}
    
    if (typeof rowData[h.id] == "boolean") {
      data = rowData[h.id] ? "yes" : "no";
    }
    
    else if (h.direct) {
      data = (
        <Link
          key={`table_row_link_${h.id}_${rowIndex}`}
          href={`${path}/${rowData.id}`}
        >
          {rowData[h.id]}
        </Link>
      );
      props = {
        sx: { textDecoration: "underline" },
      }
    }
    
    else if (h.onClick) {
      data = (
        <Button
          variant="text"
          key={`table_row_button_${h.id}_${rowIndex}`}
          onClick={() => h.onClick(rowData[h.target])}
        >
          {h.name}
        </Button>
      );
    }
    
    return (
      <TableCell key={`table_row_cell_${h.id}_${rowIndex}`} {...props}>
        {data}
      </TableCell>
    );
  });
  
  return (
    <TableRow key={`table_row_${rowIndex}`}>{cells}</TableRow>
  );
}