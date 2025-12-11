import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import UserPage from "./pages/User";
import Layout from "./layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
