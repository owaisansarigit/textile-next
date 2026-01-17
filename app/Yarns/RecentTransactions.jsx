import { useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Stack,
  TextField,
  Autocomplete,
  TablePagination,
  Skeleton,
} from "@mui/material";

import { TX_META } from "./utils";

const getYarnLabel = (y) => (y ? `${y.category}-${y.count}-${y.name}` : "");

export default function RecentTransactions({ transactions = [], loading }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    type: null,
    weaver: null,
    yarn: null,
  });

  const options = useMemo(
    () => ({
      type: [...new Set(transactions.map((t) => t.transactionType))],
      weaver: [
        ...new Set(transactions.map((t) => t.wLedgerId?.name).filter(Boolean)),
      ],
      yarn: [
        ...new Set(
          transactions.map((t) => getYarnLabel(t.yarnId)).filter(Boolean),
        ),
      ],
    }),
    [transactions],
  );

  const filtered = useMemo(() => {
    return transactions.filter(
      (t) =>
        (!filters.type || t.transactionType === filters.type) &&
        (!filters.weaver || t.wLedgerId?.name === filters.weaver) &&
        (!filters.yarn || getYarnLabel(t.yarnId) === filters.yarn),
    );
  }, [transactions, filters]);

  const data = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage],
  );

  const SkeletonRow = () => (
    <TableRow>
      {Array.from({ length: 8 }).map((_, i) => (
        <TableCell key={i}>
          <Skeleton height={24} />
        </TableCell>
      ))}
    </TableRow>
  );

  return (
    <Card elevation={2}>
      <CardHeader title="Recent Transactions" />

      {/* Filters */}
      <Stack direction="row" spacing={1} px={1} pb={0.5}>
        <Autocomplete
          size="small"
          options={options.type}
          value={filters.type}
          onChange={(_, v) => setFilters({ ...filters, type: v })}
          sx={{ width: 130 }}
          renderInput={(p) => (
            <TextField
              {...p}
              label="Type"
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                  padding: "4px 6px",
                },
              }}
            />
          )}
        />

        <Autocomplete
          size="small"
          options={options.weaver}
          value={filters.weaver}
          onChange={(_, v) => setFilters({ ...filters, weaver: v })}
          sx={{ width: 150 }}
          renderInput={(p) => (
            <TextField
              {...p}
              label="Weaver"
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                  padding: "4px 6px",
                },
              }}
            />
          )}
        />

        <Autocomplete
          size="small"
          options={options.yarn}
          value={filters.yarn}
          onChange={(_, v) => setFilters({ ...filters, yarn: v })}
          sx={{ width: 220 }}
          renderInput={(p) => (
            <TextField
              {...p}
              label="Yarn"
              size="small"
              sx={{
                "& .MuiInputBase-input": {
                  fontSize: 13,
                  padding: "4px 6px",
                },
              }}
            />
          )}
        />
      </Stack>

      <CardContent sx={{ p: 0 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Weaver</TableCell>
              <TableCell>Yarn</TableCell>
              <TableCell align="right">Open</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Close</TableCell>
              <TableCell>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: rowsPerPage }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              : data.map((t) => (
                  <TableRow key={t._id} hover>
                    <TableCell>
                      <Chip
                        size="small"
                        icon={
                          <i
                            className={`bi ${TX_META[t.transactionType].icon}`}
                          />
                        }
                        label={t.transactionType}
                        color={TX_META[t.transactionType].color}
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(t.createdAt).toLocaleDateString("en-GB")}
                    </TableCell>

                    <TableCell>{t.wLedgerId?.name}</TableCell>

                    <TableCell>{getYarnLabel(t.yarnId)}</TableCell>

                    <TableCell align="right">{t.openingBalance} kg</TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color:
                          t.transactionType === "issue"
                            ? "error.main"
                            : "success.main",
                      }}
                    >
                      {t.transactionType === "issue" ? "-" : "+"}
                      {Math.abs(t.quantity)} kg
                    </TableCell>

                    <TableCell align="right">{t.closingBalance} kg</TableCell>

                    <TableCell>{t.remarks}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(+e.target.value);
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </CardContent>
    </Card>
  );
}
