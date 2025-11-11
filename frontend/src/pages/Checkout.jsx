import SEO from '../components/SEO';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export default function Checkout() {
    const { items, totals } = useCart();

    const handlePay = async () => {
        const stripe = await stripePromise;
        // backend: POST /api/payments/create-session { items }
        const { data } = await api.post('/api/payments/create-session', { items });
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
    };

    return (
        <>
            <SEO title="Checkout" description="Paga con Stripe de forma segura." url="http://localhost:5173/checkout" />
            <section className="checkout-section">
                <div className="container checkout-layout">
                    <div className="checkout-form">
                        <fieldset className="form-fieldset">
                            <legend className="form-fieldset__legend">Información</legend>
                            <p>Total a pagar: <strong>Bs {totals.total.toFixed(2)}</strong></p>
                        </fieldset>
                        <button className="btn btn--primary btn--lg" onClick={handlePay}>Pagar con Stripe</button>
                    </div>
                    <aside className="checkout-summary">
                        <h3>Resumen</h3>
                        {items.map(i => (
                            <div key={i.id} className="summary-item">
                                <img className="summary-item__image" src={i.imagen_url || '/images/dog-food.svg'} alt={i.nombre} />
                                <div className="summary-item__details">
                                    <span className="summary-item__name">{i.nombre}</span>
                                    <span className="summary-item__price">x{i.qty}</span>
                                </div>
                            </div>
                        ))}
                    </aside>
                </div>
            </section>
        </>
    );
}
