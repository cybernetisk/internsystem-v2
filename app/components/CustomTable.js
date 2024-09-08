
import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { cybTheme } from "./themeCYB";
import CustomAutoComplete from "./input/CustomAutocomplete";

// Styled table component
const TableStyle = styled(Table)(({ theme }) => ({
  overflowY: "scroll",
  height: "100%",
}));

// Styled TableCell with overflow control
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  whiteSpace: "nowrap",       // Prevent text wrapping
  overflow: "hidden",         // Hide overflow content
  textOverflow: "ellipsis",   // Show ellipsis (...) when content is too long
  maxWidth: "150px",          // Set a maximum width for the cell
  padding: useMediaQuery(cybTheme.breakpoints.down("md"))
    ? cybTheme.spacing(2)
    : cybTheme.spacing(1),  
}));

function CustomTable({ headers, data, defaultFilterBy }) {
  const [sortBy, setSortBy] = useState(() => headers[0]?.sortBy || null);
  const [sortDirection, setSortDirection] = useState("DESC");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  
  const [refresh, setRefresh] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [selectedSearchColumn, setSelectedSearchColumn] = useState(
    headers.filter((e) => e.id === defaultFilterBy)[0]
  );

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => sortTableRows(a, b, sortBy, sortDirection));
  }, [data, sortBy, sortDirection]);

  console.log(selectedSearchColumn)
  
  const paginatedData = useMemo(() => {
    return sortedData
    .filter((row) => {
      
      if (searchString.length === 0 || selectedSearchColumn === null) {
        return true;
      }
      
      return row[selectedSearchColumn.id]
        .toLowerCase()
        .includes(searchString.toLocaleLowerCase());
    })
    .slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [sortedData, page, rowsPerPage, refresh]);

  const handleSort = (headerId, altSortBy) => {
    const newSortBy =
      sortBy === headerId || sortBy === altSortBy
        ? sortBy
        : altSortBy || headerId;

    const newSortDirection =
      sortBy === newSortBy
        ? sortDirection === "DESC"
          ? "ASC"
          : "DESC"
        : "DESC";

    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const HeaderFlexTotal = headers
    ? headers.reduce((total, cur) => (total += cur.flex || 0), 0)
    : 0;

  if (!Array.isArray(data)) {
    console.error("table render error: ", data);
    return <div>Error: Data is not an array.</div>;
  }

  return (
    <Container
      component={Paper}
      elevation={3}
      disableGutters
      square
      sx={{ overflowX: { xs: "scroll", sm: "hidden" } }}
    >
      <Box sx={{ padding: 2 }}>
        <Grid
          container
          direction={{ xs: "column-reverse", md: "row" }}
          justifyContent="end"
          // columnSpacing={2}
          rowGap={{ xs: 2, md: 0 }}
          columnGap={{ xs: 0, md: 2 }}
        >
          <Grid item xs={2}>
            <Button
              fullWidth
              variant="outlined"
              sx={{ height: "100%" }}
              onClick={() => setRefresh(!refresh)}
            >
              Search
            </Button>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Search string"
              size="small"
              fullWidth
              onKeyDown={(e) =>
                e.key === "Enter" ? setRefresh(!refresh) : null
              }
              InputLabelProps={{ shrink: true }}
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <CustomAutoComplete
              label="Filter by row"
              dataLabel="name"
              data={headers}
              value={selectedSearchColumn}
              callback={setSelectedSearchColumn}
            />
          </Grid>
        </Grid>
      </Box>
      <TableStyle stickyHeader size="small">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header.id}
                sx={{
                  width: `${100 / (HeaderFlexTotal / header.flex)}%`,
                  // border: 1,
                  borderBottom: 1,
                  borderColor: cybTheme.palette.primary.main,
                  // color: cybTheme.palette.primary.main,
                  backgroundColor: cybTheme.palette.background.paper,
                  // backgroundColor: "red",
                  textDecoration:
                    header.id === sortBy || header.sortBy === sortBy
                      ? "underline"
                      : "none",
                  ":hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => handleSort(header.id, header.sortBy)}
              >
                {header.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row, index) =>
            createTableRow(row, index, headers)
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              count={data.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              showFirstButton
              showLastButton
            />
          </TableRow>
        </TableFooter>
      </TableStyle>
    </Container>
  );
}

// Helper function to sort table rows
function sortTableRows(a, b, sortBy, sortDirection) {
  const elemA = sortDirection === "ASC" ? a[sortBy] : b[sortBy];
  const elemB = sortDirection === "ASC" ? b[sortBy] : a[sortBy];

  if (typeof elemA === "number" && typeof elemB === "number")
    return elemA - elemB;
  if (typeof elemA === "boolean" && typeof elemB === "boolean")
    return elemA === elemB ? 0 : elemA ? 1 : -1;
  if (typeof elemA === "string" && typeof elemB === "string")
    return elemA.toLowerCase().localeCompare(elemB.toLowerCase());

  return 0;
}

// Helper function to create table rows
function createTableRow(rowData, rowIndex, headers) {
  return (
    <TableRow key={`table_row_${rowIndex}`}>
      {headers.map((header) => {
        
        let cellContent = rowData[header.id];

        if (typeof rowData[header.id] === "boolean") {
          cellContent = rowData[header.id] ? "x" : "";
        }

        return (
          <Tooltip
            title={cellContent}
            arrow
            enterTouchDelay={0}
            leaveTouchDelay={1500}
            placement="top-start"
            key={`tooltip_${header.id}_${rowIndex}`}
          >
            <StyledTableCell key={`cell_${header.id}_${rowIndex}`}>
              {cellContent}
            </StyledTableCell>
          </Tooltip>
        );
      })}
    </TableRow>
  );
}

CustomTable.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      sortBy: PropTypes.string,
      flex: PropTypes.number,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  sortBy: PropTypes.string
};

export default CustomTable;