
import {
  Box,
  Button,
  Card,
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
  useMediaQuery,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import { styled } from "@mui/system";
import PropTypes from "prop-types";
import { cybTheme } from "./themeCYB";
import CustomAutoComplete from "./input/CustomAutocomplete";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import locale from "date-fns/locale/en-GB";
import TextFieldWithX from "./input/TextFieldWithX";

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

const filterTableOptions = [
  { id: "contains", name: "contains" },
  { id: "larger_than", name: "is larger than" },
  { id: "less_than", name: "is less than" },
  { id: "equal_to", name: "is equal to" },
];

const booleanFilterOptions = [
  { id: "true", name: "True" },
  { id: "false", name: "False" },
]

function CustomTable({ headers, data, defaultFilterBy=null }) {
  let header = null;
  if (defaultFilterBy) {
    header = headers.filter(h => h.id == defaultFilterBy)[0];
  } else {
    header = headers[0]
  }
  const [sortBy, setSortBy] = useState(() => headers[0]?.sortBy || null);
  const [sortDirection, setSortDirection] = useState("DESC");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  
  const [refresh, setRefresh] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  
  const [availableFilterOptions, setAvailableFilterOptions] = useState(
    header.type === "string" || header.type === "boolean" 
    ? filterTableOptions.filter((e) => e.id === "contains") 
    : filterTableOptions.filter((e) => e.id !== "contains")
  );
  const [selectedFilterOption, setSelectedFilterOption] = useState(availableFilterOptions[0]);
  const [selectedSearchColumn, setSelectedSearchColumn] = useState(header);
  const [selectedBooleanOption, setSelectedBooleanOption] = useState(null);

  

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => sortTableRows(a, b, sortBy, sortDirection));
  }, [data, sortBy, sortDirection]);

  const filteredData = useMemo(() => {
    setPage(0);
    return sortedData.filter((row) => {
      if (selectedSearchColumn === null || selectedFilterOption === null) {
        return true;
      }
      
      let e1, e2;
      
      switch (selectedSearchColumn.type) {
        case "date":
          e1 = selectedDateTime.getTime();
          break;
        case "boolean":
          e1 = selectedBooleanOption?.id;
          break;
        default:
          e1 = searchString
          break;
      }
          
      if (!e1 || e1.length === 0 || e1 === 0) {
        return true;
      }

      e2 = 
        selectedSearchColumn.sortBy
        ? row[selectedSearchColumn.sortBy]
        : row[selectedSearchColumn.id]

      try {
        switch (selectedFilterOption.id) {
          case "contains":
            return e2
              .toString()
              .toLowerCase()
              .includes(e1.toLocaleLowerCase());
          case "larger_than":
            return Number(e2) > Number(e1);
          case "less_than":
            return Number(e2) < Number(e1);
          case "equal_to":
            return Number(e2) === Number(e1);
        }
      } catch (error) {
        console.error("An error occured while filtering table rows", error);
        return true;
      }
      
    });
  }, [sortedData, refresh]);
  
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [filteredData, page, rowsPerPage]);

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
  
  const handleSelectedSortColumn = (e) => {
    if (!e) {
      setAvailableFilterOptions([]);
    } else if (e.type === "string" || e.type === "boolean") {
      setAvailableFilterOptions(filterTableOptions.filter((e) => e.id === "contains"));
    } else {
      setAvailableFilterOptions(filterTableOptions.filter((e) => e.id !== "contains"));
    }
    
    setSelectedFilterOption(availableFilterOptions.length > 0 ? availableFilterOptions[0] : null);
    setSelectedBooleanOption(null);
    setSearchString("");
    
    setSelectedSearchColumn(e);
  }
  
  let searchComponent = (
    <TextFieldWithX
      label="Search string"
      name="searchString"
      value={searchString}
      setValue={setSearchString}
      onKeyDown={(e) => (e.key === "Enter" ? setRefresh(!refresh) : null)}
    />
  );
  
  if (selectedSearchColumn) {    
    switch (selectedSearchColumn.type) {
      case "boolean":
        searchComponent = (
          <CustomAutoComplete
            label="Boolean"
            dataLabel="name"
            data={booleanFilterOptions}
            value={selectedBooleanOption}
            callback={setSelectedBooleanOption}
          />
        );
        break;
      case "date":
        searchComponent = (
          <LocalizationProvider
            dateAdapter={AdapterDateFns}
            adapterLocale={locale}
          >
            <DateTimePicker
              label="Search date/time"
              defaultValue={selectedDateTime}
              ampm={false}
              disableOpenPicker
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: "small",
                  onKeyDown: (e) => {
                    e.key === "Enter" ? setRefresh(!refresh) : null;
                  },
                },
              }}
              onChange={(e) => setSelectedDateTime(e)}
            />
          </LocalizationProvider>
        );
        break;
    }
  }

  const HeaderFlexTotal = headers
    ? headers.reduce((total, cur) => (total += cur.flex || 0), 0)
    : 0;

  if (!Array.isArray(data)) {
    console.error("table render error: ", data);
    return <div>Error: Data is not an array.</div>;
  }
  
  return (
    <Stack spacing={2}>
      <Card elevation={3}>
        <Box sx={{ padding: 2 }}>
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            justifyContent="end"
            rowGap={{ xs: 2, md: 0 }}
            columnGap={{ xs: 0, md: 2 }}
          >
            <Grid item xs={3}>
              <CustomAutoComplete
                label="Column to filter"
                dataLabel="name"
                data={headers}
                value={selectedSearchColumn}
                callback={handleSelectedSortColumn}
              />
            </Grid>
            <Grid item xs>
              <CustomAutoComplete
                label="Filter option"
                dataLabel="name"
                data={availableFilterOptions}
                value={selectedFilterOption}
                callback={setSelectedFilterOption}
              />
            </Grid>
            <Grid item xs={3}>
              {searchComponent}
            </Grid>
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
          </Grid>
        </Box>
      </Card>
      <Container
        component={Paper}
        elevation={3}
        disableGutters
        square
        sx={{ overflowX: { xs: "scroll", sm: "hidden" } }}
      >
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
                count={filteredData.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setPage(0);
                  setRowsPerPage(parseInt(event.target.value, 10));
                }}
                showFirstButton
                showLastButton
              />
            </TableRow>
          </TableFooter>
        </TableStyle>
      </Container>
    </Stack>
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
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      flex: PropTypes.number.isRequired,
      sortBy: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  sortBy: PropTypes.string,
};

export default CustomTable;