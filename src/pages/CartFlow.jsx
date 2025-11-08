import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Minus, Plus, Volume2, VolumeX } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PaymentModal from '../components/atoms/PaymentModal';
import { getJSON, setJSON } from '../utils/storage';
import { showAlert, showError, showSuccess, confirmDialog } from '../utils/swal';

const CartFlow = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    email: '',
    address: '',
    zipCode: '',
    houseNumber: '',
    reference: '',
    phone: ''
  });
  const auth = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef(null);
  const [paymentModalMethod, setPaymentModalMethod] = useState(null);
  const [showAwaitingPayment, setShowAwaitingPayment] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const couponInputRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().catch(error => {
        console.log('Autoplay bloqueado. El usuario debe interactuar primero.');
        setIsMuted(true);
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
    setShowPaymentOptions(false);
  };

  const handleBackToShipping = () => {
    setShowPaymentOptions(false);
  };

  const handleProceedToPayment = () => {
    console.log('🔍 Validando datos del formulario...');
    console.log('Datos actuales:', shippingData);
    
    if (!shippingData.fullName || !shippingData.address || !shippingData.zipCode || 
        !shippingData.houseNumber || !shippingData.phone) {
      showError('Datos incompletos', 'Por favor completa todos los campos requeridos');
      return;
    }
    
    if (shippingData.zipCode.length !== 5) {
      showError('Código postal inválido', 'El código postal debe tener 5 dígitos');
      return;
    }
    
    if (shippingData.phone.length !== 10) {
      showError('Teléfono inválido', 'El teléfono debe tener 10 dígitos');
      return;
    }
    
    console.log('✅ Validación exitosa! Cambiando a métodos de pago...');
    setShowPaymentOptions(true);
  };

  // Helper para emoji de membresía
    const getMembershipEmoji = (item) => {
      if (!item || !item.name) return '🎫';
      const n = item.name.toLowerCase();
      if (n.includes('básico') || n.includes('basico')) return '🌱';
      if (n.includes('natural plus') || (n.includes('natural') && n.includes('plus'))) return '👑';
      if (n.includes('pro') || n.includes('koxol pro') || n.includes("k'oxol")) return '💎';
      return '🎫';
    };

  const handleConfirmOrder = async (paymentMethod) => {
    console.log('=== CONFIRMANDO ORDEN ===');
    console.log('Datos de envío:', shippingData);
    console.log('Carrito:', cart);
    console.log('Total:', total);
    console.log('Método de pago:', paymentMethod);

    const order = {
      id: Date.now().toString(),
      items: cart,
      // normalize buyer fields to backend expected shape
      buyer: {
        name: shippingData.fullName,
        email: shippingData.email || '',
        address: `${shippingData.address} ${shippingData.houseNumber}`,
        phone: shippingData.phone
      },
      paymentMethod: paymentMethod || 'No especificado',
      status: 'pending',
      shippingCarrier: null,
      createdAt: new Date().toISOString(),
      total
    };

    try {
      const { createOrder } = await import('../api/orders');
      await createOrder(order);
    } catch (err) {
      console.error('Error guardando pedido desde CartFlow (API):', err);
    }

    setCart([]);
    setShowPaymentOptions(false);
    setShowCheckout(false);
    setShowAwaitingPayment(true);
    // Mostrar modal de espera unos segundos y luego redirigir al usuario a la tienda
    setTimeout(() => {
      setShowAwaitingPayment(false);
      navigate('/shop');
    }, 2500);
  };

  const updateQty = (id, delta) => {
    setCart(items =>
      items.map(item => {
        if (item.id === id) {
          const currentQty = item.qty || 1;
          const maxQty = item.available || 999;
          const newQty = Math.max(1, Math.min(maxQty, currentQty + delta));
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCart(items => items.filter(item => item.id !== id));
  };

  const validateCartItem = (item) => {
    if (!item || typeof item !== 'object') return false;
    if (!item.price || isNaN(parseFloat(item.price))) return false;
    if (!item.qty || isNaN(parseInt(item.qty))) return false;
    return true;
  };

  const subtotal = cart.reduce((sum, item) => {
    if (!validateCartItem(item)) {
      return sum;
    }
    const price = parseFloat(item.price);
    const qty = parseInt(item.qty);
    return sum + price * qty;
  }, 0);

  const nonMembershipSubtotal = cart.reduce((sum, item) => {
    if (!validateCartItem(item)) return sum;
    if (item.isMembership) return sum;
    const price = parseFloat(item.price);
    const qty = parseInt(item.qty);
    return sum + price * qty;
  }, 0);

  const originalTotal = cart.reduce((sum, item) => {
    if (!validateCartItem(item)) return sum;
    const originalPrice = parseFloat(item.originalPrice) || 0;
    const qty = parseInt(item.qty);
    return sum + originalPrice * qty;
  }, 0);

  const savings = originalTotal - subtotal;

  // Determine membership-based discounts / shipping
  const activeMemberships = (auth?.userData?.memberships || []).filter(m => m && m.active);
  const membershipDiscountPercent = activeMemberships.length ? Math.max(...activeMemberships.map(m => (m.benefits?.discountPercent || m.discountPercent || 0))) : 0;
  const membershipProvidesFreeShipping = activeMemberships.some(m => m.benefits?.freeShippingAlways || false);
  const membershipFreeShippingThreshold = activeMemberships.reduce((acc, m) => {
    const t = m.benefits?.freeShippingThreshold;
    if (t == null) return acc;
    return acc == null ? t : Math.min(acc, t);
  }, null);

  const shipping = membershipProvidesFreeShipping ? 0 : (nonMembershipSubtotal === 0 ? 0 : ((membershipFreeShippingThreshold != null ? nonMembershipSubtotal >= membershipFreeShippingThreshold : nonMembershipSubtotal >= 500) ? 0 : 50));
  const totalBeforeDiscount = subtotal + shipping;

  // Apply membership discount first, then coupon
  const membershipDiscountAmount = Math.round((totalBeforeDiscount * (membershipDiscountPercent || 0)) * 100) / 100;
  const afterMembership = totalBeforeDiscount - membershipDiscountAmount;
  const couponDiscountAmount = appliedCoupon ? Math.round((afterMembership * (appliedCoupon.discount || 0)) * 100) / 100 : 0;
  // total discount shown to user (membership + coupon)
  const discountAmount = Math.round(((membershipDiscountAmount || 0) + (couponDiscountAmount || 0)) * 100) / 100;
  const total = Math.round((afterMembership - couponDiscountAmount) * 100) / 100;

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (isMuted && audioRef.current.paused) {
        audioRef.current.play().catch(err => console.log('Error al reproducir:', err));
      }
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (audioRef.current.muted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
    setVolume(newVolume);
  };

  useEffect(() => {
    if (auth?.isLoggedIn && auth.userData) {
      setShippingData(prev => ({
        ...prev,
        fullName: prev.fullName || auth.userData.name || '',
        email: prev.email || auth.userData.email || ''
      }));
    }
  }, [auth?.isLoggedIn, auth?.userData]);

  const handleOpenCoupon = (e) => {
    e.preventDefault();
    const storedWelcome = getJSON('welcomeCoupon', null);
    const storedShare = getJSON('shareCoupon', null);
    if (storedWelcome && !storedWelcome.used) {
      setCouponCode(storedWelcome.code || '');
    } else if (storedShare && !storedShare.used) {
      setCouponCode(storedShare.code || '');
    }
    setShowCouponInput(true);
  };

  useEffect(() => {
    if (showCouponInput && couponInputRef.current) {
      couponInputRef.current.focus();
    }
  }, [showCouponInput]);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const storedWelcome = getJSON('welcomeCoupon', null);
    const storedShare = getJSON('shareCoupon', null);
    if (!couponCode) {
      showError('Cupón requerido', 'Ingresa un código de cupón');
      return;
    }
    const code = couponCode.trim().toUpperCase();

    if (storedWelcome && storedWelcome.code && code === storedWelcome.code.trim().toUpperCase()) {
  if (storedWelcome.used) { showError('Cupón inválido', 'Este cupón ya fue usado.'); return; }
  if (storedWelcome.expiresAt && new Date(storedWelcome.expiresAt) < new Date()) { showError('Cupón inválido', 'El cupón ha expirado'); return; }
  setAppliedCoupon(storedWelcome);
  setJSON('welcomeCoupon', { ...storedWelcome, used: true });
  showSuccess('Cupón aplicado', `Cupón aplicado: ${storedWelcome.code} - ${Math.round((storedWelcome.discount||storedWelcome.discountPercent||0)*100)}%`);
      setShowCouponInput(false);
      return;
    }

    if (storedShare && storedShare.code && code === storedShare.code.trim().toUpperCase()) {
  if (storedShare.used) { showError('Cupón inválido', 'Este cupón ya fue usado.'); return; }
  if (storedShare.expiresAt && new Date(storedShare.expiresAt) < new Date()) { showError('Cupón inválido', 'El cupón ha expirado'); return; }
      setAppliedCoupon(storedShare);
      setJSON('shareCoupon', { ...storedShare, used: true });
      showSuccess('Cupón aplicado', `Cupón aplicado: ${storedShare.code} - ${Math.round((storedShare.discount||storedShare.discountPercent||0)*100)}%`);
      setShowCouponInput(false);
      return;
    }

    showError('Cupón inválido', 'Código de cupón inválido');
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .cart-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #e8eef3 100%);
          min-height: 100vh;
          width: 100%;
          /* Permitir scroll principal si hace falta (fallback) */
          overflow-y: auto;
        }

        .header {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-bottom: 1px solid rgba(23, 108, 58, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.2rem 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: baseline;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .logo-koxol {
          font-size: 1.8rem;
          font-weight: 900;
          color: #176c3a;
          letter-spacing: -0.5px;
        }

        .logo-sub {
          font-size: 1rem;
          font-weight: 600;
          color: #169c7c;
        }

        .audio-controls {
          position: fixed;
          bottom: 40px;
          left: 30px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .volume-slider-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;
          opacity: 0;
          transform: translateY(10px);
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .audio-controls:hover .volume-slider-wrapper {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .volume-slider {
          width: 120px;
          cursor: pointer;
          transform: rotate(-90deg);
          -webkit-appearance: none;
          height: 6px;
          background: linear-gradient(to right, #176c3a 0%, #176c3a var(--volume-percent, 30%), #e0e0e0 var(--volume-percent, 30%), #e0e0e0 100%);
          border-radius: 3px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #176c3a;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #176c3a;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        .volume-percent {
          font-size: 12px;
          color: #666;
          font-weight: 600;
          margin-top: 35px;
        }

        .mute-button {
          width: 65px;
          height: 65px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          transition: all 0.3s ease;
          color: white;
        }

        .mute-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.5);
        }

        .mute-button.muted {
          background: linear-gradient(135deg, #999 0%, #888 100%);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }

        .await-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2500;
          animation: fadeIn 240ms ease;
        }

        .await-card {
          width: 520px;
          max-width: calc(100% - 40px);
          background: linear-gradient(145deg, #ffffff 0%, #f7fffb 100%);
          border-radius: 14px;
          box-shadow: 0 30px 90px rgba(11, 63, 34, 0.18);
          overflow: hidden;
          transform-origin: center;
          animation: popIn 320ms cubic-bezier(0.2, 1, 0.3, 1);
        }

        .await-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          background: linear-gradient(90deg, rgba(23,108,58,0.12), rgba(23,108,58,0.06));
        }

        .await-title {
          font-size: 18px;
          color: #12492a;
          font-weight: 800;
        }

        .await-close {
          background: transparent;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #12492a;
        }

        .await-content {
          padding: 22px;
        }

        .await-body {
          color: #2e5e44;
          line-height: 1.6;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .await-actions {
          display: flex;
          justify-content: flex-end;
        }

        @keyframes popIn {
          0% { transform: translateY(18px) scale(0.98); opacity: 0 }
          60% { transform: translateY(-6px) scale(1.01) }
          100% { transform: translateY(0) scale(1); opacity: 1 }
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        .main-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .back-button {
          background: white;
          color: #176c3a;
          padding: 12px 24px;
          border: 2px solid #176c3a;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(23, 108, 58, 0.1);
        }

        .back-button:hover {
          background: #176c3a;
          color: white;
          transform: translateX(-3px);
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.2);
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 1200px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
          
          .summary {
            position: static;
            order: -1;
            margin-bottom: 2rem;
            max-height: none;
            overflow: visible;
          }

          .cart-items {
            overflow: visible;
          }
        }

        .cart-items {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          animation: fadeInUp 0.5s ease;
          max-height: none;
          overflow: visible;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 1rem;
          padding-bottom: 0.8rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #176c3a;
        }

        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #333;
          flex: 1;
        }

        .full-badge {
          background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
          color: white;
          border-radius: 20px;
          padding: 4px 14px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .cart-item {
          display: grid;
          grid-template-columns: auto auto 1fr auto;
          gap: 16px;
          padding: 20px;
          background: linear-gradient(135deg, #fafbfc 0%, #f5f7fa 100%);
          border-radius: 12px;
          margin-bottom: 12px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .cart-item:hover {
          border-color: #176c3a;
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.1);
          transform: translateY(-2px);
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .membership-emoji {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          background: linear-gradient(135deg, #f7fff7 0%, #f0fff4 100%);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          color: #176c3a;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .item-name {
          font-size: 16px;
          font-weight: 600;
          color: #222;
          line-height: 1.4;
        }

        .remove-btn {
          background: none;
          color: #e63946;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          padding: 0;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          color: #d62828;
          text-decoration: underline;
        }

        .item-available {
          font-size: 13px;
          color: #777;
        }

        .item-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 6px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .qty-btn {
          background: #f0f0f0;
          color: #333;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          padding: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .qty-btn:hover:not(:disabled) {
          background: #176c3a;
          color: white;
          transform: scale(1.05);
        }

        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .qty-display {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          min-width: 35px;
          text-align: center;
        }

        .item-pricing {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
        }

        .item-discount {
          background: #fee;
          color: #e63946;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }

        .item-original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 13px;
        }

        .item-price {
          font-size: 20px;
          font-weight: 700;
          color: #176c3a;
        }

        .shipping-section {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        }

        .shipping-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .shipping-label {
          font-size: 15px;
          font-weight: 600;
          color: #333;
        }

        .progress-bar-container {
          background: #e8eef3;
          border-radius: 8px;
          height: 10px;
          width: 100%;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
        }

        .progress-bar {
          background: linear-gradient(90deg, #176c3a 0%, #1a8447 100%);
          height: 100%;
          border-radius: 8px;
          transition: width 0.5s ease;
          position: relative;
        }

        .progress-indicator {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(50%, -50%);
          width: 18px;
          height: 18px;
          background: #176c3a;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(23, 108, 58, 0.3);
        }

        .shipping-message {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
        }

        .link {
          color: #176c3a;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: border-color 0.2s ease;
        }

        .link:hover {
          border-bottom-color: #176c3a;
        }

        .summary {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
          padding: 2rem;
          position: sticky;
          top: 120px;
          animation: fadeInUp 0.5s ease 0.2s backwards;
          align-self: start;
          max-height: calc(100vh - 140px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .summary-title {
          font-size: 22px;
          font-weight: 800;
          color: #176c3a;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f0f0f0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f5;
        }

        .summary-label {
          color: #555;
          font-weight: 500;
        }

        .summary-value {
          color: #176c3a;
          font-weight: 700;
        }

        .summary-value-green {
          color: #28a745;
          font-weight: 700;
        }

        .coupon-section {
          margin: 1.5rem 0;
          text-align: center;
        }

        .coupon-link {
          color: #176c3a;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border-bottom: 2px dotted #176c3a;
          transition: all 0.2s ease;
        }

        .coupon-link:hover {
          color: #1a8447;
          border-bottom-style: solid;
        }

        .total-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f8fdf9 0%, #f0f8f3 100%);
          border-radius: 12px;
        }

        .total-label {
          font-size: 18px;
          font-weight: 800;
          color: #333;
        }

        .total-value {
          font-size: 26px;
          font-weight: 900;
          color: #176c3a;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
          color: white;
          padding: 16px 24px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 17px;
          font-weight: 700;
          margin-top: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.3);
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(23, 108, 58, 0.4);
        }

        .disclaimer-text {
          font-size: 12px;
          color: #999;
          margin-top: 1rem;
          text-align: center;
          line-height: 1.5;
        }

        .checkout-form {
          padding: 0;
        }

        .back-to-cart-btn {
          background: transparent;
          color: #176c3a;
          padding: 10px 0;
          border: none;
          cursor: pointer;
          font-size: 15px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 2rem;
          transition: all 0.2s ease;
        }

        .back-to-cart-btn:hover {
          gap: 12px;
          color: #1a8447;
        }

        .checkout-title {
          font-size: 32px;
          font-weight: 800;
          color: #176c3a;
          margin-bottom: 8px;
          line-height: 1.2;
        }

        .checkout-subtitle {
          font-size: 15px;
          color: #777;
          margin-bottom: 2.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          color: #333;
          margin-bottom: 8px;
        }

        .input,
        .textarea {
          width: 100%;
          padding: 14px 18px;
          font-size: 15px;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .input:focus,
        .textarea:focus {
          border-color: #176c3a;
          box-shadow: 0 0 0 4px rgba(23, 108, 58, 0.1);
        }

        .textarea {
          resize: vertical;
          min-height: 100px;
        }

        .confirm-btn {
          width: 100%;
          background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
          color: white;
          padding: 18px 24px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 17px;
          font-weight: 700;
          margin-top: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.3);
        }

        .confirm-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(23, 108, 58, 0.4);
        }

        .payment-options-container {
          padding: 0;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          margin-top: 2rem;
        }

        .payment-card {
          background: white;
          border: 2px solid #e8eef3;
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .payment-card:hover {
          border-color: #176c3a;
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.15);
          transform: translateX(4px);
        }

        .payment-icon {
          font-size: 36px;
          flex-shrink: 0;
        }

        .payment-info {
          flex: 1;
          text-align: left;
        }

        .payment-label {
          font-size: 16px;
          font-weight: 700;
          color: #333;
          display: block;
          margin-bottom: 4px;
        }

        .payment-subtext {
          font-size: 13px;
          color: #777;
          line-height: 1.4;
        }

        .pm-confirm {
          background: linear-gradient(135deg, #176c3a 0%, #1a8447 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(23, 108, 58, 0.3);
        }

        .pm-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(23, 108, 58, 0.4);
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 1rem;
          }

          .logo-koxol {
            font-size: 1.4rem;
          }

          .logo-sub {
            font-size: 0.85rem;
          }

          .main-wrapper {
            padding: 1rem;
          }

          .cart-items,
          .summary {
            padding: 1.5rem;
            max-height: none;
            overflow: visible;
            animation: fadeInUp 0.5s ease;
            /* Permitir scroll interno si el contenido es más alto que la ventana
               Esto evita que el formulario de envío quede fuera de pantalla sin posibilidad de scrollear */
            max-height: calc(100vh - 140px);
            overflow-y: auto;

          .cart-item {
            grid-template-columns: auto 1fr;
            gap: 12px;
          }

          .item-image,
          .membership-emoji {
            width: 60px;
            height: 60px;
            font-size: 28px;
          }

          .item-controls {
            grid-column: 1 / -1;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }

          .item-name {
            font-size: 14px;
          }

          .checkout-title {
            font-size: 24px;
          }

          .checkout-subtitle {
            font-size: 14px;
          }

          .form-group {
            margin-bottom: 1.2rem;
          }

          .label {
            font-size: 13px;
            margin-bottom: 6px;
          }

          .input,
          .textarea {
            padding: 12px 14px;
            font-size: 14px;
          }

          .back-button {
            padding: 10px 18px;
            font-size: 14px;
            margin-bottom: 1.5rem;
          }

          .back-to-cart-btn {
            font-size: 14px;
            margin-bottom: 1.5rem;
          }

          .summary-title {
            font-size: 20px;
          }

          .total-section {
            padding: 1.2rem;
          }

          .total-label {
            font-size: 16px;
          }

          .total-value {
            font-size: 22px;
          }

          .checkout-btn,
          .confirm-btn {
            padding: 14px 20px;
            font-size: 16px;
          }

          .payment-card {
            padding: 16px;
          }

          .payment-icon {
            font-size: 28px;
          }

          .payment-label {
            font-size: 15px;
          }

          .payment-subtext {
            font-size: 12px;
          }

          .audio-controls {
            bottom: 20px;
            left: 20px;
          }

          .mute-button {
            width: 55px;
            height: 55px;
          }

          .volume-slider {
            width: 100px;
          }

          .checkout-form,
          .payment-options-container {
            overflow: visible;
            min-height: auto;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            padding: 0.8rem;
          }

          .logo {
            gap: 6px;
          }

          .logo-koxol {
            font-size: 1.2rem;
          }

          .logo-sub {
            font-size: 0.75rem;
          }

          .main-wrapper {
            padding: 0.8rem;
          }

          .cart-items,
          .summary {
            padding: 1.2rem;
          }

          .checkout-title {
            font-size: 20px;
            margin-bottom: 6px;
          }

          .checkout-subtitle {
            font-size: 13px;
            margin-bottom: 2rem;
          }

          .form-row {
            gap: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .input,
          .textarea {
            padding: 10px 12px;
            font-size: 13px;
          }

          .textarea {
            min-height: 80px;
          }

          .back-button,
          .back-to-cart-btn {
            padding: 8px 14px;
            font-size: 13px;
            margin-bottom: 1rem;
          }

          .summary {
            padding: 1rem;
          }

          .summary-title {
            font-size: 18px;
            margin-bottom: 1rem;
            padding-bottom: 0.8rem;
          }

          .summary-row {
            font-size: 14px;
            padding: 10px 0;
          }

          .total-section {
            padding: 1rem;
            margin-top: 1rem;
          }

          .total-label {
            font-size: 15px;
          }

          .total-value {
            font-size: 20px;
          }

          .checkout-btn,
          .confirm-btn {
            padding: 12px 18px;
            font-size: 15px;
          }

          .disclaimer-text {
            font-size: 11px;
            margin-top: 0.8rem;
          }

          .payment-card {
            padding: 14px;
            gap: 12px;
          }

          .payment-icon {
            font-size: 24px;
          }

          .payment-label {
            font-size: 14px;
          }

          .payment-subtext {
            font-size: 11px;
          }

          .item-image,
          .membership-emoji {
            width: 50px;
            height: 50px;
            font-size: 24px;
          }

          .item-name {
            font-size: 13px;
          }

          .qty-controls {
            padding: 4px;
            gap: 6px;
          }

          .qty-btn {
            width: 30px;
            height: 30px;
            padding: 6px;
          }

          .qty-display {
            font-size: 14px;
            min-width: 28px;
          }

          .item-price {
            font-size: 16px;
          }

          .audio-controls {
            bottom: 15px;
            left: 15px;
          }

          .mute-button {
            width: 50px;
            height: 50px;
          }

          .volume-slider {
            width: 90px;
          }

          .await-card {
            width: 95%;
            max-width: calc(100% - 20px);
          }

          .await-header {
            padding: 14px 16px;
          }

          .await-title {
            font-size: 16px;
          }

          .await-content {
            padding: 18px;
          }

          .await-body {
            font-size: 14px;
            margin-bottom: 14px;
          }
        }
      `}</style>

      <div className="cart-container">
        <audio ref={audioRef} src="/musica-relajante.mp3" loop />

        <PaymentModal
          open={!!paymentModalMethod}
          onClose={() => setPaymentModalMethod(null)}
          method={paymentModalMethod}
          amount={total}
          cart={cart}
          shippingData={shippingData}
          onConfirm={(method) => {
            handleConfirmOrder(method);
            if (method === 'SPEI' || method === 'OXXO') {
              setShowAwaitingPayment(true);
              setTimeout(() => setShowAwaitingPayment(false), 8000);
            }
          }}
        />

        {showAwaitingPayment && (
          <div className="await-overlay" role="dialog" aria-modal="true">
            <div className="await-card">
              <header className="await-header">
                <h3 className="await-title">Esperaremos tu pago</h3>
                <button className="await-close" onClick={() => setShowAwaitingPayment(false)} aria-label="Cerrar">✕</button>
              </header>
              <div className="await-content">
                <p className="await-body">Hemos registrado la instrucción. Esperaremos tu pago y, una vez recibido y verificado (estimado 1–3 horas), te notificaremos sobre tu pedido.</p>
                <div className="await-actions">
                  <button className="pm-confirm" onClick={() => setShowAwaitingPayment(false)}>Entendido</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="audio-controls">
          <div className="volume-slider-wrapper">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{ '--volume-percent': `${volume * 100}%` }}
              title="Ajustar volumen"
              aria-label="Control de volumen"
            />
            <span className="volume-percent">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <button 
            onClick={toggleMute}
            className={`mute-button ${isMuted ? 'muted' : ''}`}
            title={isMuted ? 'Activar sonido' : 'Silenciar'}
            aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
          >
            {isMuted ? <VolumeX size={28} /> : <Volume2 size={28} />}
          </button>
        </div>

        <header className="header">
          <div className="header-content">
            <div className="logo" onClick={() => navigate('/')}>
              <span className="logo-koxol">K'oxol</span>
              <span className="logo-sub">Tienda Natural</span>
            </div>
          </div>
        </header>

        <div className="main-wrapper">
          <button className="back-button" onClick={() => navigate('/shop')}>
            <ArrowLeft size={20} />
            <span>Seguir comprando</span>
          </button>

          <div className="cart-layout">
            <div className="cart-items">
              {!showCheckout ? (
                <>
                  <div className="section">
                    <div className="section-header">
                      <input type="checkbox" className="checkbox" defaultChecked />
                      <span className="section-title">Todos los productos</span>
                    </div>
                  </div>

                  <div className="section">
                    <div className="section-header">
                      <input type="checkbox" className="checkbox" defaultChecked />
                      <span className="section-title">Productos K'oxol</span>
                      <span className="full-badge">FULL</span>
                    </div>

                    {cart.map((item, index) => (
                      <div key={item.id}>
                        <div className="cart-item">
                          <input type="checkbox" className="checkbox" defaultChecked />
                          {item.isMembership ? (
                            <div className="item-image membership-emoji" aria-hidden="true">{getMembershipEmoji(item)}</div>
                          ) : (
                            <img src={item.image} alt={item.name} className="item-image" />
                          )}
                          <div className="item-details">
                            <h3 className="item-name">{item.name}</h3>
                              <button className="remove-btn" onClick={async () => {
                                const ok = await confirmDialog('Eliminar producto', '¿Deseas eliminar este producto del carrito?');
                                if (ok) removeItem(item.id);
                              }}>
                              Eliminar
                            </button>
                            <p className="item-available">{item.available} disponibles</p>
                          </div>
                          <div className="item-controls">
                            <div className="qty-controls">
                              <button
                                className="qty-btn"
                                onClick={() => updateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="qty-display">{item.qty}</span>
                              <button
                                className="qty-btn"
                                onClick={() => updateQty(item.id, 1)}
                                disabled={item.qty >= (item.available || 999)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div className="item-pricing">
                              {item.originalPrice > item.price && (
                                <span className="item-discount">
                                  -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                </span>
                              )}
                              {item.originalPrice > item.price && (
                                <span className="item-original-price">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="item-price">
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {index === cart.length - 1 && (
                          <div className="shipping-section">
                            <div className="shipping-header">
                              <span className="shipping-label">Envío</span>
                              <span style={{
                                fontSize: '15px',
                                fontWeight: '700',
                                color: shipping === 0 ? '#28a745' : '#e63946'
                              }}>
                                {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="progress-bar-container">
                              <div 
                                className="progress-bar"
                                style={{
                                  width: `${Math.min((nonMembershipSubtotal / 500) * 100, 100)}%`
                                }}
                              >
                                <div className="progress-indicator"></div>
                              </div>
                            </div>
                            <p className="shipping-message">
                              {nonMembershipSubtotal >= 500 || nonMembershipSubtotal === 0
                                ? '¡Felicidades! Tu envío es gratis.'
                                : `Agrega ${(500 - nonMembershipSubtotal).toFixed(2)} más para obtener envío gratis.`
                              }{' '}
                              <a href="#" className="link">Ver productos</a>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : showPaymentOptions ? (
                <div className="payment-options-container">
                  <button className="back-to-cart-btn" onClick={handleBackToShipping}>
                    <ArrowLeft size={16} />
                    <span>Volver a datos de envío</span>
                  </button>
                  
                  <h2 className="checkout-title">Método de pago</h2>
                  <p className="checkout-subtitle">Selecciona cómo deseas pagar tu pedido</p>
                  
                  <div className="payment-grid">
                    <button className="payment-card" onClick={() => setPaymentModalMethod('Tarjeta de crédito/débito')}>
                      <div className="payment-icon">💳</div>
                      <div className="payment-info">
                        <span className="payment-label">Tarjeta de crédito/débito</span>
                        <span className="payment-subtext">Visa, Mastercard, American Express</span>
                      </div>
                    </button>

                    <button className="payment-card" onClick={() => setPaymentModalMethod('OXXO')}>
                      <div className="payment-icon">🏪</div>
                      <div className="payment-info">
                        <span className="payment-label">OXXO</span>
                        <span className="payment-subtext">Paga en efectivo en tiendas OXXO</span>
                      </div>
                    </button>

                    <button className="payment-card" onClick={() => setPaymentModalMethod('SPEI')}>
                      <div className="payment-icon">🏦</div>
                      <div className="payment-info">
                        <span className="payment-label">Transferencia SPEI</span>
                        <span className="payment-subtext">Transferencia bancaria instantánea</span>
                      </div>
                    </button>

                    <button className="payment-card" onClick={() => setPaymentModalMethod('Mercado Pago')}>
                      <div className="payment-icon">💰</div>
                      <div className="payment-info">
                        <span className="payment-label">Mercado Pago</span>
                        <span className="payment-subtext">Paga con tu cuenta de Mercado Pago</span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="checkout-form">
                  <button className="back-to-cart-btn" onClick={handleBackToCart}>
                    <ArrowLeft size={16} />
                    <span>Volver al carrito</span>
                  </button>
                  
                  <h2 className="checkout-title">Datos de envío</h2>
                  <p className="checkout-subtitle">Complete la información para finalizar su compra</p>
                  
                  <div className="form-group">
                    <label className="label">Nombre completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Correo electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingData.email}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="correo@ejemplo.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Dirección completa *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="Calle, número, colonia"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="label">Código Postal *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="29000"
                        maxLength="5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="label">Número exterior *</label>
                      <input
                        type="text"
                        name="houseNumber"
                        value={shippingData.houseNumber}
                        onChange={handleInputChange}
                        className="input"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Referencia (opcional)</label>
                    <textarea
                      name="reference"
                      value={shippingData.reference}
                      onChange={handleInputChange}
                      className="textarea"
                      placeholder="Entre qué calles, color de casa, puntos de referencia..."
                      rows="3"
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      className="input"
                      placeholder="9611234567"
                      maxLength="10"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="summary">
              <h2 className="summary-title">Resumen de compra</h2>

              <div className="summary-row">
                <span className="summary-label">
                  Productos ({cart.reduce((acc, item) => acc + item.qty, 0)})
                </span>
                <span className="summary-value">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Envío</span>
                <span className={shipping === 0 ? 'summary-value-green' : 'summary-value'}>
                  {shipping === 0 ? 'Gratis' : `${shipping.toFixed(2)}`}
                </span>
              </div>

              {savings > 0 && (
                <div className="summary-row">
                  <span className="summary-label">
                    Costos de descuento estimados
                  </span>
                  <span className="summary-value-green">
                    -${savings.toFixed(2)}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="summary-row">
                  <span className="summary-label">Descuento</span>
                  <span className="summary-value-green">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="coupon-section">
                {!showCouponInput && !appliedCoupon && (
                  <a href="#" className="coupon-link" onClick={handleOpenCoupon}>Ingresar código de cupón</a>
                )}

                {showCouponInput && (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                      ref={couponInputRef}
                      type="text"
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="input"
                      style={{ maxWidth: '220px' }}
                    />
                    <button type="submit" className="checkout-btn" style={{ padding: '8px 12px', width: 'auto' }}>Aplicar</button>
                    <button type="button" className="back-button" onClick={() => setShowCouponInput(false)} style={{ padding: '8px 12px' }}>Cancelar</button>
                  </form>
                )}

                {appliedCoupon && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: '#176c3a' }}>{Math.round((appliedCoupon.discount||0)*100)}% aplicados</div>
                    <div style={{ fontSize: '13px', color: '#555' }}>{appliedCoupon.code}</div>
                  </div>
                )}
              </div>

              <div className="total-section">
                <span className="total-label">Total</span>
                <span className="total-value">${total.toFixed(2)}</span>
              </div>

              {!showCheckout && (
                <button className="checkout-btn" onClick={() => setShowCheckout(true)}>
                  Continuar compra
                </button>
              )}

              {cart && cart.length > 0 && (
                <button
                  className="back-button"
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={async () => {
                    const ok = await confirmDialog('Vaciar carrito', '¿Deseas eliminar todos los productos del carrito?', { confirmButtonText: 'Vaciar', confirmButtonColor: '#dc2626' });
                    if (ok) {
                      setCart([]);
                      showSuccess('Carrito vaciado', 'Se han eliminado todos los productos del carrito.');
                    }
                  }}
                >
                  Vaciar carrito
                </button>
              )}

              {showCheckout && !showPaymentOptions && (
                <button className="checkout-btn" onClick={handleProceedToPayment}>
                  Proceder al pago
                </button>
              )}

              <p className="disclaimer-text">
                Verás el costo de envío e impuestos al finalizar tu compra
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartFlow;