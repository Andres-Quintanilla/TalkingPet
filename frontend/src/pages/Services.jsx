// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function Services() {
    const servicios = [
        {
            icon: '🛁',
            title: 'Baño Completo',
            description: 'Un baño refrescante con productos de alta calidad para dejar a tu mascota limpia y feliz.',
            price: 'Desde Bs. 80',
            to: '/agendar',
        },
        {
            icon: '✂️',
            title: 'Peluquería Canina',
            description: 'Cortes de raza y estilismo profesional para que tu perro luzca su mejor aspecto.',
            price: 'Desde Bs. 120',
            to: '/agendar',
        },
        {
            icon: '⚕️',
            title: 'Atención Veterinaria',
            description: 'Consultas, vacunas y chequeos generales con nuestros veterinarios expertos.',
            price: 'Desde Bs. 150',
            to: '/agendar',
        },
        {
            icon: '🎓',
            title: 'Adiestramiento',
            description: 'Clases de obediencia y comportamiento para fortalecer el vínculo con tu mascota.',
            price: 'Desde Bs. 200',
            to: '/agendar',
        },
    ];

    return (
        <>
            <SEO
                title="Nuestros Servicios - TalkingPet"
                description="Servicios profesionales para mascotas: baño, peluquería, veterinaria y adiestramiento en Santa Cruz, Bolivia."
                url="http://localhost:5173/servicios"
            />

            <main className="main" role="main">
                <section className="services-page">
                    <div className="container">
                        <h1 className="section-title">Nuestros Servicios Profesionales</h1>

                        <div className="featured-grid">
                            {servicios.map((s, i) => (
                                <article key={i} className="service-card">
                                    <div className="service-card__icon" aria-hidden="true">
                                        {s.icon}
                                    </div>
                                    <h3 className="service-card__title">{s.title}</h3>
                                    <p className="service-card__description">{s.description}</p>
                                    <p className="service-card__price">{s.price}</p>
                                    <Link to={s.to} className="btn btn--primary">
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
