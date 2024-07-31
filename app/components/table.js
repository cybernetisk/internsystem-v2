


import { Component } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  // makeStyles,
} from "@mui/material";

import { styled } from "@mui/system";
import { cybTheme } from "./themeCYB";
import Link from "next/link";
// import { headers } from "next/headers";

const ROW_HEIGHT = 32.39;
const HEAD_ROW_HEIGHT = 37.78;
const FOOTER_ROW_HEIGHT = 52;
const MAX_ROWS = 11;

const TableContainerStyle = styled(TableContainer)(({ theme }) => ({
  overflowY: "auto",
  // minHeight: MAX_ROWS * ROW_HEIGHT + HEAD_ROW_HEIGHT + FOOTER_ROW_HEIGHT,
}));
const TableStyle = styled(Table)(({ theme }) => ({
  overflowY: "scroll",
  height: "100%",
}));


const data_structure = {
  id: "string",
  name: "string",
  target: "string",
  onclick: () => {},
  redirect: "link",
  sortBy: "string",
  
}

export default class CustomTable extends Component {
  constructor(props) {
    super();
    
    console.log(props.headers);
    
    const noHeaders = props.headers == undefined || props.headers.length == 0;
    const noSortBy = props.sortBy == undefined || props.headers.length == 0;
    const sortBy = noHeaders
      ? null
      : noSortBy
      ? props.headers[0].id
      : props.headers[0].sortBy;
      
    this.state = {
      sortBy: sortBy,
      sortDirection: "ASC",
      rowsPerPage: 10,
      page: 0,
    }
  }

  updateSortBy = (sortBy, altSortBy="") => {
    console.log("here: ", this.state.sortBy, sortBy, altSortBy);
    if (this.state.sortBy == sortBy || this.state.sortBy == altSortBy) {
      this.setState({
        sortDirection: this.state.sortDirection == "ASC" ? "DESC" : "ASC"
      })
    }
    else {
      const stuff = altSortBy == "" ? sortBy : altSortBy;
      console.log("here: ", stuff)
      this.setState({
        sortBy: stuff,
        sortDirection: "ASC"
      });
    }
  };

  render() {
    const { sortBy, sortDirection, rowsPerPage, page } = this.state;
    const { headers, data, path } = this.props;

    // if (!headers.length || !headers.length) {
    //   return <></>
    // }
    
    if (data.constructor != Array) {
      console.error("table render error: ", data);
      return <></>;
    }
    
    // console.log(sortBy);
    
    const tableBodyElements = data
      .sort((a, b) => sortTableRows(a, b, sortBy, sortDirection))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((e, i) => createTableRow(e, i, headers, path));

    const HeaderFlexTotal = headers
      ? headers.reduce((total, cur) => (total += cur.flex ? cur.flex : 0), 0)
      : 0;
    
    // console.log("HFT", HeaderFlexTotal)
      
    // if (headers) {
    //   headers.map((e) => {
    //     console.log(HeaderFlexTotal / e.flex, );
    //   })
    // }
      
    const tableHeaderElements = headers
      ? headers.map((h) => (
          <TableCell
            key={h.id}
            variant="head"
            sx={{
              width: `${100 / (HeaderFlexTotal / h.flex)}%`,
              backgroundColor: cybTheme.palette.background.paper,
              border: `1px solid ${cybTheme.palette.primary.main}`,
              borderRadius: "5px",
              textDecoration:
                h.id == sortBy || h.sortBy == sortBy ? "underline" : "none",
              ":hover": {
                cursor: "pointer",
                // opacity: 0.9,
              },
            }}
            onClick={() => this.updateSortBy(h.id, h.sortBy)}
          >
            {h.onClick ? "" : h.name}
          </TableCell>
        ))
      : [];
      
    
    return (
      <TableContainerStyle component={Paper}>
        <TableStyle stickyHeader size="small">
          <TableHead sx={{}}>
            <TableRow>{tableHeaderElements}</TableRow>
          </TableHead>

          <TableBody>{tableBodyElements}</TableBody>
          <TableFooter>
            <TableRow>
              {data.length ? (
                <TablePagination
                  count={data.length ? data.length : -1}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(event, value) => {
                    this.setState({
                      page: value
                    })
                  }}
                  onRowsPerPageChange={(event) => {
                    // console.log(event, event.target.value);
                    this.setState({
                      rowsPerPage: event.target.value,
                    });
                  }}
                  showFirstButton
                  showLastButton
                />
              ) : (
                <></>
              )}
            </TableRow>
          </TableFooter>
        </TableStyle>
      </TableContainerStyle>
    );
  }
}

function sortTableRows(a, b, sortBy, sortDirection) {
  
  let elemA;
  let elemB;
  
  if (sortDirection == "ASC") {
    elemA = a[sortBy];
    elemB = b[sortBy];
  }
  else  {
    elemA = b[sortBy];
    elemB = a[sortBy];
  }

  // console.log(typeof elemA, sortBy)
  
  switch (typeof elemA) {
    case "number":
      return elemA - elemB;
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
    
    else if (h.redirect) {
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