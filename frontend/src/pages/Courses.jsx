// src/pages/Courses.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import { formatCurrency } from '../utils/format';

// Iconos para cursos (basado en tu data estática)
const courseIcons = {
  presencial: '🐾',
  virtual: '💻',
};

export default function Courses() {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/courses');
        setCursos(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCursos();
  }, []);

  return (
    <>
      <SEO
        title="Cursos - TalkingPet"
        description="Cursos para dueños de mascotas: adiestramiento básico, primeros auxilios, nutrición canina y bienestar felino en Santa Cruz, Bolivia."
        url="http://localhost:5173/cursos"
      />

      <main className="main" role="main">
        <section className="page-header">
          <div className="container">
            <h1 className="page-header__title">Cursos de Capacitación</h1>
            <p className="page-header__subtitle">
              Aprende a cuidar, entender y fortalecer el vínculo con tu mascota.
            </p>
          </div>
        </section>

        <section className="courses-page">
          <div className="container">
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Cargando cursos...</p>
              </div>
            )}
            
            {!loading && cursos.length === 0 && (
              <div className="empty-state">
                <p>No hay cursos disponibles en este momento.</p>
              </div>
            )}

            <div className="courses-grid">
              {!loading &&
                cursos.map((c) => (
                  <article key={c.id} className="course-card">
                    <div className="course-card__icon" aria-hidden="true">
                      {courseIcons[c.modalidad] || '🎓'}
                    </div>
                    <h3 className="course-card__title">{c.titulo}</h3>
                    <p className="course-card__description">{c.descripcion}</p>
                    <ul className="course-card__details">
                      <li>
                        <strong>Modalidad:</strong>{' '}
                        <span className={`badge ${
                          c.modalidad === 'presencial' ? 'badge--accent' : 'badge--primary'
                        }`}>
                          {c.modalidad}
                        </span>
                      </li>
                      <li>
                        <strong>Costo:</strong> {formatCurrency(c.precio)}
                      </li>
                       {c.modalidad === 'presencial' && c.cupos_totales && (
                         <li>
                           <strong>Cupos:</strong> {c.cupos_totales}
                         </li>
                       )}
                    </ul>
                    {/* El Link ahora lleva al detalle del curso */}
                    <Link to={`/cursos/${c.id}`} className="btn btn--primary">
                      Ver Detalles
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