import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navigation } from '.';
import { Home, SnacksPage, SalesPage, StockPage } from './pages';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/snacks" element={<SnacksPage />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/stock" element={<StockPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
