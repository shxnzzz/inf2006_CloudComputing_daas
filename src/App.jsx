import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TrendPage from "./pages/TrendPage";
import ComparePage from "./pages/ComparePage";
import OutliersPage from "./pages/OutliersPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" end>Dashboard</NavLink>
        <NavLink to="/trend">Trend Analysis</NavLink>
        <NavLink to="/compare">Compare Groups</NavLink>
        <NavLink to="/outliers">Outlier Detection</NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trend" element={<TrendPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/outliers" element={<OutliersPage />} />
      </Routes>
    </BrowserRouter>
  );
}
