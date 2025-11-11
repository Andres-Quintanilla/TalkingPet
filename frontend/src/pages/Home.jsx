// src/pages/Home.jsx
import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
    const [destacados, setDestacados] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                // Si tu backend soporta filtros, puedes usar ?limit=4
                const { data } = await api.get('/api/products?page=1&limit=4');
                // data.items si tu paginación responde así; si responde array directo, ajusta:
                setDestacados(Array.isArray(data.items) ? data.items : data.slice(0, 4));
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (
        <>
            <SEO
                title="Bienvenido a TalkingPet - Todo para tu Mascota"
                description="Encuentra todo lo que necesitas para la felicidad y salud de tu mascota. Productos de calidad, servicios profesionales y el mejor trato."
                url="http://localhost:5173/"
            />

            {/* HERO */}
            <section className="hero">
                <div className="hero__content container">
                    <h1 className="hero__title">El mejor cuidado para tu mejor amigo</h1>
                    <p className="hero__subtitle">
                        Encuentra todo lo que necesitas para la felicidad y salud de tu mascota.
                        Productos de calidad, servicios profesionales y el mejor trato.
                    </p>
                    <div className="hero__actions">
                        <Link to="/productos" className="btn btn--primary btn--lg">Ver Productos</Link>
                        <Link to="/servicios" className="btn btn--accent btn--lg">Agendar Servicio</Link>
                    </div>
                </div>
            </section>

            {/* PRODUCTOS DESTACADOS (dinámicos) */}
            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title">Productos Destacados</h2>

                    {!destacados.length ? (
                        <p>Cargando productos…</p>
                    ) : (
                        <div className="featured-grid">
                            {destacados.map(p => <ProductCard key={p.id} p={p} />)}
                        </div>
                    )}
                </div>
            </section>



            {/* SERVICIOS */}
            <section className="featured-section" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Nuestros Servicios</h2>
                    <div className="featured-grid">
                        <article className="service-card">
                            <div className="service-card__icon" aria-hidden>🛁</div>
                            <h3 className="service-card__title">Baño Completo</h3>
                            <p className="service-card__description">
                                Un baño refrescante con productos de alta calidad para tu mascota.
                            </p>
                            <Link to="/servicios" className="btn btn--outline-primary btn--sm">Ver más</Link>
                        </article>

                        <article className="service-card">
                            <div className="service-card__icon" aria-hidden>✂️</div>
                            <h3 className="service-card__title">Peluquería Canina</h3>
                            <p className="service-card__description">
                                Cortes de raza y estilismo profesional para que tu perro luzca genial.
                            </p>
                            <Link to="/servicios" className="btn btn--outline-primary btn--sm">Ver más</Link>
                        </article>

                        <article className="service-card">
                            <div className="service-card__icon" aria-hidden>⚕️</div>
                            <h3 className="service-card__title">Atención Veterinaria</h3>
                            <p className="service-card__description">
                                Consultas, vacunas y chequeos generales con nuestros expertos.
                            </p>
                            <Link to="/servicios" className="btn btn--outline-primary btn--sm">Ver más</Link>
                        </article>

                        <article className="service-card">
                            <div className="service-card__icon" aria-hidden>🎓</div>
                            <h3 className="service-card__title">Adiestramiento</h3>
                            <p className="service-card__description">
                                Clases de obediencia para fortalecer el vínculo con tu mascota.
                            </p>
                            <Link to="/servicios" className="btn btn--outline-primary btn--sm">Ver más</Link>
                        </article>
                    </div>
                </div>
            </section>

            {/* CURSOS */}
            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title">Próximos Cursos</h2>
                    <div className="courses-preview-grid">
                        <article className="course-card">
                            <div className="course-card__icon" aria-hidden>🐾</div>
                            <h3 className="course-card__title">Adiestramiento Básico</h3>
                            <p className="course-card__description">
                                Aprende las técnicas para educar a tu cachorro y fortalecer su vínculo.
                            </p>
                            <Link to="/cursos" className="btn btn--accent">Más Información</Link>
                        </article>

                        <article className="course-card">
                            <div className="course-card__icon" aria-hidden>❤️</div>
                            <h3 className="course-card__title">Primeros Auxilios</h3>
                            <p className="course-card__description">
                                Conoce cómo reaccionar ante emergencias comunes en mascotas.
                            </p>
                            <Link to="/cursos" className="btn btn--accent">Más Información</Link>
                        </article>

                        <article className="course-card">
                            <div className="course-card__icon" aria-hidden>🦴</div>
                            <h3 className="course-card__title">Nutrición Canina</h3>
                            <p className="course-card__description">
                                Descubre los secretos de una dieta balanceada para un perro sano.
                            </p>
                            <Link to="/cursos" className="btn btn--accent">Más Información</Link>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
