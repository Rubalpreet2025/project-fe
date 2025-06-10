# Electricity Usage Dashboard

A comprehensive dashboard for monitoring and optimizing electricity consumption with real-time insights and recommendations.


## Features

- Real-time electricity usage monitoring
- Appliance-specific energy consumption breakdowns
- Historical usage data visualization
- Energy-saving recommendations
- Appliance control and management
- User settings and preferences

## Project Structure

The project is divided into two main parts:

- `frontend`: A Next.js application with TypeScript and Tailwind CSS
- `backend`: A Node.js/Express.js API with MongoDB

## Setup and Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Running the Frontend

1. Clone this repository
2. Navigate to the frontend directory:

```bash
cd "Electricity Usage/frontend"
```

3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

### Backend Information

**Note**: The backend API is already hosted at https://electricity-dashboard-ax7w.onrender.com/api, so no setup is required to use the application.

### Running the Backend Locally (Optional)

If you want to run the backend locally instead of using the hosted version:

1. Navigate to the backend directory:

```bash
cd "Electricity Usage/backend"
```

2. Install dependencies:

```bash
npm install
```

3. Start the local server:

```bash
npm run dev
```

4. Update the API endpoint in `frontend/services/api.ts`:

```typescript
const API_URL = 'http://localhost:5000/api';
```

## API Documentation

The API provides endpoints for:

- `/api/appliances` - Manage appliances and their status
- `/api/energy` - Get real-time and historical energy data
- `/api/recommendations` - Get energy-saving recommendations
- `/api/settings` - Manage user settings and preferences

## Technologies Used

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express.js, MongoDB, Mongoose


