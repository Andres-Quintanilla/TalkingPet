// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatCurrency } from '../utils/format';

// Iconos para cada tipo de servicio
const serviceIcons = {
  baño: '🛁',
  peluqueria: '✂️',
  veterinaria: '⚕️',
  adiestramiento: '🎓',
};

export default function Services() {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/services');
        setServicios(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServicios();
  }, []);

  return (
    <>
      <SEO
        title="Nuestros Servicios - TalkingPet"
        description="Servicios profesionales para mascotas: baño, peluqueria, veterinaria y adiestramiento en Santa Cruz, Bolivia."
        url="http://localhost:5173/servicios"
      />

      <main className="main" role="main">
        <section className="page-header">
          <div className="container">
            <h1 className="page-header__title">Nuestros Servicios Profesionales</h1>
            <p className="page-header__subtitle">
              Todo lo que necesitas para el bienestar de tu mascota, en un solo lugar.
            </p>
          </div>
        </section>

        <section className="services-page">
          <div className="container">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando servicios...</p>
              </div>
            )}

            {!loading && servicios.length === 0 && (
              <div className="empty-state">
                <p>No hay servicios disponibles en este momento.</p>
              </div>
            )}

            <div className="featured-grid">
              {!loading &&
                servicios.map((s) => (
                  <article key={s.id} className="service-card">
                    <div className="service-card__icon" aria-hidden="true">
                      {serviceIcons[s.tipo] || '🐾'}
                    </div>
                    <h3 className="service-card__title">{s.nombre}</h3>
                    <p className="service-card__description">{s.descripcion}</p>
                    <p className="service-card__price">
                      Desde {formatCurrency(s.precio_base)}
                    </p>
                    <Link
                      to="/agendar"
                      state={{ servicioId: s.id }} // Pre-selecciona el servicio
                      className="btn btn--primary"
                    >
                      Agendar Ahora
                    </Link>
                  </article>
                ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}