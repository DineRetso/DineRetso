import "./index.css";
import "./input.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainDashboard from "./Pages/Main_Dashboard";
import Navbar from "./Components/Navbar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import VerifyOTP from "./Pages/VerifyOTP";
import ResetPassword from "./Pages/ResetPassword";
import Register from "./Pages/Restaurants/Register/Register";
import ConfirmRegister from "./Pages/Restaurants/Register/ConfirmRegister";
import ManageRestaurant from "./Pages/Restaurants/ManageResto/ManageRestaurant";
import ShowPendingResto from "./ShowPendingResto";

function App() {
  return (
    <div>
      <ToastContainer position='top-center' limit={1} />
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainDashboard />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verifyOTP' element={<VerifyOTP />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/register-restaurant' element={<Register />} />
          <Route path='/confirm-register' element={<ConfirmRegister />} />
          <Route path='/manage-restaurants' element={<ManageRestaurant />} />
          <Route
            path='/manage-restaurant/pendingResto/:id'
            element={<ShowPendingResto />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
