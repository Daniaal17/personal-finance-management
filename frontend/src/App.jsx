import { Fragment } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

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
import Income from "./pages/Dashboard/Income";
import RetirementPlanner from "./pages/Dashboard/RetirementPlan";
import AuthGuard from "./pages/AuthGaurd";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
         
          <Route path="/auth">
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="verification" element={<OTPVerification />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
         

          {/* Protected Routes - Wrapped with PrivateRoute */}
          <Route element={<AuthGuard />}>
            <Route path="" element={<UserLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="income" element={<Income />} />
              <Route path="retirement" element={<RetirementPlanner />} />
              <Route path="budget" element={<Budget />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
                    {/* Redirect if user does not have token */}
                    <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />} />


          {/* Fallback Route for Non-existent Routes */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/auth/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
