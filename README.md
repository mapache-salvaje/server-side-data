# Server-Side Data Application

A full-stack application demonstrating server-side data handling with MUI Data Grid, featuring pagination, sorting, and filtering capabilities.

## Features

- **Frontend**: React + TypeScript + Vite with MUI v7 components
- **Backend**: Express.js server with TypeScript
- **Data Grid**: MUI X Data Grid with server-side pagination, sorting, and filtering
- **No External Fetching Libraries**: Uses native `fetch()` API
- **Dummy Data**: Sample employee data for demonstration

## Project Structure

```
server-side-data/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── EmployeeDataGrid.tsx
│   │   └── App.tsx
│   └── package.json
├── server/                 # Express backend
│   ├── src/
│   │   └── index.ts
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm (v9 or higher)

## Installation & Setup

### 1. Install Server Dependencies

```bash
cd server
pnpm install
```

### 2. Install Client Dependencies

```bash
cd client
pnpm install
```

## Running the Application

### 1. Start the Backend Server

```bash
cd server
pnpm dev
```

The server will start on `http://localhost:3001`

**Available endpoints:**
- `GET /api/employees` - List employees with pagination, sorting, and filtering
- `GET /api/employees/:id` - Get specific employee
- `GET /health` - Health check

### 2. Start the Frontend Client

In a new terminal:

```bash
cd client
pnpm dev
```

The client will start on `http://localhost:5173`

## How It Works

### Server-Side Data Handling

The application demonstrates true server-side data operations:

1. **Pagination**: Server handles page size and offset calculations
2. **Sorting**: Server sorts data based on column and direction
3. **Filtering**: Server applies filters to the dataset
4. **Data Fetching**: Client only receives the data it needs

### Data Grid Features

- **Server-side pagination** with configurable page sizes
- **Server-side sorting** on any column
- **Server-side filtering** with multiple operators
- **Built-in toolbar** with export, filter, and column management
- **Responsive design** with proper column sizing
- **Loading states** and error handling

### API Integration

The Data Grid communicates with the server through:
- `paginationModel` → `page` and `pageSize` query parameters
- `sortModel` → `sortModel` query parameter (JSON string)
- `filterModel` → `filterModel` query parameter (JSON string)

## Development

### Adding New Features

1. **New Columns**: Add to the `columns` array in `EmployeeDataGrid.tsx`
2. **New Data**: Extend the `Employee` interface and server data
3. **New API Endpoints**: Add routes in `server/src/index.ts`

### Building for Production

```bash
# Build server
cd server
pnpm build
pnpm start

# Build client
cd client
pnpm build
```

## Technologies Used

- **Frontend**: React 19, TypeScript, Vite, MUI v7
- **Backend**: Express.js, TypeScript, Node.js
- **Data Grid**: MUI X Data Grid v8
- **Package Manager**: pnpm
- **Development**: tsx for TypeScript execution

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001 (server) and 5173 (client) are available
2. **CORS errors**: The server includes CORS middleware for development
3. **TypeScript errors**: Run `pnpm build` in the server directory to check for type issues

### Server Not Starting

- Check if TypeScript compilation succeeds: `pnpm build`
- Verify all dependencies are installed: `pnpm install`
- Check console for error messages

### Client Not Connecting

- Ensure server is running on port 3001
- Check browser console for network errors
- Verify CORS is properly configured

## Next Steps

This application can be extended with:

- **Database Integration**: Replace dummy data with real database
- **Authentication**: Add user login and authorization
- **CRUD Operations**: Implement create, update, delete functionality
- **Real-time Updates**: Add WebSocket support for live data
- **Advanced Filtering**: Implement more complex filter operators
- **Data Export**: Add CSV/Excel export functionality
