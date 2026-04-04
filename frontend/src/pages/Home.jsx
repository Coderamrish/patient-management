import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

/* ─── Inline SVG Icons ─── */
const Ico = ({ d, type = 'stroke', vb = '0 0 24 24', size = 20, ...p }) => (
  <svg viewBox={vb} width={size} height={size} fill={type === 'fill' ? 'currentColor' : 'none'}
    stroke={type === 'stroke' ? 'currentColor' : 'none'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d={d} />
  </svg>
);

const Icons = {
  people:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  doctor:  () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  cal:     () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  grid:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  arrow:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>,
  ne:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>,
  heart:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  shield:  () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  zap:     () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  logout:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>,
  menu:    () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close:   () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --teal: #0d9488;
  --teal-l: #14b8a6;
  --teal-d: #0f766e;
  --emerald: #059669;
  --sky: #0ea5e9;
  --navy: #0c1a2e;
  --navy-2: #112236;
  --navy-3: #0e1f35;
  --white: #fff;
  --glass: rgba(255,255,255,0.055);
  --glass-b: rgba(255,255,255,0.11);
  --dim: rgba(255,255,255,0.45);
  --dim2: rgba(255,255,255,0.22);
  --dim3: rgba(255,255,255,0.08);
}

html { scroll-behavior: smooth; }
body { font-family: 'DM Sans', sans-serif; background: var(--navy); color: var(--white); overflow-x: hidden; }

/* ── SCROLLBAR ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--navy); }
::-webkit-scrollbar-thumb { background: var(--teal-d); border-radius: 10px; }

/* ── ANIMATIONS ── */
@keyframes blobFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-40px) scale(1.07)} }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.25} }
@keyframes spin { to{transform:rotate(360deg)} }
@keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
@keyframes countUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
@keyframes ecgDraw { from{stroke-dashoffset:1000} to{stroke-dashoffset:0} }
@keyframes glowPulse { 0%,100%{box-shadow:0 0 16px rgba(13,148,136,0.4)} 50%{box-shadow:0 0 36px rgba(13,148,136,0.75)} }

/* ── NAV ── */
.nav {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; height: 68px;
  background: rgba(12,26,46,0.88);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-b);
}
.nav-brand { display: flex; align-items: center; gap: 12px; }
.nav-logo {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, var(--teal), var(--sky));
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 900; color: #fff;
  box-shadow: 0 4px 16px rgba(13,148,136,0.45);
  flex-shrink: 0;
}
.nav-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: var(--white); }
.nav-title span { color: var(--teal-l); }
.nav-pill {
  display: flex; align-items: center; gap: 6px;
  background: rgba(13,148,136,0.12); border: 1px solid rgba(13,148,136,0.28);
  border-radius: 100px; padding: 5px 13px;
  font-size: 11px; font-weight: 600; color: var(--teal-l);
  letter-spacing: 0.5px; text-transform: uppercase;
}
.nav-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal-l); animation: pulse 2s infinite; }
.nav-right { display: flex; align-items: center; gap: 14px; }
.nav-date { font-size: 12px; color: var(--dim2); }
.nav-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, var(--teal), var(--teal-d));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: #fff;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.3); cursor: pointer;
  flex-shrink: 0;
}
.nav-logout {
  display: flex; align-items: center; gap: 7px;
  background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 10px; padding: 8px 14px; cursor: pointer;
  font-size: 13px; font-weight: 500; color: #fca5a5;
  transition: all 0.2s;
}
.nav-logout:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.4); }
.nav-menu-btn {
  display: none; background: var(--glass); border: 1px solid var(--glass-b);
  border-radius: 10px; padding: 8px; cursor: pointer; color: var(--white);
  align-items: center; justify-content: center;
}
.mobile-menu {
  display: none; flex-direction: column; gap: 8px;
  position: fixed; top: 68px; left: 0; right: 0; z-index: 99;
  background: var(--navy-2); border-bottom: 1px solid var(--glass-b);
  padding: 16px 20px; backdrop-filter: blur(20px);
}
.mobile-menu.open { display: flex; }
.mobile-nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px; border-radius: 12px;
  background: var(--glass); border: 1px solid var(--glass-b);
  font-size: 14px; font-weight: 500; color: var(--white);
  cursor: pointer; transition: all 0.2s;
}
.mobile-nav-item:hover { background: rgba(13,148,136,0.15); border-color: var(--teal); }
.mobile-nav-icon { color: var(--teal-l); display: flex; }

/* ── HERO ── */
.hero {
  position: relative; overflow: hidden; min-height: 90vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 80px 40px 0;
}
.hero-blob {
  position: absolute; border-radius: 50%; filter: blur(90px);
  opacity: 0.16; pointer-events: none; animation: blobFloat 9s ease-in-out infinite;
}
.hb1 { width: 600px; height: 600px; background: var(--teal); top: -180px; left: -150px; }
.hb2 { width: 450px; height: 450px; background: var(--sky); bottom: -100px; right: -50px; animation-delay: 3.5s; }
.hb3 { width: 300px; height: 300px; background: var(--emerald); top: 30%; left: 40%; animation-delay: 6s; }

.grid-bg {
  position: absolute; inset: 0; pointer-events: none;
  background-image:
    linear-gradient(rgba(13,148,136,0.065) 1px, transparent 1px),
    linear-gradient(90deg, rgba(13,148,136,0.065) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-inner { position: relative; z-index: 2; max-width: 1240px; margin: 0 auto; width: 100%; }

.hero-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(13,148,136,0.14); border: 1px solid rgba(13,148,136,0.3);
  border-radius: 100px; padding: 7px 18px; margin-bottom: 32px;
  font-size: 11px; font-weight: 600; color: var(--teal-l);
  text-transform: uppercase; letter-spacing: 1.5px;
}

.hero-layout { display: grid; grid-template-columns: 1fr 420px; gap: 60px; align-items: center; }

.hero-heading {
  font-family: 'Playfair Display', serif;
  font-size: clamp(52px, 7vw, 96px);
  font-weight: 900; line-height: 0.93;
  letter-spacing: -3px; color: var(--white);
  margin-bottom: 28px;
  animation: fadeUp 0.7s ease both;
}
.hero-heading em { color: var(--teal-l); font-style: italic; }

.hero-sub {
  font-size: 16px; color: var(--dim); line-height: 1.8;
  max-width: 500px; margin-bottom: 44px;
  animation: fadeUp 0.7s 0.15s ease both;
}

.hero-btns { display: flex; gap: 14px; flex-wrap: wrap; animation: fadeUp 0.7s 0.25s ease both; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 15px 30px; border: none; border-radius: 12px; cursor: pointer;
  background: linear-gradient(135deg, var(--teal-l), var(--teal-d));
  color: #fff; font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
  box-shadow: 0 8px 28px rgba(13,148,136,0.4);
  transition: all 0.3s; letter-spacing: 0.2px;
}
.btn-primary:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(13,148,136,0.55); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 15px 28px; border-radius: 12px; cursor: pointer;
  background: var(--glass); border: 1px solid var(--glass-b);
  color: rgba(255,255,255,0.75); font-family: 'DM Sans', sans-serif;
  font-size: 15px; font-weight: 500;
  transition: all 0.25s; backdrop-filter: blur(8px);
}
.btn-ghost:hover { background: rgba(13,148,136,0.12); border-color: var(--teal); color: #fff; }

/* ── STATS CARDS ── */
.stats-col { display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.7s 0.1s ease both; }

.stat-card {
  background: var(--glass); border: 1px solid var(--glass-b);
  border-radius: 18px; padding: 20px 24px; backdrop-filter: blur(16px);
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.3s; cursor: default;
  position: relative; overflow: hidden;
}
.stat-card::before {
  content: ''; position: absolute; left: 0; top: 0; bottom: 0;
  width: 3px; border-radius: 0 2px 2px 0;
  background: var(--card-accent, var(--teal));
}
.stat-card:hover { background: rgba(255,255,255,0.09); transform: translateX(4px); }
.stat-left { }
.stat-label { font-size: 11px; color: var(--dim2); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 4px; }
.stat-sub { font-size: 11px; color: rgba(255,255,255,0.2); }
.stat-right { display: flex; align-items: center; gap: 12px; }
.stat-value {
  font-family: 'Playfair Display', serif;
  font-size: 42px; font-weight: 900; color: var(--white); line-height: 1;
}
.stat-glow { width: 10px; height: 10px; border-radius: 50%; animation: glowPulse 2.5s infinite; }

/* ── FEATURE STRIP ── */
.feature-strip {
  position: relative; z-index: 2;
  border-top: 1px solid var(--dim3); margin: 0 40px;
  padding: 22px 0; display: flex; gap: 40px; flex-wrap: wrap; align-items: center;
}
.feat-item { display: flex; align-items: center; gap: 10px; }
.feat-icon { color: var(--teal-l); display: flex; }
.feat-text { font-size: 12px; color: var(--dim2); }
.feat-sep { width: 4px; height: 4px; border-radius: 50%; background: var(--dim3); }

/* ── MODULES ── */
.modules-section { padding: 80px 40px; max-width: 1320px; margin: 0 auto; }

.section-header { margin-bottom: 52px; }
.section-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11px; font-weight: 700; color: var(--teal-l);
  text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px;
}
.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(30px, 4vw, 46px); font-weight: 900;
  color: var(--white); letter-spacing: -1.5px; line-height: 1.1;
  margin-bottom: 14px;
}
.section-sub { font-size: 14px; color: var(--dim); line-height: 1.7; max-width: 480px; }

.modules-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }

.module-card {
  position: relative; overflow: hidden;
  background: var(--glass); border: 1px solid var(--glass-b);
  border-radius: 22px; padding: 32px 30px; cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(16px);
  animation: fadeUp 0.6s ease both;
}
.module-card:hover {
  background: rgba(255,255,255,0.09);
  border-color: var(--card-color, var(--teal));
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(0,0,0,0.3);
}
.module-card::before {
  content: ''; position: absolute; inset: 0; opacity: 0;
  background: radial-gradient(ellipse at top left, var(--card-glow, rgba(13,148,136,0.12)), transparent 65%);
  transition: opacity 0.4s;
}
.module-card:hover::before { opacity: 1; }

.card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; }
.card-num {
  font-family: 'Playfair Display', serif;
  font-size: 68px; font-weight: 900; line-height: 1;
  color: rgba(255,255,255,0.06); user-select: none;
  transition: color 0.3s; margin-top: -8px;
}
.module-card:hover .card-num { color: rgba(255,255,255,0.1); }
.card-badges { display: flex; align-items: center; gap: 10px; }
.card-tag {
  padding: 5px 11px; border-radius: 8px;
  font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  background: var(--card-bg, rgba(13,148,136,0.15));
  color: var(--card-color, var(--teal-l));
  border: 1px solid var(--card-border, rgba(13,148,136,0.25));
}
.card-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--card-bg, rgba(13,148,136,0.15));
  display: flex; align-items: center; justify-content: center;
  color: var(--card-color, var(--teal-l));
  opacity: 0; transform: translateX(-10px);
  transition: all 0.3s;
}
.module-card:hover .card-arrow { opacity: 1; transform: translateX(0); }

.card-icon-wrap {
  width: 52px; height: 52px; border-radius: 14px;
  background: var(--card-bg, rgba(13,148,136,0.12));
  border: 1px solid var(--card-border, rgba(13,148,136,0.2));
  display: flex; align-items: center; justify-content: center;
  color: var(--card-color, var(--teal-l));
  margin-bottom: 14px;
  transition: transform 0.3s;
}
.module-card:hover .card-icon-wrap { transform: scale(1.08); }

.card-title {
  font-family: 'Playfair Display', serif;
  font-size: 24px; font-weight: 700; color: var(--white);
  margin-bottom: 10px; letter-spacing: -0.5px;
}
.card-desc { font-size: 13.5px; color: var(--dim); line-height: 1.75; }

.card-footer {
  display: flex; align-items: center; gap: 8px;
  margin-top: 24px; padding-top: 18px;
  border-top: 1px solid var(--dim3);
  font-size: 12px; color: var(--dim2);
  opacity: 0; transform: translateY(6px);
  transition: all 0.3s;
}
.module-card:hover .card-footer { opacity: 1; transform: translateY(0); }
.card-footer-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--card-color, var(--teal-l)); }

/* ── BOTTOM BANNER ── */
.banner {
  margin: 0 40px 60px;
  background: var(--glass); border: 1px solid var(--glass-b);
  border-radius: 22px; padding: 36px 44px;
  backdrop-filter: blur(16px); position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: space-between; gap: 28px; flex-wrap: wrap;
}
.banner::before {
  content: ''; position: absolute; inset: 0;
  background: radial-gradient(ellipse at left center, rgba(13,148,136,0.1), transparent 65%);
  pointer-events: none;
}
.banner-left { position: relative; }
.banner-tag {
  font-size: 11px; text-transform: uppercase; letter-spacing: 2px;
  color: var(--teal-l); font-weight: 700; margin-bottom: 8px;
}
.banner-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(20px, 2.5vw, 28px); font-weight: 700;
  color: var(--white); margin-bottom: 6px; letter-spacing: -0.5px;
}
.banner-sub { font-size: 13px; color: var(--dim); }
.banner-right { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; position: relative; }

.banner-stat {
  text-align: center; padding: 12px 20px;
  background: rgba(255,255,255,0.04); border: 1px solid var(--dim3);
  border-radius: 14px;
}
.banner-stat-n { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 900; color: var(--white); line-height: 1; }
.banner-stat-n span { color: var(--teal-l); }
.banner-stat-l { font-size: 10px; color: var(--dim2); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

/* ── FOOTER ── */
.footer {
  margin: 0 40px 40px;
  background: rgba(255,255,255,0.025); border: 1px solid var(--glass-b);
  border-radius: 18px; padding: 24px 36px;
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;
}
.footer-brand { display: flex; align-items: center; gap: 12px; }
.footer-logo {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--teal), var(--sky));
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 900; color: #fff;
}
.footer-name { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--white); }
.footer-name span { color: var(--teal-l); }
.footer-stack { font-size: 11px; color: var(--dim2); margin-top: 2px; }
.footer-meta { display: flex; gap: 28px; flex-wrap: wrap; }
.footer-item { }
.footer-item-label { font-size: 10px; color: var(--dim2); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 3px; }
.footer-item-val { font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500; }

/* ── ECG decoration ── */
.ecg-wrap { height: 50px; overflow: hidden; opacity: 0.1; pointer-events: none; margin: 0 40px; }

/* ── RESPONSIVE ── */
@media (max-width: 1024px) {
  .hero-layout { grid-template-columns: 1fr; gap: 44px; }
  .stats-col { flex-direction: row; flex-wrap: wrap; }
  .stat-card { flex: 1 1 200px; }
  .hero { padding: 60px 24px 0; min-height: auto; padding-bottom: 40px; }
  .hero-heading { letter-spacing: -2px; }
}

@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .nav-date, .nav-logout { display: none; }
  .nav-menu-btn { display: flex; }
  .hero { padding: 44px 20px 0; }
  .feature-strip { margin: 0 20px; gap: 20px; }
  .modules-section { padding: 60px 20px; }
  .modules-grid { grid-template-columns: 1fr; }
  .banner { margin: 0 20px 40px; padding: 24px; }
  .footer { margin: 0 20px 28px; padding: 20px; flex-direction: column; gap: 16px; }
  .ecg-wrap { margin: 0 20px; }
  .stat-card { flex: 1 1 100%; }
  .hero-btns { flex-direction: column; }
  .btn-primary, .btn-ghost { width: 100%; justify-content: center; }
}

@media (max-width: 480px) {
  .hero-heading { font-size: 48px; letter-spacing: -2px; }
  .nav-pill { display: none; }
  .module-card { padding: 24px 20px; }
  .banner-right { width: 100%; }
  .footer-meta { gap: 16px; }
}
`;

const modules = [
  {
    label: 'Patients',
    path: '/patients',
    icon: Icons.people,
    num: '01', tag: 'RECORDS',
    desc: 'Register, manage and track all patient records, histories and medical data with full CRUD operations.',
    color: '#14b8a6',
    bg: 'rgba(20,184,166,0.12)',
    border: 'rgba(20,184,166,0.25)',
    glow: 'rgba(20,184,166,0.12)',
    footer: 'Full medical records management',
    delay: '0s',
  },
  {
    label: 'Doctors',
    path: '/doctors',
    icon: Icons.doctor,
    num: '02', tag: 'STAFF',
    desc: 'Manage medical staff, specializations, schedules and availability across all departments.',
    color: '#38bdf8',
    bg: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.25)',
    glow: 'rgba(56,189,248,0.12)',
    footer: 'Staff scheduling & management',
    delay: '0.08s',
  },
  {
    label: 'Appointments',
    path: '/appointments',
    icon: Icons.cal,
    num: '03', tag: 'SCHEDULE',
    desc: 'Book, track and manage all patient appointments, statuses and scheduling workflows.',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.12)',
    border: 'rgba(251,146,60,0.25)',
    glow: 'rgba(251,146,60,0.12)',
    footer: 'Smart scheduling workflows',
    delay: '0.16s',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: Icons.grid,
    num: '04', tag: 'ANALYTICS',
    desc: 'Real-time analytics, statistics and a complete operational overview of the entire system.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    glow: 'rgba(167,139,250,0.12)',
    footer: 'Live analytics & insights',
    delay: '0.24s',
  },
];

const statColors = {
  patients:     { color: '#14b8a6', label: 'Total Patients',     sub: 'Registered in system' },
  doctors:      { color: '#38bdf8', label: 'Active Doctors',     sub: 'Medical professionals' },
  appointments: { color: '#fb923c', label: 'Appointments',       sub: 'All time total' },
};

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0 });
  const [menuOpen, setMenuOpen] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';
  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')])
      .then(([p, d, a]) => setStats({ patients: p.data.length, doctors: d.data.length, appointments: a.data.length }))
      .catch(() => {});
  }, []);

  return (
    <>
      <style>{CSS}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="nav-logo">M</div>
          <div className="nav-title">Medi<span>Care</span></div>
          <div className="nav-pill" style={{ marginLeft: 10 }}>
            <span className="nav-dot" /> System Live
          </div>
        </div>

        <div className="nav-right">
          <span className="nav-date">{dateStr}</span>
          <div className="nav-avatar" title={user?.name}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <button className="nav-logout" onClick={logout}>
            <span style={{ display: 'flex' }}><Icons.logout /></span>
            Sign Out
          </button>
          <button className="nav-menu-btn" onClick={() => setMenuOpen(o => !o)}>
            {menuOpen ? <Icons.close /> : <Icons.menu />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {modules.map(m => (
          <div key={m.path} className="mobile-nav-item" onClick={() => { navigate(m.path); setMenuOpen(false); }}>
            <span className="mobile-nav-icon" style={{ color: m.color }}><m.icon /></span>
            {m.label}
          </div>
        ))}
        <div className="mobile-nav-item" onClick={logout} style={{ color: '#fca5a5' }}>
          <span className="mobile-nav-icon" style={{ color: '#fca5a5' }}><Icons.logout /></span>
          Sign Out
        </div>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-blob hb1" />
        <div className="hero-blob hb2" />
        <div className="hero-blob hb3" />
        <div className="grid-bg" />

        <div className="hero-inner">
          <div className="hero-eyebrow">
            <span className="nav-dot" />
            Good {greeting}, {user?.name?.split(' ')[0] || 'Doctor'}
          </div>

          <div className="hero-layout">
            {/* Left */}
            <div>
              <h1 className="hero-heading">
                Modern<br />
                <em>Patient</em><br />
                Care
              </h1>
              <p className="hero-sub">
                A unified platform for managing patients, doctors and appointments —
                built for the demands of modern healthcare administration.
              </p>
              <div className="hero-btns">
                <button className="btn-primary" onClick={() => navigate('/dashboard')}>
                  Open Dashboard <span style={{ display: 'flex' }}><Icons.ne /></span>
                </button>
                <button className="btn-ghost" onClick={() => navigate('/appointments')}>
                  Book Appointment <span style={{ display: 'flex' }}><Icons.arrow /></span>
                </button>
              </div>
            </div>

            {/* Right — Live stats */}
            <div className="stats-col">
              {Object.entries(stats).map(([key, val]) => {
                const { color, label, sub } = statColors[key];
                return (
                  <div className="stat-card" key={key} style={{ '--card-accent': color }}>
                    <div className="stat-left">
                      <div className="stat-label">{label}</div>
                      <div className="stat-sub">{sub}</div>
                    </div>
                    <div className="stat-right">
                      <div className="stat-value">{val}</div>
                      <div className="stat-glow" style={{ background: color, boxShadow: `0 0 16px ${color}` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="feature-strip" style={{ position: 'relative', zIndex: 2 }}>
          {[
            { icon: <Icons.shield />, text: 'HIPAA Compliant' },
            { icon: <Icons.zap />, text: 'Real-time Analytics' },
            { icon: <Icons.heart />, text: 'EHR Integrated' },
            { icon: null, text: 'JWT Authentication' },
            { icon: null, text: 'REST API Backend' },
            { icon: null, text: 'MongoDB Atlas' },
          ].map(({ icon, text }, i) => (
            <div key={text} className="feat-item">
              {i > 0 && <div className="feat-sep" />}
              {icon && <span className="feat-icon" style={{ color: 'var(--teal-l)' }}>{icon}</span>}
              <span className="feat-text">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES ── */}
      <section className="modules-section">
        <div className="section-header">
          <div className="section-eyebrow">
            <span className="nav-dot" /> System Modules
          </div>
          <h2 className="section-title">Quick Access</h2>
          <p className="section-sub">Select a module to manage your healthcare operations with full control.</p>
        </div>

        <div className="modules-grid">
          {modules.map(m => (
            <div
              key={m.path}
              className="module-card"
              onClick={() => navigate(m.path)}
              style={{
                '--card-color': m.color,
                '--card-bg': m.bg,
                '--card-border': m.border,
                '--card-glow': m.glow,
                animationDelay: m.delay,
              }}
            >
              <div className="card-top">
                <div className="card-num">{m.num}</div>
                <div className="card-badges">
                  <div className="card-tag">{m.tag}</div>
                  <div className="card-arrow"><Icons.arrow /></div>
                </div>
              </div>

              <div className="card-icon-wrap"><m.icon /></div>
              <div className="card-title">{m.label}</div>
              <div className="card-desc">{m.desc}</div>

              <div className="card-footer">
                <div className="card-footer-dot" />
                {m.footer}
                <span style={{ marginLeft: 'auto', display: 'flex', color: m.color }}><Icons.arrow /></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BANNER ── */}
      <div className="banner">
        <div className="banner-left">
          <div className="banner-tag">Platform Overview</div>
          <div className="banner-title">MediCare Admin Portal</div>
          <div className="banner-sub">Full Stack · React · Node.js · MongoDB Atlas · JWT Auth</div>
        </div>
        <div className="banner-right">
          {[
            { n: '5K', s: '+', label: 'Patients Served' },
            { n: '200', s: '+', label: 'Doctors Onboard' },
            { n: '99', s: '%', label: 'System Uptime' },
            { n: '256', s: '-bit', label: 'SSL Encryption' },
          ].map(({ n, s, label }) => (
            <div className="banner-stat" key={label}>
              <div className="banner-stat-n">{n}<span>{s}</span></div>
              <div className="banner-stat-l">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ECG */}
      <div className="ecg-wrap">
        <svg viewBox="0 0 1200 50" width="100%" height="50" xmlns="http://www.w3.org/2000/svg">
          <polyline fill="none" stroke="#14b8a6" strokeWidth="1.5"
            points="0,25 120,25 150,25 165,5 180,45 195,12 210,25 400,25 430,25 445,3 460,47 475,14 490,25 680,25 710,25 725,6 740,44 755,15 770,25 960,25 990,25 1005,4 1020,46 1035,13 1050,25 1200,25"/>
        </svg>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="footer-logo">M</div>
          <div>
            <div className="footer-name">Medi<span>Care</span></div>
            <div className="footer-stack">Crafted by Amrish Kumar Tiwary</div>
          </div>
        </div>
        <div className="footer-meta">
          {[
            { label: 'Frontend', val: 'React + Vite' },
            { label: 'Backend', val: 'Node + Express' },
            { label: 'Database', val: 'MongoDB Atlas' },
            { label: 'Auth', val: 'JWT Tokens' },
          ].map(({ label, val }) => (
            <div className="footer-item" key={label}>
              <div className="footer-item-label">{label}</div>
              <div className="footer-item-val">{val}</div>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
}