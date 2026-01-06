# Quick Start Guide

## 🚀 Running the Application

### 1. Start the Backend (FastAPI)
```bash
cd D:\4D\sem2\snack_hw\snack_web
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 5000
```

### 2. Start the Frontend (React)
```bash
cd D:\4D\sem2\snack_front
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/docs

## 📝 Environment Variables

Make sure `.env` file exists in `snack_front` directory:
```
VITE_API_URL=http://localhost:5000
```

## 🎯 Available Features

### Snacks Management (`/snacks`)
- View all snacks
- Add new snack (barcode, name, price)
- Delete snacks

### Sales Tracking (`/sales`)
- View sales history
- Record new sales
- View total revenue
- Delete sales

### Stock Management (`/stock`)
- View stock levels
- Add stock entries
- Track stock percentages
- Low stock warnings

## 🔧 Troubleshooting

### CORS Issues
Make sure backend CORS is configured for `http://localhost:5173`

### Port Already in Use
- Frontend: Change port in `vite.config.ts`
- Backend: Use different port and update `.env`

### API Connection Failed
1. Check backend is running on port 5000
2. Verify `.env` has correct API URL
3. Check browser console for errors

## 📦 Project Structure

```
snack_front/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # State management
│   ├── pages/          # Page components
│   ├── services/       # API calls
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Main app
│   └── main.tsx        # Entry point
├── .env                # Environment variables
└── package.json        # Dependencies
```
