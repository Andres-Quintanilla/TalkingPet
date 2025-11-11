import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Courses from './pages/Courses';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './pages/NotFound';

import MyCourses from './pages/MyCourses';
import OrderTrack from './pages/OrderTrack';

import Dashboard from './admin/Dashboard';
import AdminLogin from './admin/AdminLogin';
import { RequireAuth, RequireRole } from './components/RouteGuards';

export default function App() {
  const location = useLocation();
  const hideChrome = ['/login', '/registro', '/forgot', '/reset', '/admin/login'].includes(location.pathname);

  return (
    <>
      {!hideChrome && <Header />}
      <main className="main" id="main">
        <Routes>
          {/* públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/productos/:id" element={<ProductDetail />} />
          <Route path="/servicios" element={<Services />} />
          <Route path="/cursos" element={<Courses />} />
          

          {/* requieren sesión */}
          <Route path="/agendar" element={<RequireAuth><Booking /></RequireAuth>} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/mis-cursos" element={<RequireAuth><MyCourses /></RequireAuth>} />
          <Route path="/pedidos/:id/track" element={<RequireAuth><OrderTrack /></RequireAuth>} />
          <Route path="/pedidos/:id/track" element={<RequireAuth><OrderTrack /></RequireAuth>} />


          {/* carrito no obliga login */}
          <Route path="/carrito" element={<Cart />} />

          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<RequireRole role="admin"><Dashboard /></RequireRole>} />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}
