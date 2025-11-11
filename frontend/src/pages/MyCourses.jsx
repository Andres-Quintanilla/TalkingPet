import { useEffect, useState } from 'react';
import SEO from '../components/SEO';
import api from '../api/axios';

export default function MyCourses() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await api.get('/api/courses/mine');
            setItems(data);
        })();
    }, []);

    return (
        <>
            <SEO title="Mis cursos" description="Tus cursos comprados" url="http://localhost:5173/mis-cursos" />
            <section className="container">
                <h1 className="section-title">Mis cursos</h1>
                <div className="courses-grid">
                    {items.map(c => (
                        <article key={c.id} className="course-card">
                            <div className="course-card__icon" aria-hidden>🎓</div>
                            <h3 className="course-card__title">{c.titulo}</h3>
                            <p>Progreso: {c.progreso}%</p>
                        </article>
                    ))}
                    {!items.length && <p>No tienes cursos aún.</p>}
                </div>
            </section>
        </>
    );
}
