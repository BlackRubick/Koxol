import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { setJSON } from '../../utils/storage';
import CouponModal from '../atoms/CouponModal';
import { showAlert, showError, showSuccess } from '../../utils/swal';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  const API_BASE = import.meta.env.VITE_API_BASE || '';

  // Prefer same-origin relative path in production; fall back to /api when not set
  const base = API_BASE || '/api';
    // Use backend for auth
    {
      try {
  const endpoint = isLogin ? '/auth/login' : '/auth/register';
  const res = await fetch(`${base}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });
        const json = await res.json();
        if (!res.ok) {
          setIsLoading(false);
          showError('Error', json.error || 'Error en autenticación');
          return;
        }

        // json: { token, user }
        const token = json.token;
        const user = json.user;
        if (token) {
          // persist token in localStorage for AuthContext to pick up
          setJSON('authToken', token);
        }

        // if registering, optionally generate welcome coupon locally for UX
        if (!isLogin) {
          const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
          const code = `KOXOL-REG-${randomPart}`;
          const couponObj = { code, discount: 0.2, label: '20% de descuento por registro - KOXOL', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), used: false };
          setJSON('welcomeCoupon', couponObj);
          setCoupon(couponObj);
        }

        // Login into app context (attach token to user object so AuthContext persists it)
        login({ ...user, token }, () => {
          setIsLoading(false);
          if (!isLogin) {
            setShowCoupon(true);
            return;
          }
          // If user is admin, go to admin orders view
          if (user && user.role === 'admin') navigate('/admin/orders');
          else navigate('/shop');
        });
      } catch (err) {
        console.error('Auth error:', err);
        showError('Error de conexión', 'Error de conexión con el servidor de autenticación');
        setIsLoading(false);
      }
      return;
    }

    // Fallback: local simulated auth (original behavior)
    // Si es el administrador con credenciales conocidas, asignar rol admin
    if (isLogin && formData.email === 'admin@hotmail.com' && formData.password === 'admin123') {
      const adminUser = { name: 'Administrador', email: formData.email, role: 'admin' };
      login(adminUser, () => navigate('/admin/orders'));
      setIsLoading(false);
      return;
    }

    const user = { name: formData.name || 'Usuario', email: formData.email, role: 'customer' };
    if (!isLogin) {
      const generateCoupon = () => {
        const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
        const code = `KOXOL-REG-${randomPart}`;
        const couponObj = { code, discount: 0.2, label: '20% de descuento por registro - KOXOL', expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), used: false };
        setJSON('welcomeCoupon', couponObj);
        setCoupon(couponObj);
      };
      generateCoupon();
      login(user, () => { setIsLoading(false); setShowCoupon(true); });
    } else {
      login(user, () => {
        if (user && user.role === 'admin') navigate('/admin/orders');
        else navigate('/shop');
      });
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-container {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(135deg, #064e3b 0%, #166534 50%, #0f766e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        .floating-leaf {
          position: absolute;
          color: #6ee7b7;
          opacity: 0.8;
          pointer-events: none;
          font-size: 48px;
        }

        @media (min-width: 1024px) {
          .floating-leaf {
            font-size: 72px;
          }
        }

        .leaf1 {
          top: 80px;
          left: 10%;
          animation: float 3s ease-in-out infinite;
        }

        @media (min-width: 1024px) {
          .leaf1 {
            left: 15%;
          }
        }

        .leaf2 {
          top: 160px;
          right: 10%;
          font-size: 64px;
          opacity: 0.8;
          animation: float 4s ease-in-out infinite 1s;
        }

        @media (min-width: 1024px) {
          .leaf2 {
            font-size: 96px;
            right: 12%;
          }
        }

        .leaf3 {
          bottom: 128px;
          left: 15%;
          font-size: 40px;
          opacity: 0.8;
          animation: float 5s ease-in-out infinite 2s;
        }

        @media (min-width: 1024px) {
          .leaf3 {
            font-size: 56px;
            left: 20%;
          }
        }

        .sparkle {
          bottom: 80px;
          right: 20%;
          font-size: 32px;
          color: #a7f3d0;
          opacity: 0.4;
          animation: pulse 3s ease-in-out infinite;
        }

        @media (min-width: 1024px) {
          .sparkle {
            font-size: 48px;
            right: 25%;
          }
        }

        .auth-card-wrapper {
          width: 100%;
          max-width: 440px;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .auth-card-wrapper {
            max-width: 480px;
          }
        }

        @media (min-width: 768px) {
          .auth-card-wrapper {
            max-width: 520px;
          }
        }

        @media (min-width: 1024px) {
          .auth-card-wrapper {
            max-width: 560px;
          }
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transition: transform 0.5s ease;
        }

        .auth-card:hover {
          transform: scale(1.02);
        }

        .auth-header {
          background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
          padding: 32px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .auth-header {
            padding: 40px 32px;
          }
        }

        .auth-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.1);
        }

        .auth-header-content {
          position: relative;
          z-index: 10;
          animation: fadeIn 0.5s ease-out;
        }

        .auth-logo-circle {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          transition: all 0.3s ease;
        }

        @media (min-width: 768px) {
          .auth-logo-circle {
            width: 90px;
            height: 90px;
          }
        }

        .auth-logo-circle:hover {
          transform: rotate(12deg) scale(1.1);
        }

        .auth-logo-icon {
          font-size: 48px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }

        @media (min-width: 768px) {
          .auth-logo-icon {
            font-size: 54px;
          }
        }

        .auth-header h1 {
          color: white;
          font-size: 32px;
          font-weight: bold;
          margin: 0 0 8px 0;
        }

        @media (min-width: 768px) {
          .auth-header h1 {
            font-size: 36px;
          }
        }

        .auth-header p {
          color: #d1fae5;
          font-size: 14px;
          margin: 0;
        }

        @media (min-width: 768px) {
          .auth-header p {
            font-size: 15px;
          }
        }

        .auth-content {
          padding: 32px;
        }

        @media (min-width: 768px) {
          .auth-content {
            padding: 40px;
          }
        }

        .auth-toggle-container {
          display: flex;
          gap: 8px;
          margin-bottom: 32px;
          background: #f3f4f6;
          border-radius: 9999px;
          padding: 4px;
        }

        .auth-toggle-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 9999px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          background: transparent;
          color: #6b7280;
          font-size: 14px;
        }

        @media (min-width: 768px) {
          .auth-toggle-btn {
            font-size: 15px;
            padding: 11px 18px;
          }
        }

        .auth-toggle-btn:hover {
          color: #111827;
        }

        .auth-toggle-btn.active {
          background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
          transform: scale(1.05);
        }

        .auth-form-group {
          margin-bottom: 20px;
          transition: all 0.5s ease;
        }

        .auth-form-group.hidden {
          opacity: 0;
          max-height: 0;
          margin-bottom: 0;
          overflow: hidden;
        }

        .auth-form-group.visible {
          opacity: 1;
          max-height: 80px;
        }

        .auth-input-wrapper {
          position: relative;
          transition: transform 0.3s ease;
        }

        .auth-input-wrapper:hover {
          transform: scale(1.02);
        }

        .auth-input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #059669;
          font-size: 20px;
        }

        .auth-form-input {
          width: 100%;
          padding: 12px 12px 12px 48px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
          font-family: inherit;
        }

        @media (min-width: 768px) {
          .auth-form-input {
            padding: 13px 12px 13px 50px;
            font-size: 15px;
          }
        }

        .auth-form-input:focus {
          border-color: #059669;
          box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1);
        }

        .auth-toggle-password {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 20px;
          transition: color 0.2s ease;
          padding: 0;
        }

        .auth-toggle-password:hover {
          color: #059669;
        }

        .auth-forgot-password {
          text-align: right;
          margin-bottom: 20px;
        }

        .auth-forgot-link {
          color: #059669;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .auth-forgot-link:hover {
          color: #047857;
        }

        .auth-submit-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        @media (min-width: 768px) {
          .auth-submit-btn {
            padding: 13px;
            font-size: 17px;
          }
        }

        .auth-submit-btn:hover {
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
          transform: scale(1.02);
        }

        .auth-submit-btn:active {
          transform: scale(0.95);
        }

        .auth-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .auth-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0;
        }

        .auth-divider-line {
          flex: 1;
          height: 1px;
          background: #d1d5db;
        }

        .auth-divider-text {
          color: #6b7280;
          font-size: 14px;
        }

        .auth-social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .auth-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .auth-social-btn:hover {
          border-color: #059669;
          background: #f0fdf4;
          transform: scale(1.05);
        }

        .auth-social-btn span {
          font-weight: 600;
          color: #374151;
        }

        .auth-toggle-text {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .auth-toggle-link {
          color: #059669;
          font-weight: 600;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
        }

        .auth-toggle-link:hover {
          color: #047857;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #d1fae5;
        }

        .auth-footer button {
          color: #d1fae5;
          text-decoration: underline;
          transition: color 0.2s ease;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
        }

        .auth-footer button:hover {
          color: white;
        }

        @media (max-width: 480px) {
          .auth-header {
            padding: 24px 16px;
          }

          .auth-logo-circle {
            width: 80px;
            height: 80px;
          }

          .auth-logo-icon {
            font-size: 40px;
          }

          .auth-header h1 {
            font-size: 28px;
          }

          .auth-header p {
            font-size: 13px;
          }

          .auth-content {
            padding: 24px;
          }

          .auth-toggle-container {
            margin-bottom: 24px;
          }

          .auth-toggle-btn {
            font-size: 13px;
            padding: 8px 12px;
          }

          .auth-form-input {
            padding: 10px 10px 10px 40px;
            font-size: 13px;
          }

          .auth-submit-btn {
            padding: 10px;
            font-size: 15px;
          }

          .auth-divider {
            margin: 20px 0;
          }

          .auth-divider-text {
            font-size: 13px;
          }

          .auth-social-btn {
            padding: 8px;
            font-size: 13px;
          }

          .auth-toggle-text {
            font-size: 13px;
          }

          .auth-footer {
            margin-top: 20px;
            font-size: 13px;
          }
        }
      `}</style>

      <div className="auth-container">
        <div className="floating-leaf leaf1">🍃</div>
        <div className="floating-leaf leaf2">🍂</div>
        <div className="floating-leaf leaf3">🌿</div>
        <div className="sparkle">✨</div>

        <div className="auth-card-wrapper">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-header-content">
                <div className="auth-logo-circle">
                  <span className="auth-logo-icon">🌱</span>
                </div>
                <h1>Bienvenido</h1>
                <p>Inicia sesión o regístrate para continuar</p>
              </div>
            </div>

            <div className="auth-content">
              <div className="auth-toggle-container">
                <button
                  className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(true)}
                >
                  Iniciar Sesión
                </button>
                <button
                  className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
                  onClick={() => setIsLogin(false)}
                >
                  Registrarse
                </button>
              </div>

              <div>
                <div className={`auth-form-group ${!isLogin ? 'visible' : 'hidden'}`}>
                  <div className="auth-input-wrapper">
          {/* Modal del cupón: se muestra tras registrarse */}
          <CouponModal
            open={showCoupon}
            coupon={coupon}
            onClose={() => {
              setShowCoupon(false);
              navigate('/shop');
            }}
          />

                    <input
                      type="text"
                      name="name"
                      className="auth-form-input"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="auth-form-group visible">
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">✉️</span>
                    <input
                      type="email"
                      name="email"
                      className="auth-form-input"
                      placeholder="Correo electrónico"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="auth-form-group visible">
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      className="auth-form-input"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      className="auth-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className={`auth-form-group ${!isLogin ? 'visible' : 'hidden'}`}>
                  <div className="auth-input-wrapper">
                    <span className="auth-input-icon">🔒</span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      className="auth-form-input"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {isLogin && (
                  <div className="auth-forgot-password">
                    <button className="auth-forgot-link">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}

                <button
                  className="auth-submit-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="auth-spinner"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                  )}
                </button>
              </div>

              <p className="auth-toggle-text">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button className="auth-toggle-link" onClick={switchMode}>
                  {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
              </p>
            </div>
          </div>

          <p className="auth-footer">
            Al continuar, aceptas nuestros{' '}
            <a href="/terminos.html" className="footer-link" target="_blank" rel="noopener">Términos y Condiciones</a>
          </p>
        </div>
      </div>
    </>
  );
}