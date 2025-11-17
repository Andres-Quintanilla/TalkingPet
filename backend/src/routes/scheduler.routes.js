// backend/src/routes/scheduler.routes.js
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/roles.js';
import {
  getSchedulerStatus,
  runAllReminders,
  runVaccineReminders,
  runBathReminders,
  runRestockReminders,
  runBirthdayReminders,
  runAppointmentReminders,
  cleanOldNotifications
} from '../controllers/scheduler.controller.js';

const router = Router();

// Todas las rutas requieren autenticación y rol admin
router.use(requireAuth, isAdmin);

// GET /api/scheduler/status - Estado del scheduler
router.get('/status', getSchedulerStatus);

// POST /api/scheduler/run - Ejecutar todos los recordatorios manualmente
router.post('/run', runAllReminders);

// POST /api/scheduler/run/vaccines - Solo recordatorios de vacunas
router.post('/run/vaccines', runVaccineReminders);

// POST /api/scheduler/run/bath - Solo recordatorios de baño
router.post('/run/bath', runBathReminders);

// POST /api/scheduler/run/restock - Solo recordatorios de restock
router.post('/run/restock', runRestockReminders);

// POST /api/scheduler/run/birthdays - Solo cumpleaños
router.post('/run/birthdays', runBirthdayReminders);

// POST /api/scheduler/run/appointments - Solo citas
router.post('/run/appointments', runAppointmentReminders);

// DELETE /api/scheduler/clean - Limpiar logs antiguos
router.delete('/clean', cleanOldNotifications);

export default router;
