# Building a server-side data grid with MUI X Data Grid: A step-by-step tutorial

This tutorial walks you through building a data grid that fetches data from a server with pagination, sorting, and filtering. Focus on the `EmployeeDataGrid.tsx` component and break it down into digestible pieces.

## Prerequisites

- Basic React knowledge
- Understanding of TypeScript interfaces
- Familiarity with async/await and fetch API

## Project setup

### 1. Create the project structure

Create a new directory and set up the folder structure:

```bash
mkdir server-side-data
cd server-side-data
mkdir client server
```

### 2. Initialize the server

Navigate to the server directory and initialize:

```bash
cd server
npm init -y
```

Install server dependencies:

```bash
npm install express cors
npm install --save-dev typescript @types/express @types/node tsx
```

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. Initialize the client

Navigate to the client directory and create a React app:

```bash
cd ../client
npm create vite@latest . -- --template react-ts
npm install
```

Install MUI dependencies:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-data-grid @fontsource/roboto
```

### 4. Set up the server code

Create `server/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Dummy data - simulating a database
const dummyData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', department: 'Engineering', salary: 75000, startDate: '2023-01-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', department: 'Design', salary: 65000, startDate: '2023-02-20' },
  // Add more dummy data as needed
];

app.get('/api/employees', (req, res) => {
  const { page = 0, pageSize = 40, sortModel = [], filterModel = {} } = req.query;
  
  let filteredData = [...dummyData];
  
  // Apply filtering
  if (filterModel && typeof filterModel === 'string') {
    try {
      const filters = JSON.parse(filterModel as string);
      if (filters.items && filters.items.length > 0) {
        filteredData = filteredData.filter(item => {
          return filters.items.every((filter: any) => {
            const value = item[filter.columnField as keyof typeof item];
            if (filter.operatorValue === 'contains') {
              return String(value).toLowerCase().includes(filter.value.toLowerCase());
            }
            if (filter.operatorValue === 'equals') {
              return String(value) === filter.value;
            }
            if (filter.operatorValue === 'startsWith') {
              return String(value).toLowerCase().startsWith(filter.value.toLowerCase());
            }
            return true;
          });
        });
      }
    } catch (e) {
      // Invalid filter, return all data
    }
  }
  
  // Apply sorting
  if (sortModel && typeof sortModel === 'string') {
    try {
      const sorts = JSON.parse(sortModel as string);
      if (sorts.length > 0) {
        filteredData.sort((a, b) => {
          for (const sort of sorts) {
            const aVal = a[sort.field as keyof typeof a];
            const bVal = b[sort.field as keyof typeof b];
            
            if (aVal < bVal) return sort.sort === 'desc' ? 1 : -1;
            if (aVal > bVal) return sort.sort === 'desc' ? -1 : 1;
          }
          return 0;
        });
      }
    } catch (e) {
      // Invalid sort, keep original order
    }
  }
  
  // Apply pagination
  const startIndex = Number(page) * Number(pageSize);
  const endIndex = startIndex + Number(pageSize);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  res.json({
    data: paginatedData,
    total: filteredData.length,
    page: Number(page),
    pageSize: Number(pageSize)
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### 5. Set up the client code

Update `client/src/App.tsx`:

```typescript
import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import EmployeeDataGrid from './components/EmployeeDataGrid';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ padding: '20px' }}>
        <EmployeeDataGrid />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 6. Add scripts to package.json files

In `server/package.json`, add:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 7. Run the application

Start the server:

```bash
cd server
npm run dev
```

In a new terminal, start the client:

```bash
cd client
npm run dev
```

The server runs on `http://localhost:3001` and the client on `http://localhost:5173`.

## 1. Understanding the data structure

First, define what your data looks like. Create interfaces that match your server response:

```typescript
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
```

**What's happening here:**
- `Employee` defines the structure of each row in your grid
- `ApiResponse` defines what the server sends back, including metadata like total count and pagination info
- The `total` field is crucial for server-side pagination - it tells the grid how many total rows exist

## 2. Setting up the grid columns

Next, define how each column should appear and behave:

```typescript
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: 'Name', width: 200 },
  { field: 'email', headerName: 'Email', width: 250 },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'department', headerName: 'Department', width: 150 },
  { field: 'salary', headerName: 'Salary', width: 120 },
  { field: 'startDate', headerName: 'Start Date', width: 130 },
];
```

**What's happening here:**
- `field` maps to the property names in your `Employee` interface
- `headerName` is what users see in the column header
- `width` sets the initial column width in pixels
- Each column will automatically support sorting and filtering

## 3. Understanding GridDataSource

This is the heart of server-side data handling. The `GridDataSource` tells the grid how to fetch data:

```typescript
const dataSource: GridDataSource = useMemo(() => ({
  getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
    // You'll implement this function next
  },
}), []);
```

**What's happening here:**
- `GridDataSource` is a MUI X Data Grid concept that replaces the old `rows` prop
- `getRows` is an async function that the grid calls whenever it needs data
- `params` contains all the information about what data the grid needs
- Wrap it in `useMemo` to prevent recreating the function on every render

## 4. Building the URL parameters

Inside `getRows`, construct the API call with the grid's current state:

```typescript
const urlParams = new URLSearchParams({
  page: params.paginationModel?.page?.toString() || '0',
  pageSize: params.paginationModel?.pageSize?.toString() || '40',
  sortModel: JSON.stringify(params.sortModel || []),
  filterModel: JSON.stringify(params.filterModel || {}),
});
```

**What's happening here:**
- `params.paginationModel.page` tells you which page the user is viewing (0-based)
- `params.paginationModel.pageSize` tells you how many rows per page
- `params.sortModel` contains which columns are sorted and in what direction
- `params.filterModel` contains any active filters
- Convert these to query parameters that your server can understand

## 5. Making the API call

Now fetch the data from your server:

```typescript
const response = await fetch(`http://localhost:3001/api/employees?${urlParams.toString()}`);

if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}

const result: ApiResponse = await response.json();
```

**What's happening here:**
- Use the native `fetch` API to call your server
- The URL includes all the parameters you built in the previous step
- Check if the response is successful and throw an error if not
- Parse the JSON response into your `ApiResponse` interface

## 6. Returning the data to the grid

Finally, return the data in the format the grid expects:

```typescript
return {
  rows: result.data,
  rowCount: result.total,
};
```

**What's happening here:**
- `rows` contains the actual data for the current page
- `rowCount` tells the grid the total number of rows available (for pagination)
- The grid will automatically update its pagination controls based on `rowCount`

## 7. Putting it all together

Now see the complete `getRows` function:

```typescript
const dataSource: GridDataSource = useMemo(() => ({
  getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
    const urlParams = new URLSearchParams({
      page: params.paginationModel?.page?.toString() || '0',
      pageSize: params.paginationModel?.pageSize?.toString() || '40',
      sortModel: JSON.stringify(params.sortModel || []),
      filterModel: JSON.stringify(params.filterModel || {}),
    });

    const response = await fetch(`http://localhost:3001/api/employees?${urlParams.toString()}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: ApiResponse = await response.json();
    
    return {
      rows: result.data,
      rowCount: result.total,
    };
  },
}), []);
```

## 8. Rendering the DataGrid

Finally, render the grid with your configuration:

```typescript
<DataGrid
  columns={columns}
  dataSource={dataSource}
  pagination
  pageSizeOptions={[5, 10, 25, 100]}
  disableRowSelectionOnClick
/>
```

**What's happening here:**
- `columns` defines your column structure
- `dataSource` provides your server-side data fetching logic
- `pagination` enables pagination controls
- `pageSizeOptions` lets users choose how many rows to see per page
- `disableRowSelectionOnClick` prevents row selection when clicking cells

## 9. Adding the UI wrapper

Wrap everything in a nice container:

```typescript
return (
  <Box sx={{ height: 600, width: '100%' }}>
    <Typography variant="h4" component="h1" gutterBottom>
      Employee Management
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
      Server-side data with pagination, sorting, and filtering
    </Typography>
    
    <DataGrid
      columns={columns}
      dataSource={dataSource}
      pagination
      pageSizeOptions={[5, 10, 25, 100]}
      disableRowSelectionOnClick
    />
  </Box>
);
```

## How the data flow works

1. **User Interaction**: User clicks pagination, sorts a column, or applies a filter
2. **Grid State Change**: The grid updates its internal state (pagination, sorting, filtering)
3. **Data Request**: Grid calls your `getRows` function with the new parameters
4. **API Call**: Construct a URL with the parameters and fetch from the server
5. **Server Processing**: Server applies pagination, sorting, and filtering to the data
6. **Response**: Server returns only the data needed for the current page
7. **Grid Update**: Grid displays the new data and updates pagination controls

## Key benefits of this approach

- **Performance**: Only loads the data you need, not the entire dataset
- **Scalability**: Works with millions of rows without performance issues
- **User Experience**: Fast pagination, sorting, and filtering
- **Network Efficiency**: Minimal data transfer between client and server

## Common gotchas to watch for

1. **Error Handling**: Always check `response.ok` and handle errors gracefully
2. **Default Values**: Provide sensible defaults for pagination (page 0, reasonable page size)
3. **Type Safety**: Use TypeScript interfaces to catch errors at compile time
4. **Memoization**: Use `useMemo` to prevent recreating the data source on every render

## Complete component code

Here is the complete `EmployeeDataGrid.tsx` component for reference:

```typescript
import React, { useMemo } from 'react';
import { DataGrid, type GridColDef, type GridDataSource, type GridGetRowsParams, type GridGetRowsResponse } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

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

const EmployeeDataGrid: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'role', headerName: 'Role', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'salary', headerName: 'Salary', width: 120 },
    { field: 'startDate', headerName: 'Start Date', width: 130 },
  ];

  const dataSource: GridDataSource = useMemo(() => ({
    getRows: async (params: GridGetRowsParams): Promise<GridGetRowsResponse> => {
      const urlParams = new URLSearchParams({
        page: params.paginationModel?.page?.toString() || '0',
        pageSize: params.paginationModel?.pageSize?.toString() || '40',
        sortModel: JSON.stringify(params.sortModel || []),
        filterModel: JSON.stringify(params.filterModel || {}),
      });

      const response = await fetch(`http://localhost:3001/api/employees?${urlParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse = await response.json();
      
      return {
        rows: result.data,
        rowCount: result.total,
      };
    },
  }), []);

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Employee Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Server-side data with pagination, sorting, and filtering
      </Typography>
      
      <DataGrid
        columns={columns}
        dataSource={dataSource}
        pagination
        pageSizeOptions={[5, 10, 25, 100]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default EmployeeDataGrid;
```

This approach gives you a production-ready data grid that handles large datasets efficiently while providing a smooth user experience. The key is understanding that the grid is just a UI component - all the heavy lifting happens on the server.
