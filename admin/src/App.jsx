// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import LoginPage from "./pages/LoginPage"; 
import PrivateRoute from "./components/PrivateRoute";
import { UserProvider } from "./context/UserContext";
import AutoLogoutHandler from "./components/AutoLogoutHandler";

function App() {
  return (
    <UserProvider>
      
      <BrowserRouter>
      <AutoLogoutHandler />
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="products" element={<Products />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="customers" element={<Customers />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
