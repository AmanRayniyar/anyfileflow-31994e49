// 100 finance calculator definitions used by FinanceTool.
// Pure, client-side, no external API calls. SEO-friendly tool registry.

export type FinanceInputType = "number" | "percent" | "select" | "currency";

export interface FinanceInput {
  id: string;
  label: string;
  type: FinanceInputType;
  unit?: string;
  default?: number | string;
  step?: number;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
  help?: string;
}

export interface FinanceResult {
  label: string;
  value: string;
  highlight?: boolean;
  hint?: string;
}

export interface FinanceCalc {
  id: string;
  inputs: FinanceInput[];
  compute: (v: Record<string, number | string>) => FinanceResult[];
  formula?: string;
  insight?: (v: Record<string, number | string>) => string;
}

// ============= helpers =============
const n = (v: number | string | undefined, d = 0): number => {
  const x = typeof v === "string" ? parseFloat(v) : v ?? d;
  return Number.isFinite(x as number) ? (x as number) : d;
};
const fmt = (x: number, d = 2): string => {
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
};
const money = (x: number, cur = "$"): string => `${cur}${fmt(x, 2)}`;
const pct = (x: number, d = 2): string => `${fmt(x, d)}%`;

const emi = (P: number, annualRate: number, years: number): number => {
  const r = annualRate / 100 / 12;
  const N = years * 12;
  if (N <= 0) return 0;
  if (r === 0) return P / N;
  const pow = Math.pow(1 + r, N);
  return (P * r * pow) / (pow - 1);
};

const fv = (P: number, annualRate: number, years: number, n_per_year = 1): number => {
  const r = annualRate / 100 / n_per_year;
  return P * Math.pow(1 + r, years * n_per_year);
};

const sipFV = (monthly: number, annualRate: number, years: number): number => {
  const r = annualRate / 100 / 12;
  const N = years * 12;
  if (r === 0) return monthly * N;
  return monthly * ((Math.pow(1 + r, N) - 1) / r) * (1 + r);
};

// =========== curated input presets ===========
const I = {
  amount: (id = "amount", label = "Amount", def = 100000): FinanceInput => ({ id, label, type: "currency", default: def, min: 0 }),
  rate: (id = "rate", label = "Annual Interest Rate", def = 8): FinanceInput => ({ id, label, type: "percent", default: def, step: 0.1, min: 0 }),
  years: (id = "years", label = "Term (years)", def = 5): FinanceInput => ({ id, label, type: "number", unit: "yrs", default: def, min: 0, step: 1 }),
  months: (id = "months", label = "Term (months)", def = 12): FinanceInput => ({ id, label, type: "number", unit: "mo", default: def, min: 0, step: 1 }),
  num: (id: string, label: string, def: number, unit?: string, step = 1): FinanceInput => ({ id, label, type: "number", default: def, unit, step, min: 0 }),
  perc: (id: string, label: string, def: number): FinanceInput => ({ id, label, type: "percent", default: def, step: 0.1 }),
  cur: (id: string, label: string, def: number): FinanceInput => ({ id, label, type: "currency", default: def, min: 0 }),
};

// =========== registry ===========
export const financeCalculators: Record<string, FinanceCalc> = {
  // 1
  "loan-emi": {
    id: "loan-emi",
    formula: "EMI = P × r × (1+r)^n / ((1+r)^n − 1)",
    inputs: [I.amount("principal", "Loan Amount", 500000), I.rate("rate", "Annual Interest Rate", 9), I.years("years", "Tenure (years)", 5)],
    compute: (v) => {
      const P = n(v.principal), r = n(v.rate), y = n(v.years);
      const e = emi(P, r, y);
      const total = e * y * 12;
      return [
        { label: "Monthly EMI", value: money(e), highlight: true },
        { label: "Total Interest", value: money(total - P) },
        { label: "Total Payment", value: money(total) },
      ];
    },
  },
  // 2
  "mortgage-calculator": {
    id: "mortgage-calculator",
    inputs: [I.cur("price", "Home Price", 350000), I.perc("down", "Down Payment %", 20), I.rate("rate", "Mortgage Rate %", 6.5), I.years("years", "Loan Term (years)", 30), I.perc("tax", "Annual Property Tax %", 1.2), I.perc("ins", "Home Insurance %", 0.35)],
    compute: (v) => {
      const price = n(v.price), dp = n(v.down) / 100 * n(v.price);
      const loan = price - dp;
      const e = emi(loan, n(v.rate), n(v.years));
      const taxMo = (price * n(v.tax) / 100) / 12;
      const insMo = (price * n(v.ins) / 100) / 12;
      return [
        { label: "Loan Amount", value: money(loan) },
        { label: "Monthly P&I", value: money(e), highlight: true },
        { label: "Monthly Tax", value: money(taxMo) },
        { label: "Monthly Insurance", value: money(insMo) },
        { label: "Total Monthly (PITI)", value: money(e + taxMo + insMo), highlight: true },
      ];
    },
  },
  // 3-6 specialized loans
  "home-loan-emi": {
    id: "home-loan-emi",
    inputs: [I.cur("principal", "Home Loan Amount", 4000000), I.rate("rate", "Interest Rate %", 8.5), I.years("years", "Tenure (years)", 20)],
    compute: (v) => {
      const e = emi(n(v.principal), n(v.rate), n(v.years));
      return [{ label: "Monthly EMI", value: money(e), highlight: true }, { label: "Total Interest", value: money(e * n(v.years) * 12 - n(v.principal)) }, { label: "Total Repayment", value: money(e * n(v.years) * 12) }];
    },
  },
  "car-loan-emi": {
    id: "car-loan-emi",
    inputs: [I.cur("principal", "Car Loan Amount", 25000), I.rate("rate", "Interest Rate %", 7.5), I.years("years", "Tenure (years)", 5)],
    compute: (v) => {
      const e = emi(n(v.principal), n(v.rate), n(v.years));
      return [{ label: "Monthly EMI", value: money(e), highlight: true }, { label: "Total Interest", value: money(e * n(v.years) * 12 - n(v.principal)) }];
    },
  },
  "personal-loan-emi": {
    id: "personal-loan-emi",
    inputs: [I.cur("principal", "Loan Amount", 10000), I.rate("rate", "Interest Rate %", 12), I.years("years", "Tenure (years)", 3)],
    compute: (v) => {
      const e = emi(n(v.principal), n(v.rate), n(v.years));
      return [{ label: "Monthly EMI", value: money(e), highlight: true }, { label: "Total Interest", value: money(e * n(v.years) * 12 - n(v.principal)) }];
    },
  },
  "student-loan-calculator": {
    id: "student-loan-calculator",
    inputs: [I.cur("principal", "Loan Balance", 30000), I.rate("rate", "Interest Rate %", 5.5), I.years("years", "Repayment Term (years)", 10)],
    compute: (v) => {
      const e = emi(n(v.principal), n(v.rate), n(v.years));
      return [{ label: "Monthly Payment", value: money(e), highlight: true }, { label: "Total Interest", value: money(e * n(v.years) * 12 - n(v.principal)) }];
    },
  },
  // 7-8
  "credit-card-payoff": {
    id: "credit-card-payoff",
    inputs: [I.cur("balance", "Card Balance", 5000), I.rate("apr", "Card APR %", 22), I.cur("payment", "Monthly Payment", 200)],
    compute: (v) => {
      const r = n(v.apr) / 100 / 12, B = n(v.balance), P = n(v.payment);
      if (P <= B * r) return [{ label: "Months to Pay Off", value: "Never — payment too low" }];
      const m = Math.log(P / (P - B * r)) / Math.log(1 + r);
      return [{ label: "Months to Pay Off", value: `${fmt(m, 1)} months`, highlight: true }, { label: "Total Interest", value: money(P * m - B) }];
    },
  },
  "credit-card-min-payment": {
    id: "credit-card-min-payment",
    inputs: [I.cur("balance", "Card Balance", 5000), I.rate("apr", "Card APR %", 22), I.perc("minPct", "Min Payment %", 2)],
    compute: (v) => {
      const min = Math.max(25, n(v.balance) * n(v.minPct) / 100);
      const r = n(v.apr) / 100 / 12;
      if (min <= n(v.balance) * r) return [{ label: "Minimum Payment", value: money(min) }, { label: "Status", value: "Below interest — balance grows" }];
      const m = Math.log(min / (min - n(v.balance) * r)) / Math.log(1 + r);
      return [{ label: "Min Payment", value: money(min), highlight: true }, { label: "Months to Pay Off", value: `${fmt(m, 0)} months` }];
    },
  },
  // 9-10
  "simple-interest": {
    id: "simple-interest",
    formula: "SI = P × R × T / 100",
    inputs: [I.amount("principal", "Principal", 10000), I.rate("rate", "Rate %", 5), I.years("years", "Time (years)", 3)],
    compute: (v) => {
      const si = n(v.principal) * n(v.rate) * n(v.years) / 100;
      return [{ label: "Simple Interest", value: money(si), highlight: true }, { label: "Total Amount", value: money(si + n(v.principal)) }];
    },
  },
  "compound-interest": {
    id: "compound-interest",
    formula: "A = P(1 + r/n)^(nt)",
    inputs: [I.amount("principal", "Principal", 10000), I.rate("rate", "Rate %", 6), I.years("years", "Time (years)", 10), I.num("freq", "Compounds / year", 12)],
    compute: (v) => {
      const A = fv(n(v.principal), n(v.rate), n(v.years), n(v.freq));
      return [{ label: "Future Value", value: money(A), highlight: true }, { label: "Interest Earned", value: money(A - n(v.principal)) }];
    },
  },
  // 11-12
  "apr-calculator": {
    id: "apr-calculator",
    inputs: [I.cur("loan", "Loan Amount", 10000), I.cur("fees", "Loan Fees", 200), I.rate("rate", "Stated Rate %", 6), I.years("years", "Term", 3)],
    compute: (v) => {
      const e = emi(n(v.loan), n(v.rate), n(v.years));
      // approximate APR by solving rate for net = loan - fees
      const net = n(v.loan) - n(v.fees);
      let lo = 0, hi = 1; // monthly
      const N = n(v.years) * 12;
      for (let i = 0; i < 60; i++) {
        const m = (lo + hi) / 2;
        const pmt = m === 0 ? net / N : (net * m * Math.pow(1 + m, N)) / (Math.pow(1 + m, N) - 1);
        if (pmt > e) hi = m; else lo = m;
      }
      const apr = ((lo + hi) / 2) * 12 * 100;
      return [{ label: "Effective APR", value: pct(apr), highlight: true }, { label: "Monthly Payment", value: money(e) }];
    },
  },
  "apy-calculator": {
    id: "apy-calculator",
    formula: "APY = (1 + r/n)^n − 1",
    inputs: [I.rate("apr", "Nominal Rate %", 5), I.num("freq", "Compounds / year", 12)],
    compute: (v) => {
      const apy = (Math.pow(1 + n(v.apr) / 100 / n(v.freq), n(v.freq)) - 1) * 100;
      return [{ label: "APY (Effective Yield)", value: pct(apy), highlight: true }];
    },
  },
  // 13-14
  "cagr-calculator": {
    id: "cagr-calculator",
    formula: "CAGR = (End / Start)^(1/n) − 1",
    inputs: [I.cur("start", "Initial Value", 10000), I.cur("end", "Final Value", 25000), I.years("years", "Years", 5)],
    compute: (v) => {
      const c = (Math.pow(n(v.end) / n(v.start), 1 / n(v.years)) - 1) * 100;
      return [{ label: "CAGR", value: pct(c), highlight: true }, { label: "Total Return", value: pct((n(v.end) / n(v.start) - 1) * 100) }];
    },
  },
  "roi-calculator": {
    id: "roi-calculator",
    formula: "ROI = (Gain − Cost) / Cost × 100",
    inputs: [I.cur("cost", "Investment Cost", 5000), I.cur("gain", "Final Value", 7500)],
    compute: (v) => {
      const roi = (n(v.gain) - n(v.cost)) / n(v.cost) * 100;
      return [{ label: "ROI", value: pct(roi), highlight: true }, { label: "Net Profit", value: money(n(v.gain) - n(v.cost)) }];
    },
  },
  // 15-16
  "irr-calculator": {
    id: "irr-calculator",
    inputs: [I.cur("initial", "Initial Outflow", 10000), I.cur("cf1", "Year 1 Inflow", 3000), I.cur("cf2", "Year 2 Inflow", 4000), I.cur("cf3", "Year 3 Inflow", 5000), I.cur("cf4", "Year 4 Inflow", 0), I.cur("cf5", "Year 5 Inflow", 0)],
    compute: (v) => {
      const cf = [-n(v.initial), n(v.cf1), n(v.cf2), n(v.cf3), n(v.cf4), n(v.cf5)];
      let lo = -0.99, hi = 5;
      for (let i = 0; i < 100; i++) {
        const m = (lo + hi) / 2;
        const npv = cf.reduce((s, c, i) => s + c / Math.pow(1 + m, i), 0);
        if (npv > 0) lo = m; else hi = m;
      }
      return [{ label: "IRR", value: pct(((lo + hi) / 2) * 100), highlight: true }];
    },
  },
  "npv-calculator": {
    id: "npv-calculator",
    inputs: [I.rate("discount", "Discount Rate %", 10), I.cur("initial", "Initial Outflow", 10000), I.cur("cf1", "Year 1", 3000), I.cur("cf2", "Year 2", 4000), I.cur("cf3", "Year 3", 5000), I.cur("cf4", "Year 4", 2000)],
    compute: (v) => {
      const r = n(v.discount) / 100;
      const cf = [n(v.cf1), n(v.cf2), n(v.cf3), n(v.cf4)];
      const npv = cf.reduce((s, c, i) => s + c / Math.pow(1 + r, i + 1), 0) - n(v.initial);
      return [{ label: "Net Present Value", value: money(npv), highlight: true }, { label: "Verdict", value: npv > 0 ? "Accept project" : "Reject project" }];
    },
  },
  // 17-18 deposits
  "fd-calculator": {
    id: "fd-calculator",
    inputs: [I.cur("principal", "Deposit Amount", 100000), I.rate("rate", "Interest Rate %", 7), I.years("years", "Tenure (years)", 5), I.num("freq", "Compounds / year", 4)],
    compute: (v) => {
      const A = fv(n(v.principal), n(v.rate), n(v.years), n(v.freq));
      return [{ label: "Maturity Amount", value: money(A), highlight: true }, { label: "Interest Earned", value: money(A - n(v.principal)) }];
    },
  },
  "rd-calculator": {
    id: "rd-calculator",
    inputs: [I.cur("monthly", "Monthly Deposit", 5000), I.rate("rate", "Interest Rate %", 6.5), I.years("years", "Tenure (years)", 5)],
    compute: (v) => {
      const A = sipFV(n(v.monthly), n(v.rate), n(v.years));
      const invested = n(v.monthly) * n(v.years) * 12;
      return [{ label: "Maturity Value", value: money(A), highlight: true }, { label: "Total Invested", value: money(invested) }, { label: "Interest", value: money(A - invested) }];
    },
  },
  // 19-25 investments
  "ppf-calculator": {
    id: "ppf-calculator",
    inputs: [I.cur("yearly", "Yearly Deposit", 150000), I.rate("rate", "PPF Rate %", 7.1), I.years("years", "Tenure (years)", 15)],
    compute: (v) => {
      let bal = 0; for (let i = 0; i < n(v.years); i++) { bal = (bal + n(v.yearly)) * (1 + n(v.rate) / 100); }
      return [{ label: "Maturity Value", value: money(bal), highlight: true }, { label: "Total Invested", value: money(n(v.yearly) * n(v.years)) }];
    },
  },
  "sip-calculator": {
    id: "sip-calculator",
    inputs: [I.cur("monthly", "Monthly SIP", 5000), I.rate("rate", "Expected Return %", 12), I.years("years", "Years", 10)],
    compute: (v) => {
      const A = sipFV(n(v.monthly), n(v.rate), n(v.years));
      const inv = n(v.monthly) * n(v.years) * 12;
      return [{ label: "Future Value", value: money(A), highlight: true }, { label: "Invested", value: money(inv) }, { label: "Wealth Gain", value: money(A - inv) }];
    },
  },
  "lumpsum-calculator": {
    id: "lumpsum-calculator",
    inputs: [I.cur("amount", "Lumpsum Investment", 100000), I.rate("rate", "Expected Return %", 12), I.years("years", "Years", 10)],
    compute: (v) => {
      const A = fv(n(v.amount), n(v.rate), n(v.years), 1);
      return [{ label: "Future Value", value: money(A), highlight: true }, { label: "Gain", value: money(A - n(v.amount)) }];
    },
  },
  "mutual-fund-returns": {
    id: "mutual-fund-returns",
    inputs: [I.cur("amount", "Invested", 50000), I.cur("nav_buy", "Buy NAV", 100), I.cur("nav_sell", "Current NAV", 145)],
    compute: (v) => {
      const units = n(v.amount) / n(v.nav_buy);
      const cur = units * n(v.nav_sell);
      return [{ label: "Units Held", value: fmt(units, 3) }, { label: "Current Value", value: money(cur), highlight: true }, { label: "Profit/Loss", value: money(cur - n(v.amount)) }];
    },
  },
  "swp-calculator": {
    id: "swp-calculator",
    inputs: [I.cur("corpus", "Initial Corpus", 1000000), I.cur("monthly", "Monthly Withdrawal", 10000), I.rate("rate", "Expected Return %", 8), I.years("years", "Years", 10)],
    compute: (v) => {
      let bal = n(v.corpus); const r = n(v.rate) / 100 / 12; const N = n(v.years) * 12;
      for (let i = 0; i < N; i++) { bal = bal * (1 + r) - n(v.monthly); if (bal < 0) { bal = 0; break; } }
      return [{ label: "Remaining Corpus", value: money(bal), highlight: true }, { label: "Total Withdrawn", value: money(n(v.monthly) * N) }];
    },
  },
  "step-up-sip": {
    id: "step-up-sip",
    inputs: [I.cur("monthly", "Initial Monthly SIP", 5000), I.perc("stepup", "Yearly Step-up %", 10), I.rate("rate", "Return %", 12), I.years("years", "Years", 15)],
    compute: (v) => {
      const r = n(v.rate) / 100 / 12; let fvSum = 0; let m = n(v.monthly); let inv = 0;
      for (let y = 0; y < n(v.years); y++) {
        for (let mo = 0; mo < 12; mo++) { fvSum = fvSum * (1 + r) + m; inv += m; }
        m *= 1 + n(v.stepup) / 100;
      }
      return [{ label: "Future Value", value: money(fvSum), highlight: true }, { label: "Invested", value: money(inv) }, { label: "Gain", value: money(fvSum - inv) }];
    },
  },
  "nps-calculator": {
    id: "nps-calculator",
    inputs: [I.cur("monthly", "Monthly Contribution", 5000), I.rate("rate", "Expected Return %", 10), I.num("age", "Current Age", 30), I.num("retire", "Retirement Age", 60), I.perc("annuity", "Annuity %", 40), I.rate("annuityRate", "Annuity Return %", 6)],
    compute: (v) => {
      const yrs = n(v.retire) - n(v.age);
      const A = sipFV(n(v.monthly), n(v.rate), yrs);
      const annuity = A * n(v.annuity) / 100;
      const lump = A - annuity;
      const pension = (annuity * n(v.annuityRate) / 100) / 12;
      return [{ label: "Corpus at Retirement", value: money(A), highlight: true }, { label: "Lumpsum", value: money(lump) }, { label: "Monthly Pension", value: money(pension), highlight: true }];
    },
  },
  // 26-29
  "epf-calculator": {
    id: "epf-calculator",
    inputs: [I.cur("salary", "Monthly Basic+DA", 30000), I.perc("contrib", "Your Contribution %", 12), I.perc("emp", "Employer %", 12), I.rate("rate", "EPF Rate %", 8.25), I.perc("hike", "Yearly Hike %", 5), I.num("years", "Years to Retire", 30)],
    compute: (v) => {
      let bal = 0; let s = n(v.salary);
      for (let y = 0; y < n(v.years); y++) {
        for (let m = 0; m < 12; m++) bal = bal * (1 + n(v.rate) / 100 / 12) + s * (n(v.contrib) + n(v.emp)) / 100;
        s *= 1 + n(v.hike) / 100;
      }
      return [{ label: "EPF Maturity", value: money(bal), highlight: true }];
    },
  },
  "gratuity-calculator": {
    id: "gratuity-calculator",
    formula: "Gratuity = (Last Salary × 15 × Years) / 26",
    inputs: [I.cur("salary", "Last Drawn Basic+DA", 50000), I.num("years", "Years of Service", 10)],
    compute: (v) => [{ label: "Gratuity", value: money(n(v.salary) * 15 * n(v.years) / 26), highlight: true }],
  },
  "retirement-corpus": {
    id: "retirement-corpus",
    inputs: [I.cur("expense", "Current Monthly Expense", 50000), I.num("age", "Current Age", 30), I.num("retire", "Retirement Age", 60), I.num("life", "Life Expectancy", 85), I.rate("inflation", "Inflation %", 6), I.rate("postRet", "Post-retirement Return %", 7)],
    compute: (v) => {
      const yrs = n(v.retire) - n(v.age);
      const futureMonthly = n(v.expense) * Math.pow(1 + n(v.inflation) / 100, yrs);
      const postYrs = n(v.life) - n(v.retire);
      // real return after inflation, annuity due
      const realR = (1 + n(v.postRet) / 100) / (1 + n(v.inflation) / 100) - 1;
      const r = realR / 12; const N = postYrs * 12;
      const corpus = futureMonthly * (1 - Math.pow(1 + r, -N)) / r;
      return [{ label: "Inflated Monthly Need", value: money(futureMonthly) }, { label: "Required Corpus", value: money(corpus), highlight: true }];
    },
  },
  "inflation-calculator": {
    id: "inflation-calculator",
    inputs: [I.cur("amount", "Today's Amount", 100000), I.rate("inflation", "Inflation %", 6), I.years("years", "Years Ahead", 10)],
    compute: (v) => {
      const future = n(v.amount) * Math.pow(1 + n(v.inflation) / 100, n(v.years));
      const value = n(v.amount) / Math.pow(1 + n(v.inflation) / 100, n(v.years));
      return [{ label: "Future Cost", value: money(future), highlight: true }, { label: "Future Buying Power of Today's Amount", value: money(value) }];
    },
  },
  // 30-33 TVM
  "future-value": {
    id: "future-value",
    inputs: [I.cur("pv", "Present Value", 10000), I.rate("rate", "Rate %", 6), I.years("years", "Years", 10)],
    compute: (v) => [{ label: "Future Value", value: money(fv(n(v.pv), n(v.rate), n(v.years), 1)), highlight: true }],
  },
  "present-value": {
    id: "present-value",
    inputs: [I.cur("fv", "Future Value", 20000), I.rate("rate", "Discount Rate %", 6), I.years("years", "Years", 10)],
    compute: (v) => [{ label: "Present Value", value: money(n(v.fv) / Math.pow(1 + n(v.rate) / 100, n(v.years))), highlight: true }],
  },
  "annuity-calculator": {
    id: "annuity-calculator",
    inputs: [I.cur("pmt", "Periodic Payment", 1000), I.rate("rate", "Rate %", 5), I.years("years", "Years", 20)],
    compute: (v) => {
      const r = n(v.rate) / 100; const N = n(v.years);
      const PV = n(v.pmt) * (1 - Math.pow(1 + r, -N)) / r;
      const FV = n(v.pmt) * (Math.pow(1 + r, N) - 1) / r;
      return [{ label: "Present Value", value: money(PV), highlight: true }, { label: "Future Value", value: money(FV), highlight: true }];
    },
  },
  "perpetuity-calculator": {
    id: "perpetuity-calculator",
    formula: "PV = C / r",
    inputs: [I.cur("c", "Annual Cash Flow", 1000), I.rate("rate", "Discount Rate %", 5)],
    compute: (v) => [{ label: "Perpetuity PV", value: money(n(v.c) / (n(v.rate) / 100)), highlight: true }],
  },
  // 34-37 bonds
  "bond-price": {
    id: "bond-price",
    inputs: [I.cur("face", "Face Value", 1000), I.perc("coupon", "Coupon Rate %", 6), I.rate("ytm", "YTM %", 5), I.years("years", "Years to Maturity", 10), I.num("freq", "Coupons / yr", 2)],
    compute: (v) => {
      const c = n(v.face) * n(v.coupon) / 100 / n(v.freq);
      const y = n(v.ytm) / 100 / n(v.freq);
      const N = n(v.years) * n(v.freq);
      const price = c * (1 - Math.pow(1 + y, -N)) / y + n(v.face) / Math.pow(1 + y, N);
      return [{ label: "Bond Price", value: money(price), highlight: true }];
    },
  },
  "bond-yield": {
    id: "bond-yield",
    inputs: [I.cur("face", "Face Value", 1000), I.cur("price", "Current Price", 950), I.perc("coupon", "Coupon Rate %", 6)],
    compute: (v) => [{ label: "Current Yield", value: pct(n(v.face) * n(v.coupon) / n(v.price)), highlight: true }],
  },
  "ytm-calculator": {
    id: "ytm-calculator",
    inputs: [I.cur("face", "Face Value", 1000), I.cur("price", "Current Price", 950), I.perc("coupon", "Coupon %", 6), I.years("years", "Years to Maturity", 5)],
    compute: (v) => {
      const C = n(v.face) * n(v.coupon) / 100;
      const ytm = (C + (n(v.face) - n(v.price)) / n(v.years)) / ((n(v.face) + n(v.price)) / 2) * 100;
      return [{ label: "YTM (approx)", value: pct(ytm), highlight: true }];
    },
  },
  "dividend-yield": {
    id: "dividend-yield",
    inputs: [I.cur("dps", "Annual Dividend / Share", 2.5), I.cur("price", "Share Price", 50)],
    compute: (v) => [{ label: "Dividend Yield", value: pct(n(v.dps) / n(v.price) * 100), highlight: true }],
  },
  // 38-46 stocks
  "dividend-discount-model": {
    id: "dividend-discount-model",
    formula: "P = D1 / (r − g)",
    inputs: [I.cur("d1", "Next Dividend (D1)", 2), I.rate("r", "Required Return %", 10), I.rate("g", "Growth Rate %", 5)],
    compute: (v) => {
      const price = n(v.d1) / ((n(v.r) - n(v.g)) / 100);
      return [{ label: "Fair Price", value: money(price), highlight: true }];
    },
  },
  "stock-profit": {
    id: "stock-profit",
    inputs: [I.cur("buy", "Buy Price", 100), I.cur("sell", "Sell Price", 150), I.num("qty", "Quantity", 10), I.perc("fees", "Total Fees %", 0.3)],
    compute: (v) => {
      const cost = n(v.buy) * n(v.qty); const proceeds = n(v.sell) * n(v.qty);
      const fees = (cost + proceeds) * n(v.fees) / 100;
      const pnl = proceeds - cost - fees;
      return [{ label: "Profit / Loss", value: money(pnl), highlight: true }, { label: "Return", value: pct(pnl / cost * 100) }];
    },
  },
  "stock-average": {
    id: "stock-average",
    inputs: [I.cur("p1", "Buy Price 1", 100), I.num("q1", "Qty 1", 10), I.cur("p2", "Buy Price 2", 80), I.num("q2", "Qty 2", 10)],
    compute: (v) => {
      const avg = (n(v.p1) * n(v.q1) + n(v.p2) * n(v.q2)) / (n(v.q1) + n(v.q2));
      return [{ label: "Average Cost", value: money(avg), highlight: true }, { label: "Total Qty", value: fmt(n(v.q1) + n(v.q2), 0) }];
    },
  },
  "stock-target-price": {
    id: "stock-target-price",
    inputs: [I.cur("eps", "Forward EPS", 5), I.num("pe", "Target P/E", 20)],
    compute: (v) => [{ label: "Target Price", value: money(n(v.eps) * n(v.pe)), highlight: true }],
  },
  "pe-ratio": {
    id: "pe-ratio",
    inputs: [I.cur("price", "Share Price", 100), I.cur("eps", "EPS", 5)],
    compute: (v) => [{ label: "P/E Ratio", value: fmt(n(v.price) / n(v.eps), 2), highlight: true }],
  },
  "pb-ratio": {
    id: "pb-ratio",
    inputs: [I.cur("price", "Share Price", 100), I.cur("bvps", "Book Value / Share", 40)],
    compute: (v) => [{ label: "P/B Ratio", value: fmt(n(v.price) / n(v.bvps), 2), highlight: true }],
  },
  "eps-calculator": {
    id: "eps-calculator",
    inputs: [I.cur("netIncome", "Net Income", 5000000), I.cur("dividend", "Preferred Dividends", 0), I.num("shares", "Shares Outstanding", 1000000)],
    compute: (v) => [{ label: "EPS", value: money((n(v.netIncome) - n(v.dividend)) / n(v.shares)), highlight: true }],
  },
  "market-cap": {
    id: "market-cap",
    inputs: [I.cur("price", "Share Price", 100), I.num("shares", "Shares Outstanding", 1000000)],
    compute: (v) => [{ label: "Market Cap", value: money(n(v.price) * n(v.shares)), highlight: true }],
  },
  "book-value": {
    id: "book-value",
    inputs: [I.cur("assets", "Total Assets", 1000000), I.cur("liab", "Total Liabilities", 600000), I.num("shares", "Shares Outstanding", 50000)],
    compute: (v) => [{ label: "Book Value / Share", value: money((n(v.assets) - n(v.liab)) / n(v.shares)), highlight: true }],
  },
  // 47-53 financial ratios
  "debt-to-equity": {
    id: "debt-to-equity",
    inputs: [I.cur("debt", "Total Debt", 500000), I.cur("equity", "Total Equity", 700000)],
    compute: (v) => [{ label: "D/E Ratio", value: fmt(n(v.debt) / n(v.equity), 2), highlight: true }],
  },
  "current-ratio": {
    id: "current-ratio",
    inputs: [I.cur("ca", "Current Assets", 200000), I.cur("cl", "Current Liabilities", 100000)],
    compute: (v) => [{ label: "Current Ratio", value: fmt(n(v.ca) / n(v.cl), 2), highlight: true }],
  },
  "quick-ratio": {
    id: "quick-ratio",
    inputs: [I.cur("ca", "Current Assets", 200000), I.cur("inv", "Inventory", 50000), I.cur("cl", "Current Liabilities", 100000)],
    compute: (v) => [{ label: "Quick Ratio", value: fmt((n(v.ca) - n(v.inv)) / n(v.cl), 2), highlight: true }],
  },
  "working-capital": {
    id: "working-capital",
    inputs: [I.cur("ca", "Current Assets", 200000), I.cur("cl", "Current Liabilities", 100000)],
    compute: (v) => [{ label: "Working Capital", value: money(n(v.ca) - n(v.cl)), highlight: true }],
  },
  "gross-margin": {
    id: "gross-margin",
    inputs: [I.cur("rev", "Revenue", 1000000), I.cur("cogs", "COGS", 600000)],
    compute: (v) => [{ label: "Gross Margin", value: pct((n(v.rev) - n(v.cogs)) / n(v.rev) * 100), highlight: true }],
  },
  "operating-margin": {
    id: "operating-margin",
    inputs: [I.cur("op", "Operating Income", 200000), I.cur("rev", "Revenue", 1000000)],
    compute: (v) => [{ label: "Operating Margin", value: pct(n(v.op) / n(v.rev) * 100), highlight: true }],
  },
  "net-margin": {
    id: "net-margin",
    inputs: [I.cur("ni", "Net Income", 100000), I.cur("rev", "Revenue", 1000000)],
    compute: (v) => [{ label: "Net Margin", value: pct(n(v.ni) / n(v.rev) * 100), highlight: true }],
  },
  // 54-60 business
  "break-even": {
    id: "break-even",
    formula: "BE = Fixed / (Price − Variable)",
    inputs: [I.cur("fixed", "Fixed Costs", 50000), I.cur("price", "Price / Unit", 50), I.cur("variable", "Variable Cost / Unit", 30)],
    compute: (v) => {
      const units = n(v.fixed) / (n(v.price) - n(v.variable));
      return [{ label: "Break-even Units", value: fmt(units, 0), highlight: true }, { label: "Break-even Revenue", value: money(units * n(v.price)) }];
    },
  },
  "markup-calculator": {
    id: "markup-calculator",
    inputs: [I.cur("cost", "Cost", 80), I.perc("markup", "Markup %", 25)],
    compute: (v) => {
      const sp = n(v.cost) * (1 + n(v.markup) / 100);
      return [{ label: "Selling Price", value: money(sp), highlight: true }, { label: "Profit", value: money(sp - n(v.cost)) }];
    },
  },
  "discount-calculator": {
    id: "discount-calculator",
    inputs: [I.cur("price", "Original Price", 100), I.perc("discount", "Discount %", 20)],
    compute: (v) => {
      const save = n(v.price) * n(v.discount) / 100;
      return [{ label: "You Save", value: money(save), highlight: true }, { label: "Final Price", value: money(n(v.price) - save), highlight: true }];
    },
  },
  "tip-calculator": {
    id: "tip-calculator",
    inputs: [I.cur("bill", "Bill Amount", 50), I.perc("tip", "Tip %", 15), I.num("people", "Split among", 2)],
    compute: (v) => {
      const tip = n(v.bill) * n(v.tip) / 100; const total = n(v.bill) + tip;
      return [{ label: "Tip", value: money(tip) }, { label: "Total", value: money(total), highlight: true }, { label: "Per Person", value: money(total / n(v.people)), highlight: true }];
    },
  },
  "sales-tax": {
    id: "sales-tax",
    inputs: [I.cur("amount", "Amount", 100), I.perc("rate", "Sales Tax %", 8)],
    compute: (v) => {
      const tax = n(v.amount) * n(v.rate) / 100;
      return [{ label: "Tax", value: money(tax) }, { label: "Total", value: money(n(v.amount) + tax), highlight: true }];
    },
  },
  "vat-calculator": {
    id: "vat-calculator",
    inputs: [I.cur("amount", "Net Amount", 100), I.perc("rate", "VAT %", 20)],
    compute: (v) => {
      const vat = n(v.amount) * n(v.rate) / 100;
      return [{ label: "VAT", value: money(vat) }, { label: "Gross", value: money(n(v.amount) + vat), highlight: true }];
    },
  },
  "gst-calculator": {
    id: "gst-calculator",
    inputs: [I.cur("amount", "Amount", 1000), I.perc("rate", "GST %", 18), { id: "mode", label: "Mode", type: "select", default: "add", options: [{ value: "add", label: "Add GST" }, { value: "remove", label: "Remove GST" }] }],
    compute: (v) => {
      const r = n(v.rate) / 100;
      if (v.mode === "remove") {
        const base = n(v.amount) / (1 + r);
        return [{ label: "Base", value: money(base) }, { label: "GST", value: money(n(v.amount) - base), highlight: true }];
      }
      const tax = n(v.amount) * r;
      return [{ label: "GST", value: money(tax) }, { label: "Total", value: money(n(v.amount) + tax), highlight: true }];
    },
  },
  // 61-63 income tax
  "income-tax-india": {
    id: "income-tax-india",
    inputs: [I.cur("income", "Annual Income (FY24-25)", 1200000)],
    compute: (v) => {
      const inc = n(v.income); let tax = 0;
      const slabs: [number, number][] = [[300000, 0], [600000, 5], [900000, 10], [1200000, 15], [1500000, 20], [Infinity, 30]];
      let prev = 0;
      for (const [up, rate] of slabs) {
        if (inc > up) { tax += (up - prev) * rate / 100; prev = up; } else { tax += (inc - prev) * rate / 100; break; }
      }
      const cess = tax * 0.04;
      return [{ label: "Income Tax", value: money(tax) }, { label: "Health & Edu Cess (4%)", value: money(cess) }, { label: "Total Tax (New Regime)", value: money(tax + cess), highlight: true }];
    },
  },
  "income-tax-us": {
    id: "income-tax-us",
    inputs: [I.cur("income", "Taxable Income (Single, 2024)", 80000)],
    compute: (v) => {
      const inc = n(v.income); let tax = 0;
      const slabs: [number, number][] = [[11600, 10], [47150, 12], [100525, 22], [191950, 24], [243725, 32], [609350, 35], [Infinity, 37]];
      let prev = 0;
      for (const [up, rate] of slabs) {
        if (inc > up) { tax += (up - prev) * rate / 100; prev = up; } else { tax += (inc - prev) * rate / 100; break; }
      }
      return [{ label: "Federal Tax", value: money(tax), highlight: true }, { label: "Effective Rate", value: pct(tax / inc * 100) }];
    },
  },
  "capital-gains-tax": {
    id: "capital-gains-tax",
    inputs: [I.cur("buy", "Buy Price", 1000), I.cur("sell", "Sell Price", 1500), I.num("qty", "Quantity", 100), I.perc("rate", "Tax Rate %", 15)],
    compute: (v) => {
      const gain = (n(v.sell) - n(v.buy)) * n(v.qty);
      const tax = Math.max(0, gain) * n(v.rate) / 100;
      return [{ label: "Capital Gain", value: money(gain) }, { label: "Tax Due", value: money(tax), highlight: true }, { label: "Net", value: money(gain - tax) }];
    },
  },
  // 64-72 salary / payroll
  "paycheck-calculator": {
    id: "paycheck-calculator",
    inputs: [I.cur("gross", "Gross Pay (period)", 3000), I.perc("fed", "Federal Tax %", 12), I.perc("state", "State Tax %", 5), I.perc("fica", "FICA %", 7.65), I.cur("other", "Other Deductions", 100)],
    compute: (v) => {
      const ded = n(v.gross) * (n(v.fed) + n(v.state) + n(v.fica)) / 100 + n(v.other);
      return [{ label: "Total Deductions", value: money(ded) }, { label: "Net Pay", value: money(n(v.gross) - ded), highlight: true }];
    },
  },
  "salary-hike": {
    id: "salary-hike",
    inputs: [I.cur("old", "Current Salary", 50000), I.cur("new", "New Salary", 60000)],
    compute: (v) => [{ label: "Hike %", value: pct((n(v.new) - n(v.old)) / n(v.old) * 100), highlight: true }, { label: "Increase", value: money(n(v.new) - n(v.old)) }],
  },
  "hourly-to-salary": {
    id: "hourly-to-salary",
    inputs: [I.cur("rate", "Hourly Rate", 25), I.num("hours", "Hours / Week", 40), I.num("weeks", "Weeks / Year", 52)],
    compute: (v) => [{ label: "Annual Salary", value: money(n(v.rate) * n(v.hours) * n(v.weeks)), highlight: true }],
  },
  "salary-to-hourly": {
    id: "salary-to-hourly",
    inputs: [I.cur("salary", "Annual Salary", 50000), I.num("hours", "Hours / Week", 40), I.num("weeks", "Weeks / Year", 52)],
    compute: (v) => [{ label: "Hourly Rate", value: money(n(v.salary) / (n(v.hours) * n(v.weeks))), highlight: true }],
  },
  "overtime-pay": {
    id: "overtime-pay",
    inputs: [I.cur("rate", "Hourly Rate", 20), I.num("hours", "Overtime Hours", 10), I.perc("mult", "Multiplier %", 150)],
    compute: (v) => [{ label: "OT Pay", value: money(n(v.rate) * n(v.hours) * n(v.mult) / 100), highlight: true }],
  },
  "take-home-salary": {
    id: "take-home-salary",
    inputs: [I.cur("ctc", "CTC", 1200000), I.perc("pf", "PF %", 12), I.perc("tax", "Income Tax %", 10), I.perc("prof", "Prof Tax %", 0.2)],
    compute: (v) => {
      const ded = n(v.ctc) * (n(v.pf) + n(v.tax) + n(v.prof)) / 100;
      return [{ label: "Annual Take-Home", value: money(n(v.ctc) - ded), highlight: true }, { label: "Monthly", value: money((n(v.ctc) - ded) / 12), highlight: true }];
    },
  },
  "tax-bracket-us": {
    id: "tax-bracket-us",
    inputs: [I.cur("income", "Taxable Income (Single 2024)", 80000)],
    compute: (v) => {
      const inc = n(v.income);
      const brackets: [number, number][] = [[11600, 10], [47150, 12], [100525, 22], [191950, 24], [243725, 32], [609350, 35], [Infinity, 37]];
      let bracket = 10; for (const [up, r] of brackets) { if (inc <= up) { bracket = r; break; } }
      return [{ label: "Marginal Bracket", value: pct(bracket, 0), highlight: true }];
    },
  },
  "social-security-tax": {
    id: "social-security-tax",
    inputs: [I.cur("wage", "Wage", 60000)],
    compute: (v) => {
      const cap = Math.min(n(v.wage), 168600); // 2024
      return [{ label: "SS Tax (6.2%)", value: money(cap * 0.062), highlight: true }];
    },
  },
  "medicare-tax": {
    id: "medicare-tax",
    inputs: [I.cur("wage", "Wage", 60000)],
    compute: (v) => {
      const base = n(v.wage) * 0.0145;
      const extra = n(v.wage) > 200000 ? (n(v.wage) - 200000) * 0.009 : 0;
      return [{ label: "Medicare Tax", value: money(base + extra), highlight: true }];
    },
  },
  "fica-calculator": {
    id: "fica-calculator",
    inputs: [I.cur("wage", "Wage", 60000)],
    compute: (v) => {
      const ss = Math.min(n(v.wage), 168600) * 0.062;
      const med = n(v.wage) * 0.0145;
      return [{ label: "Social Security", value: money(ss) }, { label: "Medicare", value: money(med) }, { label: "Total FICA", value: money(ss + med), highlight: true }];
    },
  },
  "self-employment-tax": {
    id: "self-employment-tax",
    inputs: [I.cur("net", "Net SE Income", 50000)],
    compute: (v) => {
      const taxable = n(v.net) * 0.9235;
      const tax = taxable * 0.153;
      return [{ label: "SE Tax (15.3%)", value: money(tax), highlight: true }];
    },
  },
  "property-tax": {
    id: "property-tax",
    inputs: [I.cur("value", "Property Value", 350000), I.perc("rate", "Tax Rate %", 1.2)],
    compute: (v) => [{ label: "Annual Property Tax", value: money(n(v.value) * n(v.rate) / 100), highlight: true }],
  },
  // 76-80 real estate
  "rent-vs-buy": {
    id: "rent-vs-buy",
    inputs: [I.cur("rent", "Monthly Rent", 1500), I.cur("price", "Home Price", 350000), I.perc("down", "Down %", 20), I.rate("mortRate", "Mortgage Rate %", 6.5), I.years("years", "Years", 30)],
    compute: (v) => {
      const loan = n(v.price) * (1 - n(v.down) / 100);
      const e = emi(loan, n(v.mortRate), n(v.years));
      const diff = e - n(v.rent);
      return [{ label: "Mortgage Payment", value: money(e) }, { label: "Monthly Difference", value: money(diff) }, { label: "Verdict", value: diff > 0 ? "Renting is cheaper now" : "Buying is cheaper now", highlight: true }];
    },
  },
  "rental-yield": {
    id: "rental-yield",
    inputs: [I.cur("rent", "Annual Rent", 18000), I.cur("price", "Property Value", 300000)],
    compute: (v) => [{ label: "Gross Rental Yield", value: pct(n(v.rent) / n(v.price) * 100), highlight: true }],
  },
  "cap-rate": {
    id: "cap-rate",
    inputs: [I.cur("noi", "Net Operating Income", 25000), I.cur("price", "Property Value", 300000)],
    compute: (v) => [{ label: "Cap Rate", value: pct(n(v.noi) / n(v.price) * 100), highlight: true }],
  },
  "cash-on-cash-return": {
    id: "cash-on-cash-return",
    inputs: [I.cur("cf", "Annual Cash Flow", 6000), I.cur("invested", "Cash Invested", 60000)],
    compute: (v) => [{ label: "Cash-on-Cash Return", value: pct(n(v.cf) / n(v.invested) * 100), highlight: true }],
  },
  "gross-rent-multiplier": {
    id: "gross-rent-multiplier",
    inputs: [I.cur("price", "Property Value", 300000), I.cur("rent", "Annual Rent", 24000)],
    compute: (v) => [{ label: "GRM", value: fmt(n(v.price) / n(v.rent), 2), highlight: true }],
  },
  // 81-86 loans / debt
  "mortgage-refinance": {
    id: "mortgage-refinance",
    inputs: [I.cur("balance", "Current Balance", 200000), I.rate("oldRate", "Current Rate %", 7), I.rate("newRate", "New Rate %", 5.5), I.years("years", "Remaining Years", 25), I.cur("closing", "Closing Costs", 4000)],
    compute: (v) => {
      const oldP = emi(n(v.balance), n(v.oldRate), n(v.years));
      const newP = emi(n(v.balance), n(v.newRate), n(v.years));
      const save = oldP - newP;
      const breakEven = n(v.closing) / save;
      return [{ label: "Old Payment", value: money(oldP) }, { label: "New Payment", value: money(newP) }, { label: "Monthly Save", value: money(save), highlight: true }, { label: "Break-even", value: `${fmt(breakEven, 1)} months` }];
    },
  },
  "loan-prepayment": {
    id: "loan-prepayment",
    inputs: [I.cur("principal", "Loan Amount", 200000), I.rate("rate", "Rate %", 7), I.years("years", "Tenure", 20), I.cur("extra", "Extra Monthly", 200)],
    compute: (v) => {
      const r = n(v.rate) / 100 / 12; const N = n(v.years) * 12;
      const base = emi(n(v.principal), n(v.rate), n(v.years));
      const pay = base + n(v.extra);
      let bal = n(v.principal); let months = 0;
      while (bal > 0 && months < N * 2) { bal = bal * (1 + r) - pay; months++; if (bal < 0) bal = 0; }
      return [{ label: "New Payoff", value: `${months} mo (${fmt(months / 12, 1)} yrs)`, highlight: true }, { label: "Months Saved", value: `${N - months} months` }];
    },
  },
  "loan-amortization": {
    id: "loan-amortization",
    inputs: [I.cur("principal", "Loan Amount", 200000), I.rate("rate", "Rate %", 6.5), I.years("years", "Tenure", 30)],
    compute: (v) => {
      const e = emi(n(v.principal), n(v.rate), n(v.years));
      const r = n(v.rate) / 100 / 12; const interestY1 = (() => { let bal = n(v.principal); let int = 0; for (let i = 0; i < 12; i++) { const ii = bal * r; int += ii; bal = bal - (e - ii); } return int; })();
      return [{ label: "EMI", value: money(e), highlight: true }, { label: "Year-1 Interest", value: money(interestY1) }, { label: "Total Interest", value: money(e * n(v.years) * 12 - n(v.principal)) }];
    },
  },
  "debt-snowball": {
    id: "debt-snowball",
    inputs: [I.cur("d1", "Debt 1 Balance", 1000), I.cur("d2", "Debt 2 Balance", 5000), I.cur("d3", "Debt 3 Balance", 15000), I.cur("extra", "Extra / Month", 200)],
    compute: () => [{ label: "Strategy", value: "Pay min on all, kill smallest first" }, { label: "Order", value: "Debt 1 → 2 → 3 (Smallest → Largest)", highlight: true }],
  },
  "debt-avalanche": {
    id: "debt-avalanche",
    inputs: [I.cur("d1", "Debt 1 Balance", 5000), I.perc("r1", "APR 1 %", 22), I.cur("d2", "Debt 2", 10000), I.perc("r2", "APR 2 %", 7), I.cur("d3", "Debt 3", 20000), I.perc("r3", "APR 3 %", 4)],
    compute: (v) => {
      const arr = [{ i: 1, r: n(v.r1) }, { i: 2, r: n(v.r2) }, { i: 3, r: n(v.r3) }].sort((a, b) => b.r - a.r);
      return [{ label: "Payoff Order", value: arr.map(x => `Debt ${x.i}`).join(" → "), highlight: true }, { label: "Strategy", value: "Pay min on all, kill highest-APR first" }];
    },
  },
  "debt-to-income": {
    id: "debt-to-income",
    inputs: [I.cur("debt", "Monthly Debt Payments", 1500), I.cur("income", "Monthly Gross Income", 5000)],
    compute: (v) => {
      const r = n(v.debt) / n(v.income) * 100;
      return [{ label: "DTI Ratio", value: pct(r), highlight: true }, { label: "Verdict", value: r < 36 ? "Healthy" : r < 43 ? "Manageable" : "High — lenders cautious" }];
    },
  },
  // 87-91 wealth goals
  "savings-goal": {
    id: "savings-goal",
    inputs: [I.cur("goal", "Goal", 100000), I.cur("current", "Current Savings", 10000), I.rate("rate", "Return %", 6), I.num("months", "Months", 60)],
    compute: (v) => {
      const r = n(v.rate) / 100 / 12; const N = n(v.months);
      const fvCur = n(v.current) * Math.pow(1 + r, N);
      const need = n(v.goal) - fvCur;
      const pmt = r === 0 ? need / N : need * r / (Math.pow(1 + r, N) - 1);
      return [{ label: "Monthly Saving Needed", value: money(Math.max(0, pmt)), highlight: true }];
    },
  },
  "emergency-fund": {
    id: "emergency-fund",
    inputs: [I.cur("expense", "Monthly Expense", 3000), I.num("months", "Months of Cover", 6)],
    compute: (v) => [{ label: "Emergency Fund Target", value: money(n(v.expense) * n(v.months)), highlight: true }],
  },
  "millionaire-calculator": {
    id: "millionaire-calculator",
    inputs: [I.cur("current", "Current Savings", 10000), I.cur("monthly", "Monthly Saving", 500), I.rate("rate", "Return %", 8), I.cur("goal", "Goal", 1000000)],
    compute: (v) => {
      const r = n(v.rate) / 100 / 12;
      let bal = n(v.current); let m = 0;
      while (bal < n(v.goal) && m < 1200) { bal = bal * (1 + r) + n(v.monthly); m++; }
      return [{ label: "Years to Goal", value: `${fmt(m / 12, 1)} years`, highlight: true }, { label: "Months", value: `${m}` }];
    },
  },
  "coast-fire": {
    id: "coast-fire",
    inputs: [I.cur("expense", "Annual Expense at Retirement", 40000), I.num("age", "Current Age", 30), I.num("retire", "Retire Age", 65), I.rate("rate", "Return %", 7)],
    compute: (v) => {
      const target = n(v.expense) * 25; // 4% rule
      const need = target / Math.pow(1 + n(v.rate) / 100, n(v.retire) - n(v.age));
      return [{ label: "FI Number (25×)", value: money(target) }, { label: "Coast FIRE Today", value: money(need), highlight: true }];
    },
  },
  "fire-number": {
    id: "fire-number",
    inputs: [I.cur("expense", "Annual Expenses", 40000), I.perc("swr", "Safe Withdrawal %", 4)],
    compute: (v) => [{ label: "FIRE Number", value: money(n(v.expense) / (n(v.swr) / 100)), highlight: true }],
  },
  // 92-95 currency / crypto
  "currency-converter": {
    id: "currency-converter",
    inputs: [I.cur("amount", "Amount", 100), { id: "rate", label: "Exchange Rate (1 from = X to)", type: "number", default: 1.08, step: 0.0001 }],
    compute: (v) => [{ label: "Converted", value: fmt(n(v.amount) * n(v.rate), 4), highlight: true }],
  },
  "currency-strength": {
    id: "currency-strength",
    inputs: [{ id: "old", label: "Old Rate", type: "number", default: 1.10, step: 0.0001 }, { id: "new", label: "New Rate", type: "number", default: 1.05, step: 0.0001 }],
    compute: (v) => {
      const pctChg = (n(v.new) - n(v.old)) / n(v.old) * 100;
      return [{ label: "Change", value: pct(pctChg), highlight: true }, { label: "Trend", value: pctChg > 0 ? "Strengthened" : "Weakened" }];
    },
  },
  "cryptocurrency-profit": {
    id: "cryptocurrency-profit",
    inputs: [I.cur("buy", "Buy Price (USD)", 30000), I.cur("sell", "Sell Price (USD)", 45000), { id: "qty", label: "Quantity", type: "number", default: 0.5, step: 0.0001 }, I.perc("fee", "Total Fee %", 0.5)],
    compute: (v) => {
      const cost = n(v.buy) * n(v.qty); const proc = n(v.sell) * n(v.qty);
      const fee = (cost + proc) * n(v.fee) / 100;
      const pnl = proc - cost - fee;
      return [{ label: "Profit / Loss", value: money(pnl), highlight: true }, { label: "Return", value: pct(pnl / cost * 100) }];
    },
  },
  "crypto-staking-rewards": {
    id: "crypto-staking-rewards",
    inputs: [{ id: "amount", label: "Coins Staked", type: "number", default: 100, step: 0.01 }, I.perc("apy", "Staking APY %", 5), I.num("days", "Days", 365)],
    compute: (v) => {
      const r = n(v.apy) / 100 / 365;
      const reward = n(v.amount) * (Math.pow(1 + r, n(v.days)) - 1);
      return [{ label: "Rewards Earned", value: fmt(reward, 6), highlight: true }, { label: "Total Holdings", value: fmt(n(v.amount) + reward, 6) }];
    },
  },
  // 96-100 misc
  "tax-deduction": {
    id: "tax-deduction",
    inputs: [I.cur("income", "Taxable Income", 80000), I.cur("deduction", "Deduction Amount", 5000), I.perc("rate", "Marginal Tax %", 24)],
    compute: (v) => [{ label: "Tax Saved", value: money(n(v.deduction) * n(v.rate) / 100), highlight: true }],
  },
  "payroll-deduction": {
    id: "payroll-deduction",
    inputs: [I.cur("gross", "Gross Pay", 5000), I.perc("retirement", "Retirement %", 6), I.cur("health", "Health Premium", 200), I.cur("other", "Other Pre-tax", 50)],
    compute: (v) => {
      const ded = n(v.gross) * n(v.retirement) / 100 + n(v.health) + n(v.other);
      return [{ label: "Total Pre-tax Deduction", value: money(ded), highlight: true }, { label: "Taxable Pay", value: money(n(v.gross) - ded) }];
    },
  },
  "tip-split": {
    id: "tip-split",
    inputs: [I.cur("bill", "Bill", 120), I.perc("tip", "Tip %", 18), I.num("people", "People", 4)],
    compute: (v) => {
      const t = n(v.bill) * n(v.tip) / 100; const total = n(v.bill) + t;
      return [{ label: "Total", value: money(total) }, { label: "Per Person", value: money(total / n(v.people)), highlight: true }];
    },
  },
  "cost-of-living-adjustment": {
    id: "cost-of-living-adjustment",
    inputs: [I.cur("salary", "Current Salary", 60000), I.perc("cpi", "CPI Increase %", 3.2)],
    compute: (v) => {
      const adj = n(v.salary) * (1 + n(v.cpi) / 100);
      return [{ label: "COLA-Adjusted Salary", value: money(adj), highlight: true }, { label: "Raise", value: money(adj - n(v.salary)) }];
    },
  },
  "inflation-adjusted-return": {
    id: "inflation-adjusted-return",
    formula: "Real = (1 + Nominal)/(1 + Inflation) − 1",
    inputs: [I.perc("nominal", "Nominal Return %", 10), I.perc("inflation", "Inflation %", 4)],
    compute: (v) => {
      const r = ((1 + n(v.nominal) / 100) / (1 + n(v.inflation) / 100) - 1) * 100;
      return [{ label: "Real Return", value: pct(r), highlight: true }];
    },
  },
};

export const getFinanceCalc = (id: string): FinanceCalc | undefined => financeCalculators[id];
