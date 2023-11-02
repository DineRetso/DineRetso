import "./index.css";
import "./input.css";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
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
import ShowPendingResto from "./Dine-Secret/ManageResto/ShowPendingResto";
import AdminRoute from "./Components/Routes/AdminRoute";
import OwnerRoute from "./Components/Routes/OwnerRoute";
import Service_Dashboard from "./Pages/Restaurants/Register/Service_Dashboard";
import ProtectedRoute from "./Components/Routes/ProtectedRoute";
import UserProfile from "./Pages/Profile/UserProfile";
import QRCodeGenerator from "./Pages/QRCodeGenerrator";
import OwnerView from "./Pages/Restaurants/Restaurant View/OwnerView";
import AdminLogin from "./Dine-Secret/AdminLogin";
import Dashboard from "./Dine-Secret/Dashboard";
import Restaurant from "./Pages/Restaurants/Restaurant View/Restaurant";
import OwnerNavbar from "./Components/Owner/OwnerNavbar";
import OwnerDashboard from "./Pages/Owner/OwnerDashboard";
import OwnerMenu from "./Pages/Owner/OwnerMenu";
import RestaurantMainView from "./Pages/Restaurants/Restaurant View/RestaurantMainView";
import Customers from "./Pages/Owner/Customers";

import SubscriptionDetails from "./Pages/Owner/Subscriptions/SubscriptionDetails";
import AboutUs from "./Pages/AboutUs";
import RestaurantMenu from "./Pages/Restaurants/Restaurant View/RestaurantMenu";
import DineNavbar from "./Dine-Secret/DineNavbar";
import Static from "./Components/Dine/Static";
import Restaurants from "./Dine-Secret/Restaurants/Restaurants";
import Registration from "./Dine-Secret/Regsitration/Registration";
import BlogPost from "./Dine-Secret/BlogPost/BlogPost";
import AddBlog from "./Dine-Secret/BlogPost/AddBlog";
import PlansAndPricing from "./Pages/Owner/Subscriptions/PlansAndPricing";
import SubscriptionDashboard from "./Pages/Owner/Subscriptions/SubscriptionDashboard";
import OwnerAnalytics from "./Pages/Owner/OwnerAnalytics";
import DineCustomers from "./Dine-Secret/Customers/DineCustomers";
import ViewPosting from "./Dine-Secret/BlogPost/ViewPosting";
import PostingDashboard from "./Pages/Owner/Posting/PostingDashboard";
import AddPosting from "./Pages/Owner/Posting/AddPosting";
import ViewOwnerPosting from "./Pages/Owner/Posting/ViewOwnerPosting";
import EditPosting from "./Pages/Owner/Posting/EditPosting";
import PostView from "./Pages/Restaurants/Restaurant View/PostView";
import MenuView from "./Pages/Restaurants/Restaurant View/MenuView";
import Settings from "./Pages/Owner/Settings/Settings";
import PaymentDashboard from "./Dine-Secret/Payments/PaymentDashboard";
import RestaurantView2 from "./Components/Dine/RestaurantView2";

function App() {
  return (
    <div>
      <ToastContainer position='top-center' limit={1} />
      <BrowserRouter>
        <Routes>
          <Route path='/dine-admin/secret/login' element={<AdminLogin />} />

          <Route
            path='/dine/admin/secret/*'
            element={
              <div>
                <AdminRoute>
                  <DineNavbar />
                </AdminRoute>
                <AdminRoute>
                  <Static />
                </AdminRoute>
                <Routes>
                  <Route
                    path='/admin-dashboard'
                    element={
                      <AdminRoute>
                        <Dashboard />
                      </AdminRoute>
                    }
                  />
                
                  <Route
                    path='/registration/pendingResto/:id'
                    element={
                      <AdminRoute>
                        <ShowPendingResto />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/restaurants'
                    element={
                      <AdminRoute>
                        <Restaurants />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/restaurant/:id'
                    element={
                      <AdminRoute>
                        <RestaurantView2 />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/registration'
                    element={
                      <AdminRoute>
                        <Registration />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/posting'
                    element={
                      <AdminRoute>
                        <ViewPosting />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/blog-post'
                    element={
                      <AdminRoute>
                        <BlogPost />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/add-blog-post/:id'
                    element={
                      <AdminRoute>
                        <AddBlog />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/customers'
                    element={
                      <AdminRoute>
                        <DineCustomers />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path='/payments'
                    element={
                      <AdminRoute>
                        <PaymentDashboard />
                      </AdminRoute>
                    }
                  />
                </Routes>
              </div>
            }
          />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/verifyOTP' element={<VerifyOTP />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route
            path='/dineretso-restaurant/*'
            element={
              <div>
                <OwnerNavbar />
                <Routes>
                  <Route
                    path='/:resName/dashboard'
                    element={
                      <OwnerRoute>
                        <OwnerDashboard />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:owner/Menu'
                    element={
                      <OwnerRoute>
                        <OwnerMenu />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resName/customers'
                    element={
                      <OwnerRoute>
                        <Customers />
                      </OwnerRoute>
                    }
                  />

                  <Route
                    path='/:resName/PlansNPricing'
                    element={
                      <OwnerRoute>
                        <PlansAndPricing />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resName/owner-posting'
                    element={
                      <OwnerRoute>
                        <PostingDashboard />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resName/owner-posting/add'
                    element={
                      <OwnerRoute>
                        <AddPosting />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/posting/:postingId'
                    element={
                      <OwnerRoute>
                        <ViewOwnerPosting />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/editPost/:postingId'
                    element={
                      <OwnerRoute>
                        <EditPosting />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resName/subscription/dashboard'
                    element={
                      <OwnerRoute>
                        <SubscriptionDashboard />
                      </OwnerRoute>
                    }
                  />

                  <Route
                    path=':name/:resId/details'
                    element={
                      <OwnerRoute>
                        <SubscriptionDetails />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resname/analytics'
                    element={
                      <OwnerRoute>
                        <OwnerAnalytics />
                      </OwnerRoute>
                    }
                  />
                  <Route
                    path='/:resname/settings'
                    element={
                      <OwnerRoute>
                        <Settings />
                      </OwnerRoute>
                    }
                  />
                </Routes>
              </div>
            }
          />
          <Route
            path='*'
            element={
              <div>
                <Navbar />
                <Routes>
                  <Route path='/' element={<MainDashboard />} />
                  <Route path='/qr' element={<QRCodeGenerator />} />

                  <Route path='/Restaurants' element={<Restaurant />} />
                  <Route path='/AboutUs' element={<AboutUs />} />
                  <Route path='/Menus' element={<RestaurantMenu />} />
                  <Route path='/Menu/:menuId' element={<MenuView />} />
                  <Route
                    path='/ViewRestoPost/:id/:postSource'
                    element={<PostView />}
                  />
                  <Route
                    path='/Restaurant/:resName/:source'
                    element={<RestaurantMainView />}
                  />
                  <Route
                    path='/dineretso-services'
                    element={<Service_Dashboard />}
                  />
                  <Route
                    path='/dineretso-restaurants/:owner/:restaurantID'
                    element={
                      <OwnerRoute>
                        <OwnerView />
                      </OwnerRoute>
                    }
                  />

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
                </Routes>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
