# Quick Start Guide

## Prerequisites

- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

## Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React & React DOM
- React Router (for navigation)
- Recharts (for charts)
- date-fns (for date formatting)
- Vite (build tool)

## Step 2: Configure API URL (Optional)

The app is configured to connect to the production backend API at:
- `https://mushbackend-production.up.railway.app/api`

If you need to use a different backend URL (e.g., for local development), create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3000/api
```

Or update the URL directly in `src/services/api.js` if needed.

**Note:** If you don't have a backend yet, the app will show errors when trying to fetch data. You can still see the UI structure, but you'll need to implement the backend (see `BACKEND_PROMPT.md`) for full functionality.

## Step 3: Start the Development Server

Run:

```bash
npm run dev
```

This will:
- Start the Vite development server
- Usually run on `http://localhost:5173`
- Open automatically in your browser (or check the terminal for the exact URL)
- Enable hot-reload (changes update automatically)

## Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port. Check the terminal output for the actual URL.

### Module Not Found Errors
Run `npm install` again to ensure all dependencies are installed.

### API Connection Errors
- Make sure your backend is running
- Check that the API URL in `.env` or `src/services/api.js` matches your backend URL
- Verify CORS is enabled on your backend

### Backend Not Ready Yet?
The frontend will work but show errors when fetching data. You can:
1. Implement the backend using `BACKEND_PROMPT.md`
2. Or use mock data temporarily for UI testing

## Next Steps

1. **If you have a backend:** Make sure it's running and accessible
2. **If you don't have a backend:** Follow the instructions in `BACKEND_PROMPT.md` to build one
3. **Start using the app:**
   - Create your first batch
   - Log daily observations
   - Record harvests
   - View charts and AI insights

## Development Tips

- The app uses React Router, so you can navigate directly to routes like `/batches/new`
- All components are mobile-responsive
- Check the browser console for any errors
- Use React DevTools for debugging

