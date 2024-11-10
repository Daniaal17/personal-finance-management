import { Fragment, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import OTPVerification from "./pages/Auth/Verification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";
import Dashboard from "./pages/Dashboard";
import UserLayout from "./components/UserLayout";
import Transactions from "./pages/Dashboard/Transactions";
import Settings from "./pages/Dashboard/Settings";
import Budget from "./pages/Dashboard/Budget";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<UserLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />

            <Route path="budget" element={<Budget />} />

            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verification" element={<OTPVerification />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>

          {/* <Route path="/products" element={<AdminLayout />}>
            <Route index element={<Products />} /> 
              <Route path="add" element={<AddProducts />} />
            <Route path="chat" element={<Chat />} /> 
            </Route> */}
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
