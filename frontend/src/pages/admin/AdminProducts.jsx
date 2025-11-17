// src/pages/admin/AdminProducts.jsx
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { formatCurrency } from '../../utils/format';

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  estado: 'borrador',      // 'borrador' | 'publicado'
  es_destacado: false,
  imagen_url: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // ---------- Cargar lista ----------
  const loadProducts = async () => {
    setLoading(true);
    setError('');
    try {
      // Usamos el mismo endpoint que el catálogo
      const res = await api.get('/api/products');
      const items = res.data?.items || res.data || [];
      setProducts(items);
    } catch (e) {
      console.error('Error cargando productos admin', e);
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ---------- Filtro simple por nombre ----------
  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return products;
    return products.filter(p =>
      (p.nombre || '').toLowerCase().includes(term)
    );
  }, [products, search]);

  // ---------- Handlers de formulario ----------
  const handleNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setFormError('');
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setForm({
      nombre: product.nombre ?? '',
      descripcion: product.descripcion ?? '',
      precio: product.precio ?? '',
      stock: product.stock ?? '',
      categoria: product.categoria ?? product.categoria_nombre ?? '',
      estado: product.estado ?? 'borrador',
      es_destacado: Boolean(product.es_destacado),
      imagen_url: product.imagen_url ?? '',
    });
    setEditingId(product.id);
    setFormError('');
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!form.nombre.trim()) {
      return 'El nombre es obligatorio.';
    }
    if (form.precio === '' || isNaN(Number(form.precio))) {
      return 'El precio debe ser un número.';
    }
    if (form.stock === '' || isNaN(Number(form.stock))) {
      return 'El stock debe ser un número.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validateForm();
    if (msg) {
      setFormError(msg);
      return;
    }

    setSaving(true);
    setFormError('');

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoria: form.categoria.trim() || null,
      estado: form.estado,
      es_destacado: !!form.es_destacado,
      imagen_url: form.imagen_url.trim() || null,
    };

    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, payload);
      } else {
        await api.post('/api/products', payload);
      }

      await loadProducts();
      handleCancel();
    } catch (e) {
      console.error('Error guardando producto', e);
      setFormError('No se pudo guardar el producto. Revisa los datos.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(
      `¿Seguro que deseas eliminar el producto "${product.nombre}"?`
    );
    if (!ok) return;

    try {
      await api.delete(`/api/products/${product.id}`);
      await loadProducts();
    } catch (e) {
      console.error('Error eliminando producto', e);
      alert('No se pudo eliminar el producto.');
    }
  };

  // ---------- Render ----------
  return (
    <div className="admin-main">
      {/* Header */}
      <header className="admin-main__header">
        <div>
          <h1 className="admin-main__title">Productos</h1>
          <p className="admin-main__subtitle">
            Gestión de productos de la tienda TalkingPet.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNew}
          >
            + Nuevo producto
          </button>
        </div>
      </header>

      {/* Mensajes de carga / error */}
      {loading && (
        <div className="admin-dashboard__loading">
          Cargando productos...
        </div>
      )}

      {error && !loading && (
        <div className="admin-dashboard__error">{error}</div>
      )}

      {/* Formulario de alta/edición */}
      {showForm && (
        <section
          className="admin-form"
          style={{ marginBottom: '2rem' }}
        >
          <fieldset className="form-fieldset">
            <legend className="form-fieldset__legend">
              {editingId ? 'Editar producto' : 'Nuevo producto'}
            </legend>

            {formError && (
              <p
                style={{
                  color: '#b00020',
                  marginBottom: '0.75rem',
                  fontSize: '0.9rem',
                }}
              >
                {formError}
              </p>
            )}

            <div className="form-grid">
              <div className="form-field">
                <label className="form-field__label" htmlFor="nombre">
                  Nombre *
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  className="form-field__input"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="precio">
                  Precio (Bs.) *
                </label>
                <input
                  id="precio"
                  name="precio"
                  type="number"
                  step="0.01"
                  className="form-field__input"
                  value={form.precio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="stock">
                  Stock *
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  className="form-field__input"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="categoria">
                  Categoría
                </label>
                <input
                  id="categoria"
                  name="categoria"
                  type="text"
                  className="form-field__input"
                  placeholder="Ej: juguetes, alimentación..."
                  value={form.categoria}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="estado">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  className="form-field__input"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="borrador">Borrador</option>
                  <option value="publicado">Publicado</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-field__label" htmlFor="imagen_url">
                  URL de imagen
                </label>
                <input
                  id="imagen_url"
                  name="imagen_url"
                  type="text"
                  className="form-field__input"
                  value={form.imagen_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-field" style={{ marginTop: '1.5rem' }}>
                <label className="form-field__label">
                  <input
                    type="checkbox"
                    name="es_destacado"
                    checked={form.es_destacado}
                    onChange={handleChange}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Producto destacado
                </label>
                <p className="form-field__help">
                  Se mostrará en secciones especiales de la tienda.
                </p>
              </div>
            </div>

            <div className="form-field">
              <label className="form-field__label" htmlFor="descripcion">
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-field__input"
                rows={3}
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? 'Guardando...'
                : editingId
                ? 'Guardar cambios'
                : 'Crear producto'}
            </button>
          </div>
        </section>
      )}

      {/* Tabla de productos */}
      {!loading && !error && (
        <section className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Destacado</th>
                <th style={{ width: '160px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--color-text-light)',
                        }}
                      >
                        {p.categoria_nombre || p.categoria || 'Sin categoría'}
                      </div>
                    </td>
                    <td>{formatCurrency(Number(p.precio || 0))}</td>
                    <td>{p.stock ?? '-'}</td>
                    <td>
                      {p.estado === 'publicado' ? 'Publicado' : 'Borrador'}
                    </td>
                    <td>{p.es_destacado ? 'Sí' : 'No'}</td>
                    <td>
                      <div className="actions">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEdit(p)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(p)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
