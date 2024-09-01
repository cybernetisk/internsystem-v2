
import { Component } from "react";
import {
  Button,
  Card,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import Link from "next/link";
import { cybTheme } from "./themeCYB";


const TableStyle = styled(Table)(({ theme }) => ({
  overflowY: "scroll",
  height: "100%",
}));


export default class CustomTable extends Component {
  constructor(props) {
    super(props);

    const sortBy =
      props.sortBy || (props.headers && props.headers[0]?.sortBy) || null;

    this.state = {
      sortBy: sortBy,
      sortDirection: "DESC",
      rowsPerPage: 10,
      page: 0,
    };
  }

  updateSortBy = (sortBy, altSortBy = "") => {
    
    const newSortBy =
      this.state.sortBy === sortBy || this.state.sortBy === altSortBy
        ? this.state.sortBy
        : altSortBy || sortBy;
        
    const newSortDirection =
      this.state.sortBy === newSortBy
        ? this.state.sortDirection === "DESC"
          ? "ASC"
          : "DESC"
        : "DESC";
        
    this.setState({ sortBy: newSortBy, sortDirection: newSortDirection });
  };

  render() {
    const { sortBy, sortDirection, rowsPerPage, page } = this.state;
    const { headers, data, path } = this.props;

    if (!Array.isArray(data)) {
      console.error("table render error: ", data);
      return <div>Error: Data is not an array.</div>;
    }

    const sortElementsBy = headers && sortBy ? sortBy : headers[0]?.sortBy;

    const tableBodyElements = data
      .sort((a, b) => sortTableRows(a, b, sortElementsBy, sortDirection))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((e, i) => createTableRow(e, i, headers, path));

    const HeaderFlexTotal = headers
      ? headers.reduce((total, cur) => (total += cur.flex || 0), 0)
      : 0;

    const tableHeaderElements = headers?.map((h) => (
      <TableCell
        key={h.id}
        sx={{
          width: `${100 / (HeaderFlexTotal / h.flex)}%`,
          border: 1,
          borderColor: cybTheme.palette.primary.main,
          textDecoration:
            h.id === sortBy || h.sortBy === sortBy ? "underline" : "none",
          ":hover": {
            cursor: "pointer",
          },
        }}
        onClick={() => this.updateSortBy(h.id, h.sortBy)}
      >
        {h.onClick ? "" : h.name}
      </TableCell>
    ));

    return (
      <Container
        component={Paper}
        elevation={3}
        disableGutters
        square
        sx={{ overflowX: { xs: "scroll", sm: "hidden" } }}
      >
        <TableStyle stickyHeader size="small">
          <TableHead>
            <TableRow>{tableHeaderElements}</TableRow>
          </TableHead>

          <TableBody>{tableBodyElements}</TableBody>
          <TableFooter>
            <TableRow>
              {data.length > 0 && (
                <TablePagination
                  count={data.length}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onPageChange={(event, value) => {
                    this.setState({ page: value });
                  }}
                  onRowsPerPageChange={(event) => {
                    this.setState({
                      rowsPerPage: parseInt(event.target.value, 10),
                    });
                  }}
                  showFirstButton
                  showLastButton
                />
              )}
            </TableRow>
          </TableFooter>
        </TableStyle>
      </Container>
    );
  }
}

CustomTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sortBy: PropTypes.string,
      flex: PropTypes.number,
      onClick: PropTypes.func,
      redirect: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  sortBy: PropTypes.string,
  path: PropTypes.string,
};

function sortTableRows(a, b, sortBy, sortDirection) {
  const elemA = sortDirection === "ASC" ? a[sortBy] : b[sortBy];
  const elemB = sortDirection === "ASC" ? b[sortBy] : a[sortBy];

  console.log(sortBy, typeof elemA, elemA, elemB)
  
  if (typeof elemA === "number" && typeof elemB === "number")
    return elemA - elemB;
  if (typeof elemA === "boolean" && typeof elemB === "boolean")
    return elemA === elemB ? 0 : elemA ? 1 : -1;
  if (typeof elemA === "string" && typeof elemB === "string") {
    return elemA.toLowerCase().localeCompare(elemB.toLowerCase());
  }
  return 0;
}

function createTableRow(rowData, rowIndex, tableHeaders, path) {
  if (!rowData || !tableHeaders) return null;

  const cells = tableHeaders.map((h) => {
    let data = rowData[h.id];
    let props = {};

    if (typeof rowData[h.id] === "boolean") {
      data = rowData[h.id] ? "x" : "";
    } else if (h.redirect) {
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
      };
    } else if (h.onClick) {
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

  return <TableRow key={`table_row_${rowIndex}`}>{cells}</TableRow>;
}
