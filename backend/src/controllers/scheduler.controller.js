// backend/src/controllers/scheduler.controller.js
import { ejecutarManualmente, obtenerEstadoTareas } from '../services/scheduler.service.js';
import { 
  recordatoriosVacunas, 
  recordatoriosBano, 
  recordatoriosRestock,
  recordatoriosCumpleanos,
  recordatoriosCitas,
  limpiarNotificacionesAntiguas
} from '../services/automated-reminders.service.js';

/**
 * Obtener estado de todas las tareas programadas
 */
export async function getSchedulerStatus(req, res) {
  try {
    const tareas = obtenerEstadoTareas();
    
    res.json({
      success: true,
      data: {
        activo: true,
        totalTareas: tareas.length,
        tareas
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error obteniendo estado del scheduler',
      error: error.message
    });
  }
}

/**
 * Ejecutar manualmente todos los recordatorios (testing)
 */
export async function runAllReminders(req, res) {
  try {
    console.log('🔧 Ejecutando todos los recordatorios manualmente...');
    const resultados = await ejecutarManualmente();
    
    res.json({
      success: true,
      message: 'Recordatorios ejecutados correctamente',
      data: resultados
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error ejecutando recordatorios',
      error: error.message
    });
  }
}

/**
 * Ejecutar recordatorios de vacunas manualmente
 */
export async function runVaccineReminders(req, res) {
  try {
    const resultados = await recordatoriosVacunas();
    res.json({ success: true, data: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en recordatorios de vacunas',
      error: error.message
    });
  }
}

/**
 * Ejecutar recordatorios de baño manualmente
 */
export async function runBathReminders(req, res) {
  try {
    const resultados = await recordatoriosBano();
    res.json({ success: true, data: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en recordatorios de baño',
      error: error.message
    });
  }
}

/**
 * Ejecutar recordatorios de restock manualmente
 */
export async function runRestockReminders(req, res) {
  try {
    const resultados = await recordatoriosRestock();
    res.json({ success: true, data: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en recordatorios de restock',
      error: error.message
    });
  }
}

/**
 * Ejecutar recordatorios de cumpleaños manualmente
 */
export async function runBirthdayReminders(req, res) {
  try {
    const resultados = await recordatoriosCumpleanos();
    res.json({ success: true, data: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en recordatorios de cumpleaños',
      error: error.message
    });
  }
}

/**
 * Ejecutar recordatorios de citas manualmente
 */
export async function runAppointmentReminders(req, res) {
  try {
    const resultados = await recordatoriosCitas();
    res.json({ success: true, data: resultados });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en recordatorios de citas',
      error: error.message
    });
  }
}

/**
 * Limpiar notificaciones antiguas
 */
export async function cleanOldNotifications(req, res) {
  try {
    const eliminadas = await limpiarNotificacionesAntiguas();
    res.json({ 
      success: true, 
      message: `${eliminadas} notificaciones antiguas eliminadas`,
      data: { eliminadas }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error limpiando notificaciones',
      error: error.message
    });
  }
}
