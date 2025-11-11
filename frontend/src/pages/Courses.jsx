// src/pages/Courses.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Courses() {
    const cursos = [
        {
            icon: '🐾',
            title: 'Adiestramiento Básico para Cachorros',
            description:
                'Aprende las técnicas fundamentales de obediencia, socialización y buenos modales para sentar una base sólida en la educación de tu cachorro.',
            details: [
                { k: 'Duración', v: '4 semanas' },
                { k: 'Modalidad', v: 'Presencial / Grupal' },
                { k: 'Costo', v: 'Bs. 400' },
            ],
        },
        {
            icon: '❤️',
            title: 'Primeros Auxilios para Mascotas',
            description:
                'Capacítate para actuar de manera rápida y efectiva en situaciones de emergencia, desde heridas leves hasta RCP para perros y gatos.',
            details: [
                { k: 'Duración', v: '1 día (intensivo)' },
                { k: 'Modalidad', v: 'Presencial / Teórico-Práctico' },
                { k: 'Costo', v: 'Bs. 250' },
            ],
        },
        {
            icon: '🦴',
            title: 'Fundamentos de Nutrición Canina',
            description:
                'Descubre los secretos para elegir la mejor dieta para tu perro según su edad, raza y nivel de actividad. Aprende a leer etiquetas y a preparar snacks saludables.',
            details: [
                { k: 'Duración', v: '2 semanas' },
                { k: 'Modalidad', v: 'Online' },
                { k: 'Costo', v: 'Bs. 300' },
            ],
        },
        {
            icon: '🐈',
            title: 'Comportamiento y Bienestar Felino',
            description:
                'Entiende el lenguaje corporal de tu gato, cómo enriquecer su ambiente y solucionar problemas comunes de comportamiento.',
            details: [
                { k: 'Duración', v: '3 semanas' },
                { k: 'Modalidad', v: 'Online' },
                { k: 'Costo', v: 'Bs. 350' },
            ],
        },
    ];

    return (
        <>
            <SEO
                title="Cursos - TalkingPet"
                description="Cursos para dueños de mascotas: adiestramiento básico, primeros auxilios, nutrición canina y bienestar felino en Santa Cruz, Bolivia."
                url="http://localhost:5173/cursos"
            />

            <main className="main" role="main">
                {/* Encabezado de página */}
                <section className="page-header">
                    <div className="container">
                        <h1 className="page-header__title">Cursos de Capacitación para Dueños</h1>
                        <p className="page-header__subtitle">
                            Aprende a cuidar, entender y fortalecer el vínculo con tu mascota.
                        </p>
                    </div>
                </section>

                {/* Listado de cursos */}
                <section className="courses-page">
                    <div className="container">
                        <div className="courses-grid">
                            {cursos.map((c, i) => (
                                <article key={i} className="course-card">
                                    <div className="course-card__icon" aria-hidden="true">
                                        {c.icon}
                                    </div>
                                    <h3 className="course-card__title">{c.title}</h3>
                                    <p className="course-card__description">{c.description}</p>
                                    <ul className="course-card__details">
                                        {c.details.map((d, idx) => (
                                            <li key={idx}>
                                                <strong>{d.k}:</strong> {d.v}
                                            </li>
                                        ))}
                                    </ul>
                                    {/* Mantengo el CTA como en tu HTML. Si luego quieres ruta real, cambia to="/cursos/inscripcion" */}
                                    <Link to="#" className="btn btn--primary">
                                        Inscribirme ahora
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
