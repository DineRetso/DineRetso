import "./index.css";
import "./input.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainDashboard from "./Pages/Main_Dashboard";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";
import Register from "./Pages/Register/Register";

function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainDashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verifyOTP' element={<VerifyOTP />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/register-restaurant' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
