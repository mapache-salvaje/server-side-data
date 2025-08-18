import React from 'react';
import useSWR from 'swr';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';

interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  salary: number;
  startDate: string;
}

interface ApiResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const EmployeeDataGrid: React.FC = () => {
  const { data, error, isLoading } = useSWR<ApiResponse>('http://localhost:3001/api/employees', fetcher);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
  ];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.message || 'An error occurred'}
      </Alert>
    );
  }

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Employee Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Server-side data with pagination, sorting, and filtering
      </Typography>
      
      <DataGrid
        rows={data?.data || []}
        columns={columns}
        pagination
        pageSizeOptions={[5, 10, 25, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default EmployeeDataGrid;
