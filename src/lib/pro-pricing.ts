export const PRO_PLANS = {
  monthly: {
    amountCentsCOP: 2990000,
    amountCOP: 29900,
    displayCOP: "29.900",
    daysValid: 30,
    label: "PRO Mensual",
    shortLabel: "Monthly",
  },
  yearly: {
    amountCentsCOP: 24990000,
    amountCOP: 249900,
    displayCOP: "249.900",
    daysValid: 365,
    label: "PRO Anual",
    shortLabel: "Yearly",
  },
} as const;

export type ProPlan = keyof typeof PRO_PLANS;

export const APPROX_EXCHANGE_RATES = {
  USD: 0.00025,
  EUR: 0.00023,
  MXN: 0.0042,
  BRL: 0.0013,
  ARS: 0.27,
  GBP: 0.0002,
} as const;

export type SupportedDisplayCurrency = keyof typeof APPROX_EXCHANGE_RATES | "COP";

const CURRENCY_LOCALES: Record<SupportedDisplayCurrency, string> = {
  COP: "es-CO",
  USD: "en-US",
  EUR: "de-DE",
  MXN: "es-MX",
  BRL: "pt-BR",
  ARS: "es-AR",
  GBP: "en-GB",
};

export function formatMoney(amount: number, currency: SupportedDisplayCurrency) {
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: currency === "COP" ? 0 : 2,
  }).format(amount);
}

export function getPlanCurrencyEquivalents(plan: ProPlan) {
  const amountCOP = PRO_PLANS[plan].amountCOP;

  return {
    COP: formatMoney(amountCOP, "COP"),
    USD: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.USD, "USD"),
    EUR: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.EUR, "EUR"),
    MXN: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.MXN, "MXN"),
    BRL: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.BRL, "BRL"),
    ARS: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.ARS, "ARS"),
    GBP: formatMoney(amountCOP * APPROX_EXCHANGE_RATES.GBP, "GBP"),
  };
}
