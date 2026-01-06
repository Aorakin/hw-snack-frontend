# Snack POS Frontend

A modern React + TypeScript frontend for the Snack POS system.

## Features

- 🍿 **Snacks Management**: Add, view, and delete snack items
- 💰 **Sales Tracking**: Record sales and view transaction history
- 📦 **Stock Management**: Track inventory levels and stock status
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **Real-time Updates**: Context-based state management
- 📱 **Mobile Responsive**: Works on all device sizes

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - API requests
- **React Router** - Navigation
- **date-fns** - Date formatting

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   └── Navigation.tsx
├── context/         # State management
│   └── AppContext.tsx
├── pages/           # Page components
│   ├── Home.tsx
│   ├── SnacksPage.tsx
│   ├── SalesPage.tsx
│   └── StockPage.tsx
├── services/        # API layer
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── config.ts        # Configuration
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:5000
```

3. Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Backend Requirements

Make sure your backend API is running at `http://localhost:5000` with the following endpoints:

### Snacks
- `GET /snacks/` - Get all snacks
- `POST /snacks/` - Create snack
- `DELETE /snacks/{barcode}` - Delete snack

### Sales
- `GET /sales/` - Get all sales
- `POST /sales/` - Create sale
- `DELETE /sales/{id}` - Delete sale

### Stock
- `GET /stock/` - Get all stock entries
- `POST /stock/` - Create stock entry
- `PUT /stock/{id}` - Update stock entry
- `DELETE /stock/{id}` - Delete stock entry

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features Overview

### Snacks Management
- View all available snacks in a table
- Add new snacks with barcode, name, and price
- Delete existing snacks
- Real-time updates after operations

### Sales Tracking
- Record new sales with snack selection and quantity
- View sales history with timestamps
- Calculate total sales revenue
- Delete sale records
- Automatic stock deduction

### Stock Management
- Add stock entries with initial and current quantities
- View stock levels with percentage indicators
- Low stock warnings (< 30%)
- Delete stock entries
- Track stock over time

## Best Practices Implemented

✅ **TypeScript** - Full type safety
✅ **Component Architecture** - Reusable, modular components
✅ **Context API** - Centralized state management
✅ **Service Layer** - Separated API logic
✅ **Error Handling** - User-friendly error messages
✅ **Loading States** - Better UX during async operations
✅ **Responsive Design** - Mobile-first approach
✅ **Environment Variables** - Configurable API endpoints
✅ **Clean Code** - Consistent formatting and structure
