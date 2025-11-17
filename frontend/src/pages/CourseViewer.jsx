// src/pages/CourseViewer.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, CheckSquare } from 'lucide-react';
// Instala: npm install react-player
import ReactPlayer from 'react-player'; // <-- CORRECCIÓN: Se quita el '/youtube'

export default function CourseViewer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContent, setActiveContent] = useState(null);

  useEffect(() => {
    const fetchCurso = async () => {
      if (!user) {
        navigate('/login', { state: { returnTo: `/cursos/${id}` } });
        return;
      }
      try {
        setLoading(true);

        // 1. Verificar si estoy inscrito
        const { data: misCursos } = await api.get('/api/courses/mine');
        if (!misCursos.some((c) => c.curso_id === Number(id))) {
          setError('No estás inscrito en este curso.');
          setLoading(false);
          return;
        }

        // 2. Cargar datos del curso y contenido
        const { data: cursoData } = await api.get(`/api/courses/${id}`);
        setCurso(cursoData);

        // 3. Poner el primer video como activo
        if (cursoData.contenido && cursoData.contenido.length > 0) {
          setActiveContent(cursoData.contenido[0]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching curso:', err);
        setError('No se pudo cargar el curso.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurso();
  }, [id, user, navigate]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Cargando tu curso...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <h2>Acceso Denegado</h2>
        <p>{error}</p>
        <Link to="/cursos" className="btn btn--primary">
          Ver Cursos
        </Link>
      </div>
    );
  }

  if (!curso) return null;

  return (
    <>
      <SEO
        title={`Viendo: ${curso.titulo}`}
        description="Plataforma de estudio TalkingPet"
        noIndex={true} // No queremos indexar la página de visualización
      />

      <div className="course-viewer-layout">
        {/* Sidebar de contenido */}
        <aside className="course-viewer-sidebar">
          <h2 className="course-viewer-sidebar__title">{curso.titulo}</h2>
          <div className="course-content-list">
            {curso.contenido.map((item) => (
              <button
                key={item.id}
                className={`course-content-item ${
                  activeContent?.id === item.id
                    ? 'course-content-item--active'
                    : ''
                }`}
                onClick={() => setActiveContent(item)}
              >
                <div className="course-content-item__icon">
                  {item.tipo === 'video' ? (
                    <PlayCircle size={20} />
                  ) : (
                    <CheckSquare size={20} />
                  )}
                </div>
                <div className="course-content-item__title">
                  {item.titulo}
                </div>
                <div className="course-content-item__duration">
                  {item.duracion_minutos} min
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Contenido principal (Video) */}
        <main className="course-viewer-main">
          {activeContent ? (
            <>
              <h1 className="course-viewer-main__title">
                {activeContent.titulo}
              </h1>
              {activeContent.tipo === 'video' ? (
                <div className="video-player-wrapper">
                  <ReactPlayer
                    url={activeContent.url}
                    className="react-player"
                    controls
                    width="100%"
                    height="100%"
                    // --- AÑADIDO: Configuración para YouTube ---
                    config={{
                      youtube: {
                        playerVars: { showinfo: 1 },
                      },
                    }}
                    // -----------------------------------------
                  />
                </div>
              ) : (
                <div className="video-player-wrapper-placeholder">
                  <p>Contenido tipo "{activeContent.tipo}" (ej. PDF).</p>
                </div>
              )}

              <div className="course-viewer-main__description">
                <p>Descripción del video o material (aún no en BD).</p>
              </div>
            </>
          ) : (
            <div className="video-player-wrapper-placeholder">
              <h2>Selecciona un capítulo</h2>
              <p>Elige un video de la lista para comenzar a aprender.</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}