import { Routes, Route, useLocation } from "react-router-dom";
import { Box, CssBaseline, Fade } from "@mui/material";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DashboardLayout from "./layouts/DashboardLayout";
import BackgroundAnimation from "./components/BackgroundAnimation";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import MyOrders from "./pages/MyOrders";
import UserDashboard from "./pages/UserDashboard";
import VerifyOtp from "./pages/verifyOtp";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Offers from "./pages/Offers";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import Wishlist from "./pages/Wishlist";
import AnalyticsDashboard from "./admin/AnalyticsDashboard";
import BulkOrder from "./pages/BulkOrder";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";
import AdminOrders from "./admin/AdminOrders";
import ManageSuppliers from "./admin/ManageSuppliers";
import ManageUsers from "./admin/ManageUsers";
import ActivityLogs from "./admin/ActivityLogs";
import BulkOrdersAdmin from "./admin/BulkOrdersAdmin";

// Staff pages
import StaffDashboard from "./staff/StaffDashboard";
import StaffOrders from "./staff/StaffOrders";
import UpdateStocks from "./staff/UpdateStocks";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const location = useLocation();
  const isDashboardRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/staff") ||
    location.pathname.startsWith("/user-dashboard");
  const hideFooter =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    isDashboardRoute;

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "transparent",
        }}
      >
        {location.pathname !== "/" && <BackgroundAnimation />}
        {!isDashboardRoute && <Navbar />}
        <ScrollToTop />

        <Box sx={{ flex: 1, py: 3 }}>
          <Fade in key={location.pathname} timeout={400}>
            <Box>
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/bulk-order" element={<BulkOrder />} />

                {/* CUSTOMER ROUTES */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute role="customer">
                      <Cart />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute role="customer">
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute role="customer">
                      <Payment />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-orders"
                  element={
                    <ProtectedRoute role="customer">
                      <MyOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute role="customer">
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/user-dashboard"
                  element={
                    <ProtectedRoute role="customer">
                      <DashboardLayout role="customer" title="Customer Dashboard">
                        <UserDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* ADMIN ROUTES */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Admin Dashboard">
                        <AdminDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/add-product"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Add Product">
                        <AddProduct />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/manage-products"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Manage Products">
                        <ManageProducts />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="All Orders">
                        <AdminOrders />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Order Analytics">
                        <AnalyticsDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/suppliers"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Suppliers">
                        <ManageSuppliers />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Manage Users">
                        <ManageUsers />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/activity-logs"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Activity Logs">
                        <ActivityLogs />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/bulk-orders"
                  element={
                    <ProtectedRoute role="admin">
                      <DashboardLayout role="admin" title="Bulk Orders">
                        <BulkOrdersAdmin />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* STAFF ROUTES */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute role="staff">
                      <DashboardLayout role="staff" title="Staff Dashboard">
                        <StaffDashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/staff/orders"
                  element={
                    <ProtectedRoute role="staff">
                      <DashboardLayout role="staff" title="Staff Orders">
                        <StaffOrders />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/staff/update-stocks"
                  element={
                    <ProtectedRoute role="staff">
                      <DashboardLayout role="staff" title="Inventory Management">
                        <UpdateStocks />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* NOT FOUND */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Box>
          </Fade>
        </Box>

        {!hideFooter && <Footer />}
      </Box>
    </>
  );
}

export default App;
