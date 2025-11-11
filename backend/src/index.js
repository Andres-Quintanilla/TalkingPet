// backend/src/index.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import courseRoutes from "./routes/course.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import seoRoutes from "./routes/seo.routes.js";

import { seoHeaders, gzipCompression } from "./middleware/seo-headers.js";
import { notFound, errorHandler } from "./middleware/errors.js";

const app = express();
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// 1) Webhook Stripe: RAW primero (sin otros parsers ni normalizaciones)
app.use("/api/payments/stripe/webhook", express.raw({ type: "application/json" }));

// 2) Normalización de URL (excluye webhook y estáticos)
app.use((req, res, next) => {
  const p = req.path;
  if (
    p.startsWith("/api/payments/stripe/webhook") ||
    p.startsWith("/uploads") ||
    p.startsWith("/static")
  ) return next();

  const url = req.originalUrl;
  if (url.length > 1 && url.endsWith("/")) {
    return res.redirect(301, url.slice(0, -1));
  }
  // Para forzar minúsculas, descomenta:
  // if (/[A-Z]/.test(url)) return res.redirect(301, url.toLowerCase());
  next();
});

// 3) Seguridad / CORS / logging
app.use(helmet());
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(morgan("dev"));

// 4) Compresión + headers SEO (antes de rutas y estáticos)
app.use(gzipCompression);
app.use(seoHeaders());

// 5) Parsers (después de RAW del webhook)
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// 6) Archivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use("/static", express.static(path.join(__dirname, "..", "static"))); // opcional

// 7) Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes); // el webhook ya quedó arriba
app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/uploads", uploadRoutes);

// 8) SEO (robots.txt, sitemap.xml)
app.use("/", seoRoutes);

// 9) 404 + manejador de errores
app.use(notFound);
app.use(errorHandler);

// 10) Start
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
