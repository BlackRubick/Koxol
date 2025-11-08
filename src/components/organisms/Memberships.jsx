// Organism: Membresías K'oxol (pricing cards premium)
import React, { useState } from 'react';
import BillingToggle from '../atoms/BillingToggle';
import MembershipCard from '../molecules/MembershipCard';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { setJSON } from '../../utils/storage';
import { showAlert, showError, showSuccess } from '../../utils/swal';
import './Memberships.css';

const memberships = [
  {
    name: 'Plan Básico',
    price: 49,
    priceYear: 499,
    benefits: [
      '10% de descuento en todos los productos',
      'Acceso a lanzamientos exclusivos',
      'Atención prioritaria'
    ],
    accent: '#7FB069',
    featured: false
  },
  {
    name: 'Natural Plus',
    price: 89,
    priceYear: 899,
    benefits: [
      '20% de descuento en todos los productos',
      'Envío gratis en compras mayores a $499',
      'Regalo de bienvenida',
      'Acceso a lanzamientos exclusivos',
      'Atención prioritaria'
    ],
    accent: '#2D5016',
    featured: true
  },
  {
    name: 'K’oxol Pro',
    price: 149,
    priceYear: 1499,
    benefits: [
      '30% de descuento en todos los productos',
      'Envío gratis siempre',
      'Regalo de bienvenida premium',
      'Acceso a eventos y lanzamientos VIP',
      'Atención prioritaria',
      'Acceso a productos edición limitada'
    ],
    accent: '#D4A574',
    featured: false
  }
];

const Memberships = () => {
  const [yearly, setYearly] = useState(false);
  const [selected, setSelected] = useState(memberships.find(m => m.featured)?.name || memberships[0].name);
  const { addToCart } = useCart();
  const auth = useAuth();
  const navigate = useNavigate();

  const handleAddMembership = (m) => {
    // Si el usuario no está logueado, llevar al login/registro
    if (!auth?.isLoggedIn) {
      // Guardar la membresía pendiente para añadirla automáticamente después del login
      const pending = {
        id: `membership-${m.name.replace(/\s+/g, '-').toLowerCase()}-${yearly ? 'year' : 'month'}`,
        name: `${m.name} (${yearly ? 'Anual' : 'Mensual'}) - Membresía K'oxol`,
        price: yearly ? m.priceYear : m.price,
        originalPrice: yearly ? m.priceYear : m.price,
        image: null,
        quantity: 1,
        isMembership: true,
        billing: yearly ? 'yearly' : 'monthly'
      };
  setJSON('pendingMembership', pending);
  showAlert('Inicia sesión', 'Debes iniciar sesión o registrarte para adquirir una membresía. Te llevaré al login y la añadiré al carrito después de iniciar sesión.');
      navigate('/auth');
      return;
    }

    const id = `membership-${m.name.replace(/\s+/g, '-').toLowerCase()}-${yearly ? 'year' : 'month'}`;
    const product = {
      id,
      name: `${m.name} (${yearly ? 'Anual' : 'Mensual'}) - Membresía K'oxol`,
      price: yearly ? m.priceYear : m.price,
      originalPrice: yearly ? m.priceYear : m.price,
      image: null,
      quantity: 1,
      isMembership: true,
      billing: yearly ? 'yearly' : 'monthly'
    };
    addToCart(product);
  };
  return (
    <section className="koxol-memberships" id="membresias">
      <h2 className="koxol-memberships__title">Membresías K'oxol</h2>
      <BillingToggle yearly={yearly} onToggle={() => setYearly(y => !y)} />
      <div className="koxol-memberships__cards">
        {memberships.map(m => (
          <MembershipCard
            key={m.name}
            {...m}
            yearly={yearly}
            selected={selected === m.name}
            onSelect={() => setSelected(m.name)}
            onAdd={() => handleAddMembership(m)}
          />
        ))}
      </div>
    </section>
  );
};

export default Memberships;
