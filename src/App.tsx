import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./components/pages/Login";
import { Register } from "./components/pages/Register";
import { Dashboard } from "./components/pages/Dashboard";
import { ProtectedRoute } from "./components/ProductRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rota Protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
