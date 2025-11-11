// src/pages/Booking.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Booking() {
    // Para mantener el mismo mínimo de fecha que tenías, podrías fijarlo.
    // Si prefieres que sea "hoy" dinámico, reemplaza el min por getToday().
    const minDate = '2025-10-25';
    const minTime = '08:00';
    const maxTime = '20:00';

    const onSubmit = (e) => {
        e.preventDefault();
        // Por ahora estático: aquí podrías disparar un toast o redirigir
        // cuando conectes con el backend /api/bookings.
    };

    return (
        <>
            <SEO
                title="Agendar Servicio - TalkingPet"
                description="Reserva baño completo, peluquería canina, atención veterinaria o adiestramiento para tu mascota en Santa Cruz, Bolivia."
                url="http://localhost:5173/agendar"
            />

            {/* Breadcrumb */}
            <div className="breadcrumb-wrapper">
                <div className="container">
                    <nav className="breadcrumb" aria-label="Ruta de navegación">
                        <Link to="/" className="breadcrumb__link">Inicio</Link>
                        <span className="breadcrumb__separator">/</span>
                        <Link to="/servicios" className="breadcrumb__link">Servicios</Link>
                        <span className="breadcrumb__separator">/</span>
                        <span className="breadcrumb__current">Agendar Servicio</span>
                    </nav>
                </div>
            </div>

            {/* Contenido principal */}
            <main className="main" role="main">
                <section className="booking-section">
                    <div className="container">
                        <div className="booking-layout">
                            {/* Formulario */}
                            <div className="booking-form-wrapper">
                                <h1 className="booking-form__title">Agendar Servicio</h1>
                                <p className="booking-form__subtitle">
                                    Completa el formulario y nos pondremos en contacto para confirmar tu reserva.
                                </p>

                                <form className="booking-form" onSubmit={onSubmit}>
                                    <fieldset className="form-fieldset">
                                        <legend className="form-fieldset__legend">Información del Servicio</legend>

                                        <div className="form-group">
                                            <label htmlFor="servicio" className="form-label">Servicio *</label>
                                            <select id="servicio" name="servicio" className="form-input form-input--select" required>
                                                <option value="">Selecciona un servicio</option>
                                                <option value="baño">Baño Completo - Bs. 80</option>
                                                <option value="peluqueria">Peluquería Canina - Bs. 120</option>
                                                <option value="veterinaria">Atención Veterinaria - Bs. 150</option>
                                                <option value="adiestramiento">Adiestramiento - Bs. 200</option>
                                            </select>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="fecha" className="form-label">Fecha *</label>
                                                <input
                                                    type="date"
                                                    id="fecha"
                                                    name="fecha"
                                                    className="form-input"
                                                    required
                                                    min={minDate}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="hora" className="form-label">Hora *</label>
                                                <input
                                                    type="time"
                                                    id="hora"
                                                    name="hora"
                                                    className="form-input"
                                                    required
                                                    min={minTime}
                                                    max={maxTime}
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="form-fieldset">
                                        <legend className="form-fieldset__legend">Información de Contacto</legend>

                                        <div className="form-group">
                                            <label htmlFor="nombre" className="form-label">Nombre completo *</label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                name="nombre"
                                                className="form-input"
                                                placeholder="Tu nombre completo"
                                                required
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="telefono" className="form-label">Teléfono *</label>
                                                <input
                                                    type="tel"
                                                    id="telefono"
                                                    name="telefono"
                                                    className="form-input"
                                                    placeholder="+591 12345678"
                                                    required
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email" className="form-label">Email *</label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    className="form-input"
                                                    placeholder="tu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="form-actions">
                                        <button type="submit" className="btn btn--accent btn--lg btn--full">✓ Confirmar Reserva</button>
                                        <Link to="/servicios" className="btn btn--outline-primary btn--lg btn--full">← Volver</Link>
                                    </div>
                                </form>
                            </div>

                            {/* Sidebar */}
                            <aside className="booking-sidebar">
                                <div className="info-box">
                                    <h3 className="info-box__title">📋 Información Importante</h3>
                                    <ul className="info-box__list">
                                        <li>Recibirás una confirmación por email y WhatsApp</li>
                                        <li>Horario de 8:00 AM a 8:00 PM</li>
                                        <li>Puedes reagendar con 24h de anticipación</li>
                                    </ul>
                                </div>

                                <div className="info-box info-box--highlight">
                                    <h3 className="info-box__title">💳 Métodos de Pago</h3>
                                    <ul className="info-box__list">
                                        <li>Efectivo</li>
                                        <li>Transferencia / QR</li>
                                        <li>Tarjetas de débito/crédito</li>
                                    </ul>
                                </div>
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
