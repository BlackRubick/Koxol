export function slugifyPlan(name: string) {
  return (name || 'plan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function randomAlpha(num = 5) {
  return Math.random().toString(36).substring(2, 2 + num).toUpperCase();
}

export function generateActivationCode(planKey: string, billing: 'monthly' | 'yearly') {
  const rand = randomAlpha(5);
  const suffix = billing === 'yearly' ? 'Y' : 'M';
  return `KX-ACT-${planKey}-${suffix}-${rand}`;
}

export function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export type PlanBenefits = {
  key: string;
  name: string;
  discountPercent: number;
  freeShippingThreshold?: number | null;
  freeShippingAlways?: boolean;
  welcomeGift?: string | null;
  prioritySupport?: boolean;
  vipAccess?: boolean;
  accessToLimitedProducts?: boolean;
};

export function getPlanBenefits(planKey: string): PlanBenefits {
  const k = (planKey || '').toLowerCase();
  // Normalize common variants
  if (k.includes('basico') || k.includes('b-a-s-i-c-o') || k.includes('plan-basico')) {
    return {
      key: 'plan-basico',
      name: 'Plan Básico',
      discountPercent: 0.10,
      freeShippingThreshold: 999999, // effectively no free shipping
      freeShippingAlways: false,
      welcomeGift: null,
      prioritySupport: true,
      vipAccess: false,
      accessToLimitedProducts: false
    };
  }

  if (k.includes('natural') || k.includes('natural-plus') || k.includes('naturalplus')) {
    return {
      key: 'natural-plus',
      name: 'Natural Plus',
      discountPercent: 0.20,
      freeShippingThreshold: 499,
      freeShippingAlways: false,
      welcomeGift: 'Welcome box',
      prioritySupport: true,
      vipAccess: false,
      accessToLimitedProducts: false
    };
  }

  // K'oxol Pro
  if (k.includes('pro') || k.includes('koxol-pro') || k.includes("k'oxol-pro") || k.includes('koxol')) {
    return {
      key: 'koxol-pro',
      name: "K'oxol Pro",
      discountPercent: 0.30,
      freeShippingThreshold: 0,
      freeShippingAlways: true,
      welcomeGift: 'Premium welcome kit',
      prioritySupport: true,
      vipAccess: true,
      accessToLimitedProducts: true
    };
  }

  // default/fallback
  return {
    key: planKey || 'plan',
    name: planKey || 'Plan',
    discountPercent: 0,
    freeShippingThreshold: null,
    freeShippingAlways: false,
    welcomeGift: null,
    prioritySupport: false,
    vipAccess: false,
    accessToLimitedProducts: false
  };
}
