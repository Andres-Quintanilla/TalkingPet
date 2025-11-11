import { NavLink, Routes, Route, Navigate } from 'react-router-dom';

function Section({ title }) {
    return <div className="container"><h1 className="section-title">{title}</h1><p>CRUD aquí…</p></div>;
}

export default function Dashboard() {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2>TalkingPet Admin</h2>
                <nav>
                    <NavLink to="orders">Orders</NavLink>
                    <NavLink to="products">Products</NavLink>
                    <NavLink to="services">Services</NavLink>
                    <NavLink to="courses">Courses</NavLink>
                    <NavLink to="users">Users</NavLink>
                </nav>
            </aside>
            <main className="admin-main">
                <Routes>
                    <Route path="/" element={<Navigate to="orders" />} />
                    <Route path="orders" element={<Section title="Orders" />} />
                    <Route path="products" element={<Section title="Products" />} />
                    <Route path="services" element={<Section title="Services" />} />
                    <Route path="courses" element={<Section title="Courses" />} />
                    <Route path="users" element={<Section title="Users" />} />
                </Routes>
            </main>
        </div>
    );
}
