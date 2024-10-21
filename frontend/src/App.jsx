import { Fragment, useState } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route path="" element={<Login />} />
            <Route path="signup" element={<Signup />} />
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
