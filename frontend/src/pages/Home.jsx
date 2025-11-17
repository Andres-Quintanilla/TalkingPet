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
                const { data } = await api.get('/api/products?page=1&limit=4');
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
                description="Encuentra todo lo que necesitas para tu mascota en un solo lugar: productos de calidad, servicios profesionales y el mejor trato."
                url="http://localhost:5173/"
            />

            <section className="hero">
                <div className="hero__content container">
                    <h1 className="hero__title">El mejor cuidado para tu mejor amigo</h1>
                    <p className="hero__subtitle">
                        Encuentra todo lo que necesitas para la felicidad y salud de tu mascota.
                    </p>
                    <div className="hero__actions">
                        <Link to="/productos" className="btn btn--primary btn--lg">
                            Ver Productos
                        </Link>
                        <Link to="/servicios" className="btn btn--outline-primary btn--lg">
                            Ver Servicios
                        </Link>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Productos Destacados</h2>
                    </div>

                    {destacados.length === 0 ? (
                        <p>No hay productos destacados disponibles en este momento.</p>
                    ) : (
                        <div className="featured-grid">
                            {destacados.map(p => <ProductCard key={p.id} p={p} />)}
                        </div>
                    )}
                </div>
            </section>

            <section className="featured-section" style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                <div className="container">
                    <h2 className="section-title">Nuestros Servicios</h2>
                    <div className="featured-grid">
                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    🛁
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Baño Completo</h3>
                                <p>
                                    Un baño refrescante con productos de alta calidad para tu mascota.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/agendar" className="btn btn--accent btn--sm">
                                        Agendar
                                    </Link>
                                    <Link to="/servicios" className="btn btn--outline-primary btn--sm">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    ✂️
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Peluquería Canina</h3>
                                <p>
                                    Cortes de raza y estilismo profesional para que tu perro luzca genial.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/agendar" className="btn btn--accent btn--sm">
                                        Agendar
                                    </Link>
                                    <Link to="/servicios" className="btn btn--outline-primary btn--sm">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    ⚕️
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Atención Veterinaria</h3>
                                <p>
                                    Consultas, vacunas y chequeos generales con nuestros expertos.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/agendar" className="btn btn--accent btn--sm">
                                        Agendar
                                    </Link>
                                    <Link to="/servicios" className="btn btn--outline-primary btn--sm">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    🎓
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Adiestramiento</h3>
                                <p>
                                    Clases de obediencia para fortalecer el vínculo con tu mascota.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/agendar" className="btn btn--accent btn--sm">
                                        Agendar
                                    </Link>
                                    <Link to="/servicios" className="btn btn--outline-primary btn--sm">
                                        Ver detalle
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title">Algunos Cursos</h2>
                    <div className="courses-preview-grid">
                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    🐾
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Adiestramiento Básico</h3>
                                <p>
                                    Aprende las técnicas para educar a tu cachorro y fortalecer su vínculo.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/cursos" className="btn btn--accent btn--sm">
                                        Inscribirse
                                    </Link>
                                    <Link to="/cursos" className="btn btn--outline-primary btn--sm">
                                        Más Información
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    ❤️
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Primeros Auxilios</h3>
                                <p>
                                    Conoce cómo reaccionar ante emergencias comunes en mascotas.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/cursos" className="btn btn--accent btn--sm">
                                        Inscribirse
                                    </Link>
                                    <Link to="/cursos" className="btn btn--outline-primary btn--sm">
                                        Más Información
                                    </Link>
                                </div>
                            </div>
                        </article>

                        <article className="product-card">
                            <div className="product-card__img-wrapper">
                                <div
                                    className="product-card__img"
                                    aria-hidden
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}
                                >
                                    🦴
                                </div>
                            </div>
                            <div className="product-card__body">
                                <h3 className="product-card__title">Nutrición Canina</h3>
                                <p>
                                    Descubre los secretos de una dieta balanceada para un perro sano.
                                </p>
                                <div className="product-card__actions">
                                    <Link to="/cursos" className="btn btn--accent btn--sm">
                                        Inscribirse
                                    </Link>
                                    <Link to="/cursos" className="btn btn--outline-primary btn--sm">
                                        Más Información
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </>
    );
}
