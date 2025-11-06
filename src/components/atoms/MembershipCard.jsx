import React from 'react';
import './MembershipCard.css';

const humanPlanName = (key) => {
  switch (key) {
    case 'plan-basico': return "Plan Básico";
    case 'natural-plus': return "Natural Plus";
    case 'koxol-pro': return "K'oxol Pro";
    default: return key || 'Membresía';
  }
};

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch (e) {
    return iso;
  }
};

const MembershipCard = ({ membership }) => {
  if (!membership) return null;
  const { planKey, activationCode, discountPercent, startedAt, expiresAt, benefits } = membership;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activationCode || '');
      // simple user feedback via title change could be added later
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <div className="koxol-membership-card">
      <div className="koxol-membership-card__header">
        <div className="koxol-membership-card__plan">{humanPlanName(planKey)}</div>
        <div className="koxol-membership-card__discount">{discountPercent ? `${discountPercent}%` : ''}</div>
      </div>

      <div className="koxol-membership-card__body">
        <p className="koxol-membership-card__code"><strong>Código:</strong> <span>{activationCode || '—'}</span>
          {activationCode && (
            <button className="koxol-membership-card__copy" onClick={copyCode} title="Copiar código">Copiar</button>
          )}
        </p>

        <p><strong>Vigencia:</strong> {formatDate(startedAt)} — {formatDate(expiresAt)}</p>

        {benefits && (
          <ul className="koxol-membership-card__benefits">
            {benefits.discountPercent && (<li>Descuento: {benefits.discountPercent}%</li>)}
            {benefits.freeShipping && (<li>Envío gratis: {benefits.freeShipping === 'always' ? 'Siempre' : `desde ${benefits.freeShipping}`}</li>)}
            {benefits.welcomeGift && (<li>Regalo de bienvenida</li>)}
            {benefits.description && (<li>{benefits.description}</li>)}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MembershipCard;
