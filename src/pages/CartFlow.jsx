import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartFlow = () => {
  const { cart, setCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [shippingData, setShippingData] = useState({
    fullName: localStorage.getItem('userFullName') || '',
    address: '',
    zipCode: '',
    houseNumber: '',
    reference: '',
    phone: ''
  });
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const audioRef = useRef(null);

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
    
    // Validar que todos los campos requeridos estén llenos
    if (!shippingData.fullName || !shippingData.address || !shippingData.zipCode || 
        !shippingData.houseNumber || !shippingData.phone) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }
    
    // Validar código postal (5 dígitos)
    if (shippingData.zipCode.length !== 5) {
      alert('El código postal debe tener 5 dígitos');
      return;
    }
    
    // Validar teléfono (10 dígitos)
    if (shippingData.phone.length !== 10) {
      alert('El teléfono debe tener 10 dígitos');
      return;
    }
    
    console.log('✅ Validación exitosa! Cambiando a métodos de pago...');
    setShowPaymentOptions(true);
  };

  const handleConfirmOrder = (paymentMethod) => {
    console.log('=== CONFIRMANDO ORDEN ===');
    console.log('Datos de envío:', shippingData);
    console.log('Carrito:', cart);
    console.log('Total:', total);
    console.log('Método de pago:', paymentMethod);
    alert(`¡Orden confirmada!\nMétodo de pago: ${paymentMethod}\nTotal: $${total.toFixed(2)}`);
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

  const originalTotal = cart.reduce((sum, item) => {
    if (!validateCartItem(item)) return sum;
    const originalPrice = parseFloat(item.originalPrice) || 0;
    const qty = parseInt(item.qty);
    return sum + originalPrice * qty;
  }, 0);

  const savings = originalTotal - subtotal;
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

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

  return (
    <div style={styles.container}>
      <audio ref={audioRef} src="/musica-relajante.mp3" loop />

      <div 
        onMouseEnter={() => setShowVolumeSlider(true)}
        onMouseLeave={() => setShowVolumeSlider(false)}
        style={{ 
          position: 'fixed', 
          bottom: '40px', 
          left: '20px', 
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {showVolumeSlider && (
          <div style={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
          }}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ 
                width: '100px',
                cursor: 'pointer',
                transform: 'rotate(-90deg)',
                transformOrigin: 'center'
              }}
              title="Ajustar volumen"
              aria-label="Control de volumen"
            />
            <span style={{ fontSize: '12px', color: '#666', marginTop: '30px' }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
        )}

        <button 
          onClick={toggleMute}
          style={{ 
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: isMuted ? '#ccc' : '#4CAF50',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
            color: 'white'
          }}
          title={isMuted ? 'Activar sonido' : 'Silenciar'}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
        >
          {isMuted ? <FaVolumeMute size={28} /> : <FaVolumeUp size={28} />}
        </button>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo} onClick={() => navigate('/')}>
            <span style={styles.logoKoxol}>K'oxol</span>
            <span style={styles.logoSub}>Tienda Natural</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div style={styles.mainWrapper}>
        <div style={styles.mainContent}>
          {/* Back Button */}
          <button style={styles.backButton} onClick={() => navigate('/shop')}>
            <ArrowLeft size={20} />
            <span>Seguir comprando</span>
          </button>

          {/* Cart Content */}
          <div style={styles.cartLayout}>
            {/* Left Side - Cart Items, Checkout Form, or Payment Options */}
            <div style={styles.cartItems}>
              {!showCheckout ? (
                /* VISTA 1: CARRITO */
                <>
                  <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                      <input type="checkbox" style={styles.checkbox} defaultChecked />
                      <span style={styles.sectionTitle}>Todos los productos</span>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                      <input type="checkbox" style={styles.checkbox} defaultChecked />
                      <span style={styles.sectionTitle}>Productos K'oxol</span>
                      <span style={styles.fullBadge}>FULL</span>
                    </div>

                    {cart.map((item, index) => (
                      <div key={item.id}>
                        <div style={styles.cartItem}>
                          <input type="checkbox" style={styles.checkbox} defaultChecked />
                          <img src={item.image} alt={item.name} style={styles.itemImage} />
                          <div style={styles.itemDetails}>
                            <h3 style={styles.itemName}>{item.name}</h3>
                            <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>
                              Eliminar
                            </button>
                            <p style={styles.itemAvailable}>{item.available} disponibles</p>
                          </div>
                          <div style={styles.itemControls}>
                            <div style={styles.qtyControls}>
                              <button
                                style={{
                                  ...styles.qtyBtn,
                                  ...(item.qty <= 1 && { opacity: 0.4, cursor: 'not-allowed' })
                                }}
                                onClick={() => updateQty(item.id, -1)}
                                disabled={item.qty <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span style={styles.qtyDisplay}>{item.qty}</span>
                              <button
                                style={{
                                  ...styles.qtyBtn,
                                  ...(item.qty >= (item.available || 999) && { opacity: 0.4, cursor: 'not-allowed' })
                                }}
                                onClick={() => updateQty(item.id, 1)}
                                disabled={item.qty >= (item.available || 999)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <div style={styles.itemPricing}>
                              {item.originalPrice > item.price && (
                                <span style={styles.itemDiscount}>
                                  -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                                </span>
                              )}
                              {item.originalPrice > item.price && (
                                <span style={styles.itemOriginalPrice}>
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span style={styles.itemPrice}>
                                ${(item.price * item.qty).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {index === cart.length - 1 && (
                          <div style={styles.shippingSection}>
                            <div style={styles.shippingHeader}>
                              <span style={styles.shippingLabel}>Envío</span>
                              <span style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                color: shipping === 0 ? '#176c3a' : '#e63946'
                              }}>
                                {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                              </span>
                            </div>
                            <div style={styles.progressBarContainer}>
                              <div style={{
                                backgroundColor: '#176c3a',
                                height: '100%',
                                borderRadius: '4px',
                                width: `${Math.min((subtotal / 500) * 100, 100)}%`
                              }}></div>
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: `${Math.min((subtotal / 500) * 100, 100)}%`,
                                transform: 'translate(-50%, -50%)',
                                width: '16px',
                                height: '16px',
                                backgroundColor: '#176c3a',
                                borderRadius: '50%'
                              }}></div>
                            </div>
                            <p style={styles.shippingMessage}>
                              {subtotal >= 500 
                                ? '¡Felicidades! Tu envío es gratis.'
                                : `Agrega $${(500 - subtotal).toFixed(2)} más para obtener envío gratis.`
                              }{' '}
                              <a href="#" style={styles.link}>Ver productos</a>
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : showPaymentOptions ? (
                /* VISTA 3: MÉTODOS DE PAGO */
                <div style={styles.paymentOptionsContainer}>
                  <button style={styles.backToCartBtn} onClick={handleBackToShipping}>
                    <ArrowLeft size={16} />
                    <span>Volver a datos de envío</span>
                  </button>
                  
                  <h2 style={styles.checkoutTitle}>Método de pago</h2>
                  <p style={styles.checkoutSubtitle}>Selecciona cómo deseas pagar tu pedido</p>
                  
                  <div style={styles.paymentGrid}>
                    <button style={styles.paymentCard} onClick={() => handleConfirmOrder('Tarjeta de crédito/débito')}>
                      <div style={styles.paymentIcon}>💳</div>
                      <span style={styles.paymentLabel}>Tarjeta de crédito/débito</span>
                      <span style={styles.paymentSubtext}>Visa, Mastercard, American Express</span>
                    </button>

                    <button style={styles.paymentCard} onClick={() => handleConfirmOrder('OXXO')}>
                      <div style={styles.paymentIcon}>🏪</div>
                      <span style={styles.paymentLabel}>OXXO</span>
                      <span style={styles.paymentSubtext}>Paga en efectivo en tiendas OXXO</span>
                    </button>

                    <button style={styles.paymentCard} onClick={() => handleConfirmOrder('SPEI')}>
                      <div style={styles.paymentIcon}>🏦</div>
                      <span style={styles.paymentLabel}>Transferencia SPEI</span>
                      <span style={styles.paymentSubtext}>Transferencia bancaria instantánea</span>
                    </button>

                    <button style={styles.paymentCard} onClick={() => handleConfirmOrder('Mercado Pago')}>
                      <div style={styles.paymentIcon}>💰</div>
                      <span style={styles.paymentLabel}>Mercado Pago</span>
                      <span style={styles.paymentSubtext}>Paga con tu cuenta de Mercado Pago</span>
                    </button>

                    <button style={styles.paymentCard} onClick={() => handleConfirmOrder('PayPal')}>
                      <div style={styles.paymentIcon}>🅿️</div>
                      <span style={styles.paymentLabel}>PayPal</span>
                      <span style={styles.paymentSubtext}>Paga con tu cuenta de PayPal</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* VISTA 2: FORMULARIO DE DATOS DE ENVÍO */
                <div style={styles.checkoutForm}>
                  <button style={styles.backToCartBtn} onClick={handleBackToCart}>
                    <ArrowLeft size={16} />
                    <span>Volver al carrito</span>
                  </button>
                  
                  <h2 style={styles.checkoutTitle}>Datos de envío</h2>
                  <p style={styles.checkoutSubtitle}>Complete la información para finalizar su compra</p>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nombre completo *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingData.fullName}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Ej: Juan Pérez García"
                      required
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Dirección completa *</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Calle, número, colonia"
                      required
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Código Postal *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="29000"
                        maxLength="5"
                        required
                      />
                    </div>

                    <div style={styles.formGroupHalf}>
                      <label style={styles.label}>Número exterior *</label>
                      <input
                        type="text"
                        name="houseNumber"
                        value={shippingData.houseNumber}
                        onChange={handleInputChange}
                        style={styles.input}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Referencia (opcional)</label>
                    <textarea
                      name="reference"
                      value={shippingData.reference}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      placeholder="Entre qué calles, color de casa, puntos de referencia..."
                      rows="3"
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="9611234567"
                      maxLength="10"
                      required
                    />
                  </div>

                  <button style={styles.confirmBtn} onClick={handleProceedToPayment}>
                    Siguiente - Seleccionar forma de pago
                  </button>
                </div>
              )}
            </div>

            {/* Right Side - Order Summary */}
            <div style={styles.summary}>
              <div style={styles.summaryCard}>
                <h2 style={styles.summaryTitle}>Resumen de compra</h2>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Productos ({cart.reduce((acc, item) => acc + item.qty, 0)})
                  </span>
                  <span style={styles.summaryValue}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div style={styles.summaryRow}>
                  <span style={styles.summaryLabel}>
                    Envío
                  </span>
                  <span style={shipping === 0 ? styles.summaryValueGreen : styles.summaryValue}>
                    {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {savings > 0 && (
                  <div style={styles.summaryRow}>
                    <span style={styles.summaryLabel}>
                      Costos de descuento estimados
                    </span>
                    <span style={styles.summaryValueGreen}>
                      -${savings.toFixed(2)}
                    </span>
                  </div>
                )}

                <div style={styles.couponSection}>
                  <a href="#" style={styles.couponLink}>Ingresar código de cupón</a>
                </div>

                <div style={styles.totalSection}>
                  <span style={styles.totalLabel}>Total</span>
                  <span style={styles.totalValue}>${total.toFixed(2)}</span>
                </div>

                {!showCheckout && (
                  <button style={styles.checkoutBtn} onClick={() => setShowCheckout(true)}>
                    Continuar compra
                  </button>
                )}

                {showCheckout && !showPaymentOptions && (
                  <button style={styles.checkoutBtn} onClick={handleProceedToPayment}>
                    Proceder al pago
                  </button>
                )}

                <p style={styles.disclaimerText}>
                  Verás el costo de envío e impuestos al finalizar tu compra
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
    backgroundColor: '#ebebeb',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    width: '100vw',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  header: {
    background: '#fff',
    borderBottom: '1px solid #e0e0e0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
    width: '100%',
    boxSizing: 'border-box',
  },
  headerContent: {
    margin: 0,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#176c3a',
    minWidth: 140,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  logoKoxol: {
    color: '#176c3a',
    fontWeight: 900,
  },
  logoSub: {
    color: '#169c7c',
    fontWeight: 600,
  },
  mainWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ebebeb',
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
    width: '100%',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  cartLayout: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '20px',
    width: '100%',
  },
  cartItems: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginLeft: 'auto',
    marginRight: '0',
    maxWidth: '800px',
  },
  section: {
    marginBottom: '20px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  checkbox: {
    marginRight: '10px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
  },
  fullBadge: {
    backgroundColor: '#176c3a',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
    marginLeft: '50px',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    borderRadius: '4px',
    objectFit: 'cover',
    marginRight: '10px',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    marginBottom: '5px',
  },
  removeBtn: {
    backgroundColor: 'transparent',
    color: '#e63946',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px',
    marginBottom: '5px',
  },
  itemAvailable: {
    fontSize: '12px',
    color: '#777',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
  },
  qtyBtn: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    padding: '5px 10px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '30px',
    height: '30px',
    transition: 'all 0.2s ease',
  },
  qtyDisplay: {
    fontSize: '14px',
    color: '#333',
    margin: '0 10px',
  },
  itemPricing: {
    textAlign: 'right',
  },
  itemDiscount: {
    color: '#e63946',
    fontSize: '12px',
    marginRight: '5px',
  },
  itemOriginalPrice: {
    textDecoration: 'line-through',
    color: '#777',
    fontSize: '12px',
    marginRight: '5px',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#176c3a',
  },
  shippingSection: {
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #e0e0e0',
  },
  shippingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  shippingLabel: {
    fontSize: '14px',
    color: '#333',
  },
  progressBarContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: '4px',
    height: '8px',
    width: '100%',
    marginBottom: '10px',
    position: 'relative',
  },
  shippingMessage: {
    fontSize: '12px',
    color: '#333',
  },
  link: {
    color: '#176c3a',
    textDecoration: 'underline',
  },
  summary: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginLeft: 'auto',
    marginRight: '3rem',
    maxWidth: '400px',
  },
  summaryCard: {
    display: 'flex',
    flexDirection: 'column',
  },
  summaryTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#176c3a',
    marginBottom: '15px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#333',
    marginBottom: '10px',
  },
  summaryLabel: {
    color: '#333',
  },
  summaryValue: {
    color: '#176c3a',
    fontWeight: '500',
  },
  summaryValueGreen: {
    color: '#28a745',
    fontWeight: '500',
  },
  couponSection: {
    margin: '10px 0',
  },
  couponLink: {
    color: '#176c3a',
    textDecoration: 'underline',
    fontSize: '14px',
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '15px',
  },
  totalLabel: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#176c3a',
  },
  checkoutBtn: {
    backgroundColor: '#176c3a',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },
  disclaimerText: {
    fontSize: '12px',
    color: '#777',
    marginTop: '10px',
    textAlign: 'center',
  },
  checkoutForm: {
    padding: '20px',
  },
  backToCartBtn: {
    backgroundColor: 'transparent',
    color: '#176c3a',
    padding: '8px 0',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    fontWeight: '500',
  },
  checkoutTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#176c3a',
    marginBottom: '8px',
  },
  checkoutSubtitle: {
    fontSize: '14px',
    color: '#777',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    display: 'flex',
    gap: '15px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: '#176c3a',
    color: 'white',
    padding: '16px 24px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '10px',
  },
  paymentOptionsContainer: {
    padding: '20px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '12px',
    marginTop: '20px',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
    gap: '15px',
    transition: 'all 0.3s ease',
    minHeight: 'auto',
  },
  paymentIcon: {
    fontSize: '32px',
    flexShrink: 0,
  },
  paymentLabel: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
    display: 'block',
  },
  paymentSubtext: {
    fontSize: '12px',
    color: '#777',
    lineHeight: '1.4',
    display: 'block',
  },
};

export default CartFlow;