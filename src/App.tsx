import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import UserPage from "./pages/User";
import Layout from "./layout";
import { ProtectedRoute } from "./components";
import RegisterPage from "./pages/Auth/Register";
import { AuthProvider } from "./context/AuthProvider";
import { LoginPage } from "./pages";
import { QueryClient } from "@tanstack/react-query";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/users" element={<UserPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
