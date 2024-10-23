import { Fragment, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import OTPVerification from "./pages/Auth/Verification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import { ResetPassword } from "./pages/Auth/ResetPassword";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
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
