import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context";
import Layout from "./layout";
import { LoginPage, RegisterPage, UserPage } from "./pages";
import { ProtectedRoute } from "./components";
import RequestsPage from "./pages/Request";
import { ProjectPage } from "./pages/Project";
import { ProfilePage } from "./pages/User/Profile";
import { ClientInstancePage } from "./pages/Client/components";
import HomePage from "./pages/Home";
import ClientPage from "./pages/Client";

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
            <Route path="/requests" element={<RequestsPage />} />
            <Route path="/users" element={<UserPage />} />
            <Route path="/users/:id" element={<ProfilePage />} />
            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:id" element={<ClientInstancePage />} />
            <Route path="/projects" element={<ProjectPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
