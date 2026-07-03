import React, { useState } from "react";
import {
  ArrowLeftRight,
  Landmark,
  Send,
  Globe2,
  CalendarClock,
  ScanLine,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  Lock,
  Fingerprint,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Mail,
  MapPin,
  Phone,
  Target,
  Users,
  Compass,
} from "lucide-react";

// Point this at your deployed Render backend once it's live, e.g.
// "https://ledgerline-bank.onrender.com/api". Left as localhost for local testing.
const API_BASE = "https://ledgerline-bank.onrender.com/api";

const FAQS = [
  {
    q: "Is Ledgerline FDIC insured?",
    a: "Deposits are held at our partner bank and covered up to $250,000 per depositor, per ownership category, through standard FDIC pass-through insurance.",
  },
  {
    q: "How long does it take to open an account?",
    a: "Most applications are approved in under four minutes. You'll need a government ID and a way to fund your first deposit.",
  },
  {
    q: "Are there any monthly fees?",
    a: "Everyday Checking and Business Checking have no monthly fee and no minimum balance requirement, ever.",
  },
  {
    q: "How fast do transfers land?",
    a: "Instant transfers to other Ledgerline accounts land in seconds. Domestic wires settle same-day. ACH typically takes one to two business days.",
  },
  {
    q: "Can I use Ledgerline for a business?",
    a: "Yes — Business Checking, Business Savings, and a Line of Credit are available from the Accounts page under the Business tab.",
  },
];


const ACCOUNTS = {
  personal: [
    {
      code: "1001",
      name: "Everyday Checking",
      blurb: "No monthly fee, no minimum balance. Built for money that moves.",
      meta: "$0 / mo",
    },
    {
      code: "1002",
      name: "High-Yield Savings",
      blurb: "Balances earn from day one. Withdraw anytime, no penalty.",
      meta: "4.35% APY",
    },
    {
      code: "1003",
      name: "Rewards Credit Card",
      blurb: "Flat cash back on every purchase, credited the same statement.",
      meta: "2% back",
    },
    {
      code: "1004",
      name: "Auto & Personal Loans",
      blurb: "Fixed terms, fixed rate. See your exact payoff date up front.",
      meta: "From 6.9% APR",
    },
  ],
  business: [
    {
      code: "2001",
      name: "Business Checking",
      blurb: "Unlimited transactions and same-day payouts to your account.",
      meta: "$0 / mo",
    },
    {
      code: "2002",
      name: "Business Line of Credit",
      blurb: "Draw what you need, pay interest only on the balance drawn.",
      meta: "Up to $250,000",
    },
    {
      code: "2003",
      name: "Merchant Payments",
      blurb: "Accept cards, taps, and invoices from one dashboard.",
      meta: "2.6% + $0.10",
    },
    {
      code: "2004",
      name: "Business Savings",
      blurb: "Sweep idle cash automatically at the close of each day.",
      meta: "3.90% APY",
    },
  ],
};

const PAYMENTS = [
  {
    icon: Send,
    name: "Instant Transfer",
    desc: "Send money to anyone with just a phone number. Funds land in seconds, not days.",
  },
  {
    icon: Landmark,
    name: "ACH & Direct Deposit",
    desc: "Automate payroll and recurring income. Eligible deposits post up to two days early.",
  },
  {
    icon: ArrowLeftRight,
    name: "Domestic Wire",
    desc: "Same-day wires for time-sensitive payments, tracked from send to settle.",
  },
  {
    icon: Globe2,
    name: "International Wire",
    desc: "Send to 130+ countries with the exchange rate and fee shown before you confirm.",
  },
  {
    icon: CalendarClock,
    name: "Bill Pay & AutoPay",
    desc: "Schedule recurring payments once. Every one itemized, every one on time.",
  },
  {
    icon: ScanLine,
    name: "Mobile Check Deposit",
    desc: "Photograph a check and post it to your balance in under a minute.",
  },
  {
    icon: CreditCard,
    name: "Virtual & Physical Cards",
    desc: "Issue a card instantly, freeze it from the app, set limits per merchant.",
  },
  {
    icon: RefreshCw,
    name: "Recurring Payments",
    desc: "Subscriptions, rent, invoices — set the cadence and let it run itself.",
  },
];

const TAPE_ITEMS = [
  "NO MONTHLY FEE · CHECKING",
  "4.35% APY · SAVINGS",
  "FDIC INSURED TO $250,000",
  "REAL-TIME TRANSFERS · 24/7",
  "$0.00 OVERDRAFT · ALWAYS",
  "SAME-DAY DOMESTIC WIRES",
];

function Perforation({ tone = "light" }) {
  return (
    <div
      className="perforation"
      style={{
        background:
          tone === "light"
            ? "repeating-linear-gradient(90deg, #F6F1E4 0 10px, transparent 10px 20px)"
            : "repeating-linear-gradient(90deg, #0F2B25 0 10px, transparent 10px 20px)",
      }}
      aria-hidden="true"
    />
  );
}

export default function BankingSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tab, setTab] = useState("personal");
  const [page, setPage] = useState("home");

  function goTo(p) {
    setPage(p);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        :root {
          --ink: #0F2B25;
          --ink-2: #16362F;
          --parchment: #F6F1E4;
          --paper: #FCFAF3;
          --gold: #C6952C;
          --gold-bright: #E0B84D;
          --rule: #DCD3BA;
          --rule-dark: #294A41;
          --ink-text: #16231D;
          --cream-text: #F3EEDD;
          --slate: #5B6B62;
        }

        .site {
          font-family: 'IBM Plex Sans', sans-serif;
          color: var(--ink-text);
          background: var(--paper);
          -webkit-font-smoothing: antialiased;
        }

        .site * { box-sizing: border-box; }

        .site h1, .site h2, .site h3 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        .wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* NAV */
        .nav {
          position: sticky;
          top: 0;
          z-index: 40;
          background: var(--ink);
          border-bottom: 1px solid var(--rule-dark);
        }
        .nav-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 18px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .brand {
          display: flex;
          align-items: baseline;
          gap: 8px;
          color: var(--cream-text);
          font-family: 'Fraunces', serif;
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
        }
        .brand span.mark {
          color: var(--gold-bright);
          font-style: italic;
          font-size: 22px;
        }
        .nav-links {
          display: flex;
          gap: 36px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          color: var(--cream-text);
          opacity: 0.85;
          text-decoration: none;
          font-size: 14.5px;
          letter-spacing: 0.01em;
        }
        .nav-links a:hover { opacity: 1; }
        .nav-right { display: flex; align-items: center; gap: 18px; }
        .btn {
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          border-radius: 3px;
          padding: 11px 20px;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .btn:focus-visible { outline: 2px solid var(--gold-bright); outline-offset: 2px; }
        .btn-gold {
          background: var(--gold);
          color: var(--ink);
        }
        .btn-gold:hover { background: var(--gold-bright); }
        .btn-ghost {
          background: transparent;
          color: var(--cream-text);
          border: 1px solid var(--rule-dark);
        }
        .btn-ghost:hover { border-color: var(--gold-bright); color: var(--gold-bright); }
        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--cream-text);
          cursor: pointer;
        }

        /* MOBILE MENU */
        .mobile-menu {
          background: var(--ink);
          border-bottom: 1px solid var(--rule-dark);
          padding: 8px 28px 20px;
          display: none;
        }
        .mobile-menu.open { display: block; }
        .mobile-menu a {
          display: block;
          color: var(--cream-text);
          text-decoration: none;
          padding: 10px 0;
          border-bottom: 1px solid var(--rule-dark);
          font-size: 15px;
        }

        /* TAPE */
        .tape-track {
          background: var(--ink-2);
          border-bottom: 1px solid var(--rule-dark);
          overflow: hidden;
          white-space: nowrap;
        }
        .tape-inner {
          display: inline-flex;
          animation: scroll-tape 32s linear infinite;
          padding: 10px 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .tape-inner { animation: none; }
        }
        .tape-item {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          color: var(--gold-bright);
          letter-spacing: 0.06em;
          padding: 0 28px;
          border-right: 1px solid var(--rule-dark);
        }
        @keyframes scroll-tape {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        /* HERO */
        .hero {
          background: var(--ink);
          padding: 88px 0 70px;
          position: relative;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 56px;
          align-items: end;
        }
        .eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.14em;
          color: var(--gold-bright);
          text-transform: uppercase;
          margin-bottom: 18px;
          opacity: 0;
          animation: rise 0.7s ease forwards;
        }
        .hero h1 {
          font-size: 56px;
          line-height: 1.06;
          color: var(--cream-text);
          opacity: 0;
          animation: rise 0.8s ease forwards 0.1s;
        }
        .hero h1 em {
          font-style: italic;
          color: var(--gold-bright);
          font-weight: 400;
        }
        .hero p.lead {
          margin-top: 22px;
          font-size: 17px;
          line-height: 1.6;
          color: var(--cream-text);
          opacity: 0;
          max-width: 460px;
          animation: rise 0.8s ease forwards 0.2s;
        }
        .hero-ctas {
          display: flex;
          gap: 14px;
          margin-top: 32px;
          opacity: 0;
          animation: rise 0.8s ease forwards 0.3s;
        }
        @keyframes rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ledger-card {
          background: var(--paper);
          border-radius: 4px;
          padding: 26px;
          opacity: 0;
          animation: rise 0.8s ease forwards 0.35s;
        }
        .ledger-card .row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 13px 0;
          border-bottom: 1px dashed var(--rule);
        }
        .ledger-card .row:last-child { border-bottom: none; }
        .ledger-card .label {
          font-size: 13px;
          color: var(--slate);
        }
        .ledger-card .value {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 15px;
          font-weight: 500;
        }
        .ledger-card .total .value { color: var(--gold); font-size: 19px; }

        /* PERFORATION */
        .perforation {
          height: 14px;
          width: 100%;
        }

        /* SECTION HEAD */
        .section { padding: 76px 0; }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 44px;
          border-bottom: 1px solid var(--rule);
          padding-bottom: 22px;
        }
        .section-head .tag {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
          display: block;
        }
        .section-head h2 { font-size: 34px; }
        .section-head p { color: var(--slate); font-size: 15px; max-width: 360px; margin: 0; }

        /* TABS */
        .tabs {
          display: inline-flex;
          border: 1px solid var(--rule);
          border-radius: 3px;
          overflow: hidden;
        }
        .tabs button {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 9px 18px;
          background: var(--paper);
          border: none;
          cursor: pointer;
          color: var(--slate);
        }
        .tabs button.active {
          background: var(--ink);
          color: var(--gold-bright);
        }
        .tabs button:focus-visible { outline: 2px solid var(--gold); outline-offset: -2px; }

        /* ACCOUNT GRID */
        .acct-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
        }
        .acct-card {
          background: var(--paper);
          padding: 30px 32px;
          transition: background 0.15s ease;
        }
        .acct-card:hover { background: #FFFDF7; }
        .acct-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }
        .acct-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          color: var(--slate);
        }
        .acct-meta {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          color: var(--gold);
          background: rgba(198,149,44,0.1);
          padding: 3px 9px;
          border-radius: 2px;
        }
        .acct-card h3 { font-size: 21px; margin-bottom: 8px; }
        .acct-card p { font-size: 14.5px; color: var(--slate); line-height: 1.55; margin: 0 0 16px; }
        .acct-link {
          font-size: 13.5px;
          color: var(--ink);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 500;
          border-bottom: 1px solid var(--ink);
          padding-bottom: 2px;
        }
        .acct-link:hover { color: var(--gold); border-color: var(--gold); }

        /* PAYMENTS (dark) */
        .payments {
          background: var(--ink);
          padding: 76px 0;
        }
        .payments .section-head { border-bottom-color: var(--rule-dark); }
        .payments .section-head h2 { color: var(--cream-text); }
        .payments .section-head p { color: #A9BDB4; }
        .pay-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--rule-dark);
          border: 1px solid var(--rule-dark);
        }
        .pay-card {
          background: var(--ink-2);
          padding: 26px 22px;
        }
        .pay-card svg { color: var(--gold-bright); margin-bottom: 16px; }
        .pay-card h3 {
          font-family: 'IBM Plex Sans', sans-serif;
          font-weight: 600;
          font-size: 15.5px;
          color: var(--cream-text);
          margin-bottom: 8px;
        }
        .pay-card p { font-size: 13.5px; color: #A9BDB4; line-height: 1.55; margin: 0; }

        /* SECURITY */
        .security { padding: 70px 0; }
        .sec-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .sec-item { display: flex; gap: 16px; align-items: flex-start; }
        .sec-item svg { color: var(--gold); flex-shrink: 0; margin-top: 2px; }
        .sec-item h3 { font-size: 17px; margin-bottom: 6px; }
        .sec-item p { font-size: 14px; color: var(--slate); margin: 0; line-height: 1.55; }

        /* CTA BAND */
        .cta-band {
          background: var(--parchment);
          border-top: 1px solid var(--rule);
          border-bottom: 1px solid var(--rule);
          padding: 64px 0;
          text-align: center;
        }
        .cta-band h2 { font-size: 32px; margin-bottom: 14px; }
        .cta-band p { color: var(--slate); margin-bottom: 30px; }
        .cta-form {
          display: flex;
          justify-content: center;
          gap: 10px;
          max-width: 420px;
          margin: 0 auto;
        }
        .cta-form input {
          flex: 1;
          padding: 12px 14px;
          border: 1px solid var(--rule);
          border-radius: 3px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          background: var(--paper);
        }
        .cta-form input:focus-visible { outline: 2px solid var(--gold); }

        /* FOOTER */
        .footer {
          background: var(--ink);
          color: #A9BDB4;
          padding: 56px 0 28px;
        }
        .foot-grid {
          display: grid;
          grid-template-columns: 1.4fr repeat(3, 1fr);
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--rule-dark);
        }
        .foot-brand h3 { color: var(--cream-text); font-size: 20px; margin-bottom: 12px; }
        .foot-brand p { font-size: 13.5px; line-height: 1.6; max-width: 260px; }
        .foot-col h4 {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--cream-text);
          margin-bottom: 16px;
        }
        .foot-col a {
          display: block;
          color: #A9BDB4;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 10px;
        }
        .foot-col a:hover { color: var(--gold-bright); }
        .foot-bottom {
          padding-top: 26px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          font-size: 12px;
          color: #6E8177;
          line-height: 1.6;
        }

        .nav-link-btn {
          background: none;
          border: none;
          color: var(--cream-text);
          opacity: 0.85;
          font-family: 'IBM Plex Sans', sans-serif;
          text-decoration: none;
          font-size: 14.5px;
          letter-spacing: 0.01em;
          cursor: pointer;
          padding: 0;
        }
        .nav-link-btn:hover { opacity: 1; }
        .foot-link-btn {
          display: block;
          background: none;
          border: none;
          color: #A9BDB4;
          text-decoration: none;
          font-size: 14px;
          margin-bottom: 10px;
          cursor: pointer;
          padding: 0;
          text-align: left;
          font-family: 'IBM Plex Sans', sans-serif;
        }
        .foot-link-btn:hover { color: var(--gold-bright); }
        .mobile-menu button {
          display: block;
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          color: var(--cream-text);
          padding: 10px 0;
          border-bottom: 1px solid var(--rule-dark);
          font-size: 15px;
          cursor: pointer;
          font-family: 'IBM Plex Sans', sans-serif;
        }

        /* INNER PAGE HERO */
        .page-hero {
          background: var(--ink);
          padding: 64px 0 48px;
        }
        .page-hero .tag { color: var(--gold-bright); }
        .page-hero h1 {
          color: var(--cream-text);
          font-size: 42px;
        }
        .page-hero p {
          color: #A9BDB4;
          max-width: 480px;
          margin-top: 14px;
          font-size: 15.5px;
          line-height: 1.6;
        }

        /* ABOUT */
        .about-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--rule);
          border: 1px solid var(--rule);
          margin-bottom: 56px;
        }
        .about-card {
          background: var(--paper);
          padding: 30px;
        }
        .about-card svg { color: var(--gold); margin-bottom: 14px; }
        .about-card h3 { font-size: 17px; margin-bottom: 8px; }
        .about-card p { font-size: 14px; color: var(--slate); line-height: 1.6; margin: 0; }
        .about-story {
          max-width: 640px;
          font-size: 15.5px;
          line-height: 1.75;
          color: var(--ink-text);
        }
        .about-story p { margin: 0 0 18px; }

        /* FAQ */
        .faq-list { max-width: 720px; }
        .faq-item {
          border-bottom: 1px solid var(--rule);
        }
        .faq-q {
          width: 100%;
          background: none;
          border: none;
          text-align: left;
          padding: 20px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: 'Fraunces', serif;
          font-size: 17px;
          cursor: pointer;
          color: var(--ink-text);
        }
        .faq-q svg { color: var(--gold); flex-shrink: 0; transition: transform 0.15s ease; }
        .faq-item.open .faq-q svg { transform: rotate(180deg); }
        .faq-a {
          padding: 0 0 20px;
          font-size: 14.5px;
          color: var(--slate);
          line-height: 1.65;
          max-width: 600px;
        }

        /* CONTACT */
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
        }
        .contact-info-item {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          margin-bottom: 26px;
        }
        .contact-info-item svg { color: var(--gold); margin-top: 3px; flex-shrink: 0; }
        .contact-info-item h4 { font-size: 14.5px; margin: 0 0 4px; font-weight: 600; }
        .contact-info-item p { font-size: 14px; color: var(--slate); margin: 0; }
        .contact-form label {
          display: block;
          font-size: 12.5px;
          color: var(--slate);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .contact-form input,
        .contact-form textarea {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--rule);
          border-radius: 3px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          background: var(--paper);
          margin-bottom: 18px;
        }
        .contact-form textarea { resize: vertical; min-height: 110px; }
        .success-note {
          background: rgba(198,149,44,0.12);
          border: 1px solid var(--gold);
          padding: 12px 14px;
          border-radius: 3px;
          font-size: 14px;
          margin-bottom: 18px;
        }

        /* LOGIN */
        .login-wrap {
          max-width: 420px;
          margin: 0 auto;
          padding: 80px 28px;
        }
        .login-card {
          background: var(--paper);
          border: 1px solid var(--rule);
          border-radius: 6px;
          padding: 34px;
        }
        .login-card h2 { font-size: 24px; margin-bottom: 6px; }
        .login-card .sub { color: var(--slate); font-size: 14px; margin-bottom: 26px; }
        .login-card label {
          display: block;
          font-size: 12.5px;
          color: var(--slate);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .login-card input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid var(--rule);
          border-radius: 3px;
          font-family: 'IBM Plex Sans', sans-serif;
          font-size: 14px;
          margin-bottom: 16px;
        }
        .login-toggle {
          text-align: center;
          margin-top: 18px;
          font-size: 13.5px;
          color: var(--slate);
        }
        .login-toggle button {
          background: none;
          border: none;
          color: var(--gold);
          cursor: pointer;
          font-weight: 600;
          font-size: 13.5px;
          text-decoration: underline;
        }
        .login-error {
          background: rgba(178,58,46,0.1);
          border: 1px solid #B23A2E;
          color: #B23A2E;
          padding: 10px 12px;
          border-radius: 3px;
          font-size: 13.5px;
          margin-bottom: 16px;
        }

        @media (max-width: 880px) {
          .about-grid { grid-template-columns: 1fr; }
          .contact-grid { grid-template-columns: 1fr; gap: 32px; }
          .page-hero h1 { font-size: 30px; }
        }

        @media (max-width: 880px) {
          .menu-toggle { display: block; }
          .nav-links { display: none; }
          .nav-right .btn-ghost { display: none; }
          .hero-grid { grid-template-columns: 1fr; }
          .hero h1 { font-size: 38px; }
          .acct-grid { grid-template-columns: 1fr; }
          .pay-grid { grid-template-columns: repeat(2, 1fr); }
          .sec-grid { grid-template-columns: 1fr; gap: 28px; }
          .foot-grid { grid-template-columns: 1fr 1fr; }
          .section-head { flex-direction: column; align-items: flex-start; }
          .cta-form { flex-direction: column; }
        }
      `}</style>

      {/* NAV */}
      <div className="nav">
        <div className="nav-inner">
          <button className="brand" style={{background: "none", border: "none", cursor: "pointer", padding: 0}} onClick={() => goTo("home")}>
            <span className="mark">§</span> Ledgerline
          </button>
          <ul className="nav-links">
            <li><button className="nav-link-btn" onClick={() => goTo("home")}>Accounts</button></li>
            <li><button className="nav-link-btn" onClick={() => goTo("home")}>Payments</button></li>
            <li><button className="nav-link-btn" onClick={() => goTo("about")}>About</button></li>
            <li><button className="nav-link-btn" onClick={() => goTo("faq")}>FAQ</button></li>
            <li><button className="nav-link-btn" onClick={() => goTo("contact")}>Contact</button></li>
          </ul>
          <div className="nav-right">
            <button className="btn btn-ghost" onClick={() => goTo("login")}>Sign in</button>
            <button className="btn btn-gold" onClick={() => goTo("login")}>Open account</button>
            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => goTo("home")}>Accounts</button>
        <button onClick={() => goTo("home")}>Payments</button>
        <button onClick={() => goTo("about")}>About</button>
        <button onClick={() => goTo("faq")}>FAQ</button>
        <button onClick={() => goTo("contact")}>Contact</button>
        <button onClick={() => goTo("login")}>Sign in</button>
      </div>

      {page === "home" && (
      <>
      {/* TAPE */}
      <div className="tape-track">
        <div className="tape-inner">
          {[...TAPE_ITEMS, ...TAPE_ITEMS, ...TAPE_ITEMS].map((t, i) => (
            <span className="tape-item mono" key={i}>{t}</span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Est. 2004 · Member FDIC</span>
            <h1>Banking, <em>itemized</em>.</h1>
            <p className="lead">
              Every account, every transfer, every fee — shown to the cent, before it happens.
              No surprises on the statement, because there's nothing hidden from you today.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-gold">Open an account<ChevronRight size={15} style={{verticalAlign: "-2px", marginLeft: 4}} /></button>
              <button className="btn btn-ghost">See rates</button>
            </div>
          </div>
          <div className="ledger-card">
            <div className="row">
              <span className="label">Everyday Checking</span>
              <span className="value mono">$0 monthly fee</span>
            </div>
            <div className="row">
              <span className="label">High-Yield Savings</span>
              <span className="value mono">4.35% APY</span>
            </div>
            <div className="row">
              <span className="label">Instant transfers</span>
              <span className="value mono">$0.00</span>
            </div>
            <div className="row total">
              <span className="label">FDIC coverage</span>
              <span className="value mono">$250,000</span>
            </div>
          </div>
        </div>
      </section>
      <Perforation tone="light" />

      {/* ACCOUNTS */}
      <section className="section" id="accounts">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="tag">No. 01 — Accounts</span>
              <h2>Built for how money actually moves</h2>
            </div>
            <div className="tabs">
              <button className={tab === "personal" ? "active" : ""} onClick={() => setTab("personal")}>Personal</button>
              <button className={tab === "business" ? "active" : ""} onClick={() => setTab("business")}>Business</button>
            </div>
          </div>
          <div className="acct-grid">
            {ACCOUNTS[tab].map((a) => (
              <div className="acct-card" key={a.code}>
                <div className="acct-top">
                  <span className="acct-code mono">ACCT / {a.code}</span>
                  <span className="acct-meta">{a.meta}</span>
                </div>
                <h3>{a.name}</h3>
                <p>{a.blurb}</p>
                <a href="#" className="acct-link">Explore <ChevronRight size={14} /></a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAYMENTS */}
      <section className="payments" id="payments">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="tag">No. 02 — Payments & transfers</span>
              <h2>Move money eight different ways</h2>
            </div>
            <p>From instant P2P to international wires — each shown with its real cost up front.</p>
          </div>
          <div className="pay-grid">
            {PAYMENTS.map((p) => {
              const Icon = p.icon;
              return (
                <div className="pay-card" key={p.name}>
                  <Icon size={22} strokeWidth={1.6} />
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <Perforation tone="light" />

      {/* SECURITY */}
      <section className="security" id="security">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="tag">No. 03 — Security</span>
              <h2>Held to a higher ledger</h2>
            </div>
          </div>
          <div className="sec-grid">
            <div className="sec-item">
              <ShieldCheck size={26} strokeWidth={1.5} />
              <div>
                <h3>FDIC insured</h3>
                <p>Deposits covered up to $250,000 per depositor, through our partner bank.</p>
              </div>
            </div>
            <div className="sec-item">
              <Lock size={26} strokeWidth={1.5} />
              <div>
                <h3>256-bit encryption</h3>
                <p>Every transfer and login is encrypted end to end, on every device.</p>
              </div>
            </div>
            <div className="sec-item">
              <Fingerprint size={26} strokeWidth={1.5} />
              <div>
                <h3>Biometric sign-in</h3>
                <p>Face or fingerprint unlock replaces passwords on supported devices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="cta-band">
        <div className="wrap">
          <h2>Open an account in about four minutes</h2>
          <p>No branch visit, no paperwork. Just your ID and a starting deposit.</p>
          <div className="cta-form">
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
            <button className="btn btn-gold" onClick={() => goTo("login")}>Get started</button>
          </div>
        </div>
      </section>
      </>
      )}

      {page === "about" && <AboutPage />}
      {page === "faq" && <FAQPage />}
      {page === "contact" && <ContactPage />}
      {page === "login" && <LoginPage />}

      {/* FOOTER */}
      <footer className="footer">
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <h3>§ Ledgerline</h3>
              <p>A digital bank built around one idea: you should be able to see exactly where your money is, always.</p>
            </div>
            <div className="foot-col">
              <h4>Products</h4>
              <a href="#">Checking</a>
              <a href="#">Savings</a>
              <a href="#">Credit cards</a>
              <a href="#">Loans</a>
            </div>
            <div className="foot-col">
              <h4>Payments</h4>
              <a href="#">Transfers</a>
              <a href="#">Bill pay</a>
              <a href="#">Wires</a>
              <a href="#">Mobile deposit</a>
            </div>
            <div className="foot-col">
              <h4>Company</h4>
              <button className="foot-link-btn" onClick={() => goTo("about")}>About</button>
              <button className="foot-link-btn" onClick={() => goTo("home")}>Security</button>
              <button className="foot-link-btn" onClick={() => goTo("contact")}>Support</button>
              <button className="foot-link-btn" onClick={() => goTo("faq")}>FAQ</button>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Ledgerline Bank. This is a design concept and not a real financial institution.</span>
            <span>Member FDIC (concept) · Equal Housing Lender (concept)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag mono">About</span>
          <h1>Built by people who found the fine print annoying.</h1>
          <p>Ledgerline started as a simple idea: a bank statement should read like a ledger, not a mystery. Every fee, every rate, every rule — written down where you can actually find it.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="about-grid">
            <div className="about-card">
              <Target size={22} strokeWidth={1.6} />
              <h3>Our mission</h3>
              <p>Make everyday banking transparent enough that you never have to call support just to understand your own statement.</p>
            </div>
            <div className="about-card">
              <Users size={22} strokeWidth={1.6} />
              <h3>Who we serve</h3>
              <p>Individuals who want a no-fee account that just works, and small businesses that need banking as flexible as they are.</p>
            </div>
            <div className="about-card">
              <Compass size={22} strokeWidth={1.6} />
              <h3>How we operate</h3>
              <p>Deposits are held through a partner bank, insured and regulated the same way any traditional bank account is.</p>
            </div>
          </div>
          <div className="about-story">
            <p>Ledgerline was founded on a simple frustration: banking products that hide their true cost until the statement arrives. We set out to build the opposite — an account where the rate, the fee, and the rule are all visible before you ever tap "confirm."</p>
            <p>Today that shows up in small ways throughout the product: transfers that show their exact cost before you send them, savings that show the math behind the rate, and a support team that answers in plain language instead of policy numbers.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag mono">FAQ</span>
          <h1>Answers, itemized.</h1>
          <p>The questions people ask most before opening an account.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <div className="faq-list">
            {FAQS.map((item, i) => (
              <div className={`faq-item ${openIndex === i ? "open" : ""}`} key={item.q}>
                <button className="faq-q" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
                  {item.q}
                  <ChevronDown size={18} strokeWidth={1.8} />
                </button>
                {openIndex === i && <div className="faq-a">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="tag mono">Contact</span>
          <h1>Talk to a real person.</h1>
          <p>Questions about an account, a transfer, or anything else — reach out and we'll get back to you within one business day.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap contact-grid">
          <div>
            <div className="contact-info-item">
              <Mail size={20} strokeWidth={1.6} />
              <div>
                <h4>Email</h4>
                <p>support@ledgerline.example</p>
              </div>
            </div>
            <div className="contact-info-item">
              <Phone size={20} strokeWidth={1.6} />
              <div>
                <h4>Phone</h4>
                <p>1-800-555-0142, Mon–Fri, 8am–8pm ET</p>
              </div>
            </div>
            <div className="contact-info-item">
              <MapPin size={20} strokeWidth={1.6} />
              <div>
                <h4>Mailing address</h4>
                <p>Ledgerline Bank, 100 Ledger Ave, Suite 400, Wilmington, DE 19801</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {sent && <div className="success-note">Thanks — your message has been noted. We'll be in touch shortly.</div>}
            <label>Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
            <label>Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
            <label>Message</label>
            <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" />
            <button className="btn btn-gold" type="submit">Send message</button>
          </form>
        </div>
      </section>
    </>
  );
}

function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const path = mode === "login" ? "/auth/login" : "/auth/signup";
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      localStorage.setItem("ledgerline_token", data.token);
      window.location.href = "./dashboard.html";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>{mode === "login" ? "Welcome back" : "Open an account"}</h2>
        <p className="sub">{mode === "login" ? "Sign in to view your accounts." : "Takes about four minutes."}</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label>Full name</label>
              <input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="Jane Doe" />
            </>
          )}
          <label>Email</label>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <label>Password</label>
          <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" />
          <button className="btn btn-gold" style={{width: "100%"}} type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div className="login-toggle">
          {mode === "login" ? (
            <>New here? <button onClick={() => setMode("signup")}>Open an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("login")}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
    }
