// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency } from '../../utils/format';
import '../../styles/admin-dashboard.css';


export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({
    totals: {
      users: 0,
      clients: 0,
      employees: 0,
      admins: 0,
      products: 0,
      services: 0,
      courses: 0,
      orders: 0,
      bookings: 0,
    },
    latestOrders: [],
    latestBookings: [],
  });

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Pedimos todo en paralelo
        const [
          usersRes,
          productsRes,
          servicesRes,
          coursesRes,
          ordersRes,
          bookingsRes,
        ] = await Promise.all([
          api.get('/api/users'),
          api.get('/api/products'),
          api.get('/api/services'),
          api.get('/api/courses'),
          api.get('/api/orders'),       // lista de pedidos (admin)
          api.get('/api/bookings/all'), // lista de citas (admin/empleado)
        ]);

        if (!mounted) return;

        // 👇 Normalizamos respuestas dependiendo del shape del backend
        const usersData = usersRes.data;
        const usersRaw = Array.isArray(usersData)
          ? usersData
          : usersData?.items || [];

        const productsData = productsRes.data;
        const products = Array.isArray(productsData)
          ? productsData
          : productsData?.items || [];

        const services = servicesRes.data || [];
        const courses = coursesRes.data || [];
        const orders = ordersRes.data || [];
        const bookings = bookingsRes.data || [];

        // Cálculos por rol
        const clientsCount = usersRaw.filter((u) => u.rol === 'cliente').length;
        const adminsCount = usersRaw.filter((u) => u.rol === 'admin').length;
        const employeesCount = usersRaw.filter(
          (u) => u.rol && u.rol.startsWith('empleado_')
        ).length;

        setSummary({
          totals: {
            users: usersRaw.length,
            clients: clientsCount,
            employees: employeesCount,
            admins: adminsCount,
            products: products.length,
            services: services.length,
            courses: courses.length,
            orders: orders.length,
            bookings: bookings.length,
          },
          latestOrders: orders.slice(0, 5),
          latestBookings: bookings.slice(0, 5),
        });
      } catch (e) {
        console.error('Error cargando dashboard admin', e);
        setError('No se pudo cargar el resumen. Intenta nuevamente.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const { totals, latestOrders, latestBookings } = summary;

  return (
    <div className="admin-main">
      <header className="admin-main__header">
        <h1 className="admin-main__title">Dashboard</h1>
        <p className="admin-main__subtitle">
          Resumen general de TalkingPet.
        </p>
      </header>

      {loading && (
        <div className="admin-dashboard__loading">
          Cargando resumen...
        </div>
      )}

      {error && !loading && (
        <div className="admin-dashboard__error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="admin-dashboard">
          {/* KPIs principales */}
          <section className="admin-kpi-grid">
            {/* Clientes */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Clientes</p>
              <p className="admin-kpi-value">{totals.clients}</p>
              <p className="admin-kpi-sub">
                Clientes registrados en la plataforma
              </p>
            </article>

            {/* Empleados */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Empleados</p>
              <p className="admin-kpi-value">{totals.employees}</p>
              <p className="admin-kpi-sub">
                Usuarios con rol de empleado
              </p>
            </article>

            {/* Administradores */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Administradores</p>
              <p className="admin-kpi-value">{totals.admins}</p>
              <p className="admin-kpi-sub">
                Cuentas con acceso al panel admin
              </p>
            </article>

            {/* Productos */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Productos activos</p>
              <p className="admin-kpi-value">{totals.products}</p>
              <p className="admin-kpi-sub">En catálogo de la tienda</p>
            </article>

            {/* Servicios */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Servicios</p>
              <p className="admin-kpi-value">{totals.services}</p>
              <p className="admin-kpi-sub">
                Baños, peluquería, vet, adiestramiento
              </p>
            </article>

            {/* Cursos */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Cursos</p>
              <p className="admin-kpi-value">{totals.courses}</p>
              <p className="admin-kpi-sub">
                Cursos virtuales / talleres
              </p>
            </article>

            {/* Pedidos */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Pedidos</p>
              <p className="admin-kpi-value">{totals.orders}</p>
              <p className="admin-kpi-sub">
                Pedidos registrados en el sistema
              </p>
            </article>

            {/* Citas */}
            <article className="admin-kpi-card">
              <p className="admin-kpi-label">Citas</p>
              <p className="admin-kpi-value">{totals.bookings}</p>
              <p className="admin-kpi-sub">
                Citas agendadas en total
              </p>
            </article>
          </section>

          {/* Listas: pedidos y citas */}
          <section className="admin-dashboard__grid">
            <article className="admin-panel">
              <header className="admin-panel__header">
                <h2 className="admin-panel__title">Últimos pedidos</h2>
                <p className="admin-panel__subtitle">
                  Pedidos más recientes.
                </p>
              </header>

              {latestOrders.length === 0 ? (
                <p className="admin-panel__empty">
                  Aún no hay pedidos registrados.
                </p>
              ) : (
                <ul className="admin-panel__list">
                  {latestOrders.map((order) => (
                    <li key={order.id} className="admin-panel__list-item">
                      <div>
                        <p className="admin-panel__list-primary">
                          Pedido #{order.id} ·{' '}
                          {formatCurrency(Number(order.total || 0))}
                        </p>
                        <p className="admin-panel__list-secondary">
                          Estado: {order.estado} ·{' '}
                          {order.fecha_pedido
                            ? new Date(order.fecha_pedido).toLocaleString()
                            : 'Sin fecha'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="admin-panel">
              <header className="admin-panel__header">
                <h2 className="admin-panel__title">Citas recientes</h2>
                <p className="admin-panel__subtitle">
                  Últimas citas agendadas.
                </p>
              </header>

              {latestBookings.length === 0 ? (
                <p className="admin-panel__empty">
                  Aún no hay citas registradas.
                </p>
              ) : (
                <ul className="admin-panel__list">
                  {latestBookings.map((b) => (
                    <li key={b.id} className="admin-panel__list-item">
                      <div>
                        <p className="admin-panel__list-primary">
                          {b.servicio_nombre || 'Servicio'} ·{' '}
                          {b.mascota_nombre || 'Mascota'}
                        </p>
                        <p className="admin-panel__list-secondary">
                          {b.fecha}{' '}
                          {b.hora?.slice(0, 5)} · Estado: {b.estado}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </div>
      )}
    </div>
  );
}
