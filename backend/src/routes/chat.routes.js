// src/routes/chat.routes.js
import { Router } from "express";
import * as chatCtrl from "../controllers/chat.controller.js";
import { saveFeedback } from "../services/feedback.service.js"; // <-- CORREGIDO
import { requireAuth } from '../middleware/auth.js';
import { optionalAuth } from "../middleware/optionalAuth.js"; // <-- NUEVO

const router = Router();

// POST /api/chat - Enviar mensaje al chatbot
// Usa 'optionalAuth' para permitir invitados pero identificar usuarios logueados
router.post("/", optionalAuth, chatCtrl.sendMessage);

// GET /api/chat/history/:sessionId - Obtener historial (no necesita auth)
router.get("/history/:sessionId", chatCtrl.getHistory);

// POST /api/chat/notify - Enviar notificación (requiere auth)
router.post("/notify", requireAuth, chatCtrl.sendNotification);

// POST /api/chat/feedback - Guardar feedback (no necesita auth)
router.post("/feedback", async (req, res) => {
  const { messageId, isUseful, comment } = req.body;
  if (messageId == null) {
     return res.status(400).json({ success: false, error: "messageId is required" });
  }
  const result = await saveFeedback(messageId, isUseful, comment); // <-- Ahora funciona
  res.json(result);
});

export default router;