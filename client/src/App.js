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
import ShowPendingResto from "./Pages/Restaurants/ManageResto/ShowPendingResto";
import AdminRoute from "./Components/AdminRoute";
import Service_Dashboard from "./Pages/Restaurants/Register/Service_Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import UserProfile from "./Pages/Profile/UserProfile";
import QRCodeGenerator from "./Pages/QRCodeGenerrator";

function App() {
  return (
    <div>
      <ToastContainer position='top-center' limit={1} />
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainDashboard />} />
          <Route path='/qr' element={<QRCodeGenerator />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verifyOTP' element={<VerifyOTP />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/dineretso-services' element={<Service_Dashboard />} />
          <Route
            path='/user/profile/:id'
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register-restaurant'
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/confirm-register'
            element={
              <ProtectedRoute>
                <ConfirmRegister />
              </ProtectedRoute>
            }
          />
          <Route
            path='/admin/manage-restaurants'
            element={
              <AdminRoute>
                <ManageRestaurant />
              </AdminRoute>
            }
          />
          <Route
            path='/admin/manage-restaurant/pendingResto/:id'
            element={
              <AdminRoute>
                <ShowPendingResto />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
