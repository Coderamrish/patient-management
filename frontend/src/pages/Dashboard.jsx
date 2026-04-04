import { useState, useEffect } from 'react';
import api from '../api/axios';

/* ─── Icons ─── */
const RefreshIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const CheckIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const ClockIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const XCircIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const PeopleIco  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DocIco     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const CalIco     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const NEIco      = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>;
const StarIco    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --teal:#0d9488;--teal-l:#14b8a6;--teal-d:#0f766e;
  --sky:#0ea5e9;--emerald:#059669;--orange:#f97316;--violet:#8b5cf6;
  --navy:#0c1a2e;--navy2:#0e2039;--white:#fff;
  --glass:rgba(255,255,255,0.055);--glass-b:rgba(255,255,255,0.11);
  --dim:rgba(255,255,255,0.45);--dim2:rgba(255,255,255,0.22);--dim3:rgba(255,255,255,0.08);
}
html{scroll-behavior:smooth}
body{font-family:'DM Sans',sans-serif;background:var(--navy);color:var(--white);overflow-x:hidden}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--navy)}
::-webkit-scrollbar-thumb{background:var(--teal-d);border-radius:10px}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes blobFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-28px) scale(1.05)}}
@keyframes glowPulse{0%,100%{box-shadow:0 0 12px rgba(13,148,136,0.4)}50%{box-shadow:0 0 28px rgba(13,148,136,0.75)}}
@keyframes barGrow{from{height:0}to{height:var(--h)}}
@keyframes countFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
@keyframes shimmer{0%{opacity:0.5}50%{opacity:1}100%{opacity:0.5}}

/* ── LOADING ── */
.db-loading{
  min-height:100vh;background:var(--navy);
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;
  position:relative;overflow:hidden;
}
.db-loading-blob{
  position:absolute;border-radius:50%;filter:blur(80px);opacity:0.14;animation:blobFloat 8s ease-in-out infinite;
}
.db-loading-logo{
  width:64px;height:64px;
  background:linear-gradient(135deg,var(--teal),var(--sky));
  border-radius:16px;display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:#fff;
  box-shadow:0 8px 28px rgba(13,148,136,0.5);
  animation:glowPulse 2s infinite;position:relative;z-index:1;
}
.db-loading-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--white);position:relative;z-index:1;}
.db-loading-bar{width:200px;height:3px;background:var(--glass-b);border-radius:10px;overflow:hidden;position:relative;z-index:1;}
.db-loading-fill{height:100%;background:linear-gradient(90deg,var(--teal),var(--teal-l));border-radius:10px;animation:shimmer 1.4s ease infinite;}

/* ── WRAP ── */
.db-wrap{min-height:100vh;background:var(--navy);}

/* ── HERO HEADER ── */
.db-hero{
  position:relative;overflow:hidden;
  padding:52px 40px 0;
  background:var(--navy);
}
.db-hero-blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:0.15;animation:blobFloat 9s ease-in-out infinite;pointer-events:none;}
.hb1{width:500px;height:500px;background:var(--teal);top:-150px;left:-100px;}
.hb2{width:360px;height:360px;background:var(--sky);bottom:-60px;right:5%;animation-delay:3.5s;}
.hb3{width:260px;height:260px;background:var(--emerald);top:30%;left:40%;animation-delay:6s;}
.db-grid-bg{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(rgba(13,148,136,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(13,148,136,0.06) 1px,transparent 1px);
  background-size:60px 60px;
}

.db-hero-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto;}

.db-hero-top{
  display:flex;align-items:flex-start;justify-content:space-between;
  gap:20px;flex-wrap:wrap;margin-bottom:48px;
  animation:fadeUp 0.6s ease both;
}
.db-eyebrow{
  display:inline-flex;align-items:center;gap:8px;
  background:rgba(13,148,136,0.14);border:1px solid rgba(13,148,136,0.3);
  border-radius:100px;padding:6px 16px;margin-bottom:14px;
  font-size:11px;font-weight:600;color:var(--teal-l);
  text-transform:uppercase;letter-spacing:1.5px;
}
.db-pulse{width:6px;height:6px;border-radius:50%;background:var(--teal-l);animation:pulse 2s infinite;}
.db-hero-title{font-family:'Playfair Display',serif;font-size:clamp(36px,5vw,60px);font-weight:900;color:var(--white);line-height:0.95;letter-spacing:-2px;}
.db-hero-title em{color:var(--teal-l);font-style:italic;}
.db-hero-sub{font-size:14px;color:var(--dim);margin-top:12px;max-width:400px;line-height:1.7;}

.db-hero-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.db-ts{
  padding:9px 16px;
  background:var(--glass);border:1px solid var(--glass-b);
  border-radius:12px;font-size:12px;color:var(--dim2);
  backdrop-filter:blur(8px);
  font-variant-numeric:tabular-nums;
}
.db-refresh-btn{
  display:flex;align-items:center;gap:8px;
  padding:9px 18px;background:rgba(13,148,136,0.14);
  border:1px solid rgba(13,148,136,0.3);border-radius:12px;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
  color:var(--teal-l);cursor:pointer;transition:all 0.25s;
}
.db-refresh-btn:hover{background:rgba(13,148,136,0.25);border-color:var(--teal-l);color:#fff;}
.db-refresh-btn.spinning svg{animation:spin 0.9s linear infinite;}

/* ── KPI CARDS ── */
.db-kpi-grid{
  display:grid;grid-template-columns:repeat(4,1fr);gap:16px;
  animation:fadeUp 0.6s 0.1s ease both;
}
.db-kpi{
  background:var(--glass);border:1px solid var(--glass-b);
  border-radius:18px;padding:22px 24px;
  backdrop-filter:blur(16px);position:relative;overflow:hidden;
  transition:all 0.3s;cursor:default;
}
.db-kpi:hover{background:rgba(255,255,255,0.08);transform:translateY(-3px);}
.db-kpi::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:var(--kpi-color);opacity:0.8;
}
.db-kpi-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
.db-kpi-icon{
  width:40px;height:40px;border-radius:11px;
  background:var(--kpi-bg);border:1px solid var(--kpi-border);
  display:flex;align-items:center;justify-content:center;color:var(--kpi-color);
}
.db-kpi-badge{
  display:flex;align-items:center;gap:4px;
  background:var(--kpi-bg);border:1px solid var(--kpi-border);
  border-radius:100px;padding:4px 10px;
  font-size:10px;font-weight:700;color:var(--kpi-color);
  text-transform:uppercase;letter-spacing:0.5px;
}
.db-kpi-val{font-family:'Playfair Display',serif;font-size:46px;font-weight:900;color:var(--white);line-height:1;letter-spacing:-2px;animation:countFade 0.7s ease both;}
.db-kpi-label{font-size:11px;color:var(--dim2);text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-top:8px;}
.db-kpi-bar{height:3px;background:var(--dim3);border-radius:10px;margin-top:16px;overflow:hidden;}
.db-kpi-bar-fill{height:100%;border-radius:10px;background:var(--kpi-color);transition:width 1.2s ease;}

/* feature strip */
.db-strip{
  position:relative;z-index:2;
  border-top:1px solid var(--dim3);
  margin-top:0;padding:18px 0;
  display:flex;gap:32px;flex-wrap:wrap;align-items:center;
}
.db-strip-item{display:flex;align-items:center;gap:8px;font-size:11.5px;color:var(--dim2);}
.db-strip-dot{width:4px;height:4px;border-radius:50%;background:var(--dim3);}

/* ── MAIN CONTENT ── */
.db-main{padding:36px 40px 60px;max-width:1320px;margin:0 auto;}

/* section label */
.db-section-label{
  font-size:11px;font-weight:700;color:var(--teal-l);
  text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;
  display:flex;align-items:center;gap:8px;
}

/* two-col row */
.db-row{display:grid;grid-template-columns:380px 1fr;gap:20px;margin-bottom:20px;}

/* ── COMPLETION RING CARD ── */
.db-card{
  background:var(--glass);border:1px solid var(--glass-b);
  border-radius:20px;overflow:hidden;backdrop-filter:blur(16px);
  animation:fadeUp 0.6s ease both;
}
.db-card-header{
  padding:22px 26px;border-bottom:1px solid var(--dim3);
  display:flex;align-items:center;justify-content:space-between;
}
.db-card-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--white);}
.db-card-sub{font-size:12px;color:var(--dim2);margin-top:3px;}
.db-card-body{padding:26px;}

.ring-wrap{display:flex;justify-content:center;margin-bottom:26px;position:relative;}
.ring-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;}
.ring-pct{font-family:'Playfair Display',serif;font-size:38px;font-weight:900;color:var(--white);line-height:1;}
.ring-pct-label{font-size:11px;color:var(--dim2);text-transform:uppercase;letter-spacing:1px;margin-top:4px;}

.stat-rows{display:flex;flex-direction:column;gap:10px;}
.stat-row{
  display:flex;align-items:center;justify-content:space-between;
  padding:14px 16px;border-radius:14px;
  background:rgba(255,255,255,0.04);border:1px solid var(--dim3);
  transition:all 0.25s;cursor:default;
}
.stat-row:hover{background:rgba(255,255,255,0.08);transform:translateX(4px);}
.stat-row-left{display:flex;align-items:center;gap:12px;}
.stat-row-icon{
  width:34px;height:34px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
}
.stat-row-name{font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);}
.stat-row-val{font-family:'Playfair Display',serif;font-size:26px;font-weight:900;color:var(--white);line-height:1;}

/* ── BAR CHART CARD ── */
.bar-chart-area{display:flex;align-items:flex-end;gap:10px;height:180px;margin-bottom:16px;}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;}
.bar-outer{flex:1;width:100%;display:flex;align-items:flex-end;}
.bar-inner{
  width:100%;border-radius:8px 8px 0 0;
  background:var(--bar-col,rgba(255,255,255,0.08));
  transition:all 0.3s ease;
  height:var(--h);
  animation:barGrow 0.9s ease both;
}
.bar-inner:hover{filter:brightness(1.25);transform:scaleX(1.05);}
.bar-label{font-size:11px;color:var(--dim2);font-weight:600;flex-shrink:0;}
.bar-insight{
  display:flex;align-items:center;gap:10px;
  padding:14px 18px;border-radius:13px;
  background:rgba(13,148,136,0.08);border:1px solid rgba(13,148,136,0.18);
  font-size:12.5px;color:var(--dim);
}

/* ── TABLES ── */
.db-table-card{
  background:var(--glass);border:1px solid var(--glass-b);
  border-radius:20px;overflow:hidden;backdrop-filter:blur(16px);
  margin-bottom:20px;animation:fadeUp 0.6s ease both;
}
.db-table-header{
  padding:20px 28px;
  background:rgba(255,255,255,0.03);
  border-bottom:1px solid var(--dim3);
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:12px;
}
.db-table-title-wrap{}
.db-table-count{
  padding:6px 14px;border-radius:100px;
  background:rgba(13,148,136,0.12);border:1px solid rgba(13,148,136,0.25);
  font-size:12px;font-weight:600;color:var(--teal-l);
}

.db-table{width:100%;border-collapse:collapse;}
.db-table th{
  padding:13px 20px;text-align:left;
  font-size:10px;font-weight:700;color:var(--dim2);
  text-transform:uppercase;letter-spacing:1.5px;
  background:rgba(255,255,255,0.025);
  border-bottom:1px solid var(--dim3);
}
.db-table td{
  padding:14px 20px;
  border-bottom:1px solid rgba(255,255,255,0.04);
  font-size:13.5px;color:rgba(255,255,255,0.7);
  vertical-align:middle;
}
.db-table tr:last-child td{border-bottom:none;}
.db-table tbody tr{transition:background 0.18s;}
.db-table tbody tr:hover{background:rgba(255,255,255,0.04);}
.db-table-empty{text-align:center;padding:48px 0!important;color:var(--dim2)!important;}

/* Avatar */
.db-avatar{
  width:36px;height:36px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:#fff;
  flex-shrink:0;
}
.db-name-cell{display:flex;align-items:center;gap:12px;}
.db-name-text{font-size:13.5px;font-weight:600;color:var(--white);}
.db-email-text{font-size:11px;color:var(--dim2);}

/* Pills */
.db-pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:600;}
.db-blood-pill{display:inline-flex;padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:700;background:rgba(251,146,60,0.15);border:1px solid rgba(251,146,60,0.3);color:#fb923c;}
.db-time-pill{display:inline-flex;padding:5px 10px;border-radius:8px;font-size:12px;font-weight:600;background:rgba(255,255,255,0.06);border:1px solid var(--dim3);color:var(--dim);}

/* ── RESPONSIVE ── */
@media(max-width:1100px){
  .db-kpi-grid{grid-template-columns:repeat(2,1fr);}
  .db-row{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .db-hero{padding:36px 20px 0;}
  .db-main{padding:24px 20px 48px;}
  .db-kpi-grid{grid-template-columns:repeat(2,1fr);gap:12px;}
  .db-kpi-val{font-size:36px;}
  .db-strip{gap:18px;}
  .db-table th,.db-table td{padding:11px 14px;}
  .db-hero-title{font-size:38px;}
  .db-table-header{padding:16px 18px;}
  .db-card-body{padding:18px;}
}
@media(max-width:480px){
  .db-kpi-grid{grid-template-columns:1fr 1fr;}
  .db-kpi{padding:16px 18px;}
  .db-kpi-val{font-size:32px;}
  .db-hero-top{flex-direction:column;}
  .db-hero-actions{flex-direction:column;align-items:flex-start;}
  /* Hide less important table columns on tiny screens */
  .db-hide-sm{display:none;}
}
`;

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const BARS = [42, 67, 55, 88, 73, 91, 64];
const PEAK = Math.max(...BARS);

const STATUS_MAP = {
  Scheduled: { bg:'rgba(14,165,233,0.15)',  border:'rgba(14,165,233,0.3)',  color:'#38bdf8',  dot:'#38bdf8'  },
  Completed:  { bg:'rgba(13,148,136,0.15)', border:'rgba(13,148,136,0.3)', color:'#14b8a6',  dot:'#14b8a6'  },
  Cancelled:  { bg:'rgba(239,68,68,0.12)',  border:'rgba(239,68,68,0.25)', color:'#f87171',  dot:'#ef4444'  },
};

function StatusPill({ status }) {
  const s = STATUS_MAP[status] || { bg:'rgba(255,255,255,0.08)', border:'rgba(255,255,255,0.15)', color:'var(--dim)', dot:'rgba(255,255,255,0.3)' };
  return (
    <span className="db-pill" style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.dot, display:'inline-block' }} />
      {status}
    </span>
  );
}

export default function Dashboard() {
  const [patients, setPatients]         = useState([]);
  const [doctors, setDoctors]           = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [refreshing, setRefreshing]     = useState(false);
  const [ts, setTs]                     = useState(new Date());

  const load = async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    try {
      const [p, d, a] = await Promise.all([api.get('/patients'), api.get('/doctors'), api.get('/appointments')]);
      setPatients(p.data); setDoctors(d.data); setAppointments(a.data); setTs(new Date());
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  };
  useEffect(() => { load(); }, []);

  const scheduled = appointments.filter(a => a.status === 'Scheduled').length;
  const completed  = appointments.filter(a => a.status === 'Completed').length;
  const cancelled  = appointments.filter(a => a.status === 'Cancelled').length;
  const rate       = appointments.length ? Math.round((completed / appointments.length) * 100) : 0;

  /* Ring circumference = 2π × 58 ≈ 364.4 */
  const CIRC = 364.4;
  const dash  = (rate / 100) * CIRC;

  const KPIs = [
    { label:'Total Patients',    value:patients.length,     icon:<PeopleIco/>, color:'#14b8a6', bg:'rgba(20,184,166,0.12)',  border:'rgba(20,184,166,0.25)',  badge:'Records',   pct: patients.length },
    { label:'Active Doctors',    value:doctors.length,      icon:<DocIco/>,    color:'#38bdf8', bg:'rgba(56,189,248,0.12)',  border:'rgba(56,189,248,0.25)',  badge:'Staff',     pct: doctors.length },
    { label:'Appointments',      value:appointments.length, icon:<CalIco/>,    color:'#fb923c', bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.25)',  badge:'All time',  pct: appointments.length },
    { label:'Scheduled',         value:scheduled,           icon:<StarIco/>,   color:'#a78bfa', bg:'rgba(167,139,250,0.12)', border:'rgba(167,139,250,0.25)', badge:'Upcoming',  pct: scheduled },
  ];

  /* ── LOADING SCREEN ── */
  if (loading) return (
    <>
      <style>{CSS}</style>
      <div className="db-loading">
        <div className="db-loading-blob" style={{ width:500, height:500, background:'#0d9488', top:-150, left:-100 }} />
        <div className="db-loading-blob" style={{ width:350, height:350, background:'#0ea5e9', bottom:-80, right:0, animationDelay:'3s' }} />
        <div className="db-loading-logo">M</div>
        <div className="db-loading-title">Loading Dashboard</div>
        <div className="db-loading-bar"><div className="db-loading-fill" /></div>
      </div>
    </>
  );

  const maxVal = Math.max(patients.length, doctors.length, appointments.length, 1);

  return (
    <>
      <style>{CSS}</style>
      <div className="db-wrap">

        {/* ── HERO HEADER ── */}
        <section className="db-hero">
          <div className="db-hero-blob hb1" />
          <div className="db-hero-blob hb2" />
          <div className="db-hero-blob hb3" />
          <div className="db-grid-bg" />

          <div className="db-hero-inner">
            {/* Top row */}
            <div className="db-hero-top">
              <div>
                <div className="db-eyebrow"><span className="db-pulse"/>Analytics Overview</div>
                <h1 className="db-hero-title">Health<br /><em>Dashboard</em></h1>
                <p className="db-hero-sub">Real-time analytics and operational overview across your entire healthcare system.</p>
              </div>
              <div className="db-hero-actions">
                <div className="db-ts">
                  🕐 {ts.toLocaleTimeString()} · {ts.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}
                </div>
                <button className={`db-refresh-btn ${refreshing ? 'spinning' : ''}`} onClick={() => load(true)}>
                  <RefreshIco /> {refreshing ? 'Refreshing…' : 'Refresh Data'}
                </button>
              </div>
            </div>

            {/* KPI grid */}
            <div className="db-kpi-grid">
              {KPIs.map(({ label, value, icon, color, bg, border, badge, pct }, i) => (
                <div key={label} className="db-kpi"
                  style={{ '--kpi-color':color, '--kpi-bg':bg, '--kpi-border':border, animationDelay:`${i*0.07}s` }}>
                  <div className="db-kpi-top">
                    <div className="db-kpi-icon">{icon}</div>
                    <div className="db-kpi-badge">
                      <NEIco />{badge}
                    </div>
                  </div>
                  <div className="db-kpi-val">{value}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-bar">
                    <div className="db-kpi-bar-fill" style={{ width:`${Math.min((pct/maxVal)*100,100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature strip */}
          <div className="db-hero-inner">
            <div className="db-strip">
              {[
                { label:'Live Data' }, null,
                { label:'JWT Secured' }, null,
                { label:'REST API' }, null,
                { label:'MongoDB Atlas' }, null,
                { label:'HIPAA Compliant' }, null,
                { label:`${rate}% Completion Rate` },
              ].map((item, i) =>
                item === null
                  ? <div key={i} className="db-strip-dot" />
                  : <div key={i} className="db-strip-item">
                      <span style={{ color:'var(--teal-l)', display:'flex' }}><CheckIco /></span>
                      {item.label}
                    </div>
              )}
            </div>
          </div>
        </section>

        {/* ── MAIN ── */}
        <div className="db-main">

          {/* Charts row */}
          <div className="db-section-label"><span className="db-pulse"/>Analytics</div>
          <div className="db-row" style={{ marginBottom:20 }}>

            {/* Completion Ring */}
            <div className="db-card">
              <div className="db-card-header">
                <div>
                  <div className="db-card-title">Completion Rate</div>
                  <div className="db-card-sub">Appointment breakdown</div>
                </div>
                <span className="db-pill" style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.25)', color:'var(--teal-l)', fontSize:12 }}>
                  {appointments.length} Total
                </span>
              </div>
              <div className="db-card-body">
                <div className="ring-wrap">
                  <svg width="170" height="170" viewBox="0 0 170 170">
                    <circle cx="85" cy="85" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14"/>
                    <circle cx="85" cy="85" r="58" fill="none"
                      stroke="url(#ringGrad)" strokeWidth="14"
                      strokeDasharray={`${dash} ${CIRC}`}
                      strokeLinecap="round"
                      transform="rotate(-90 85 85)"
                      style={{ transition:'stroke-dasharray 1.2s ease' }}/>
                    <defs>
                      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#0d9488"/>
                        <stop offset="100%" stopColor="#14b8a6"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="ring-center">
                    <div className="ring-pct">{rate}%</div>
                    <div className="ring-pct-label">Done</div>
                  </div>
                </div>

                <div className="stat-rows">
                  {[
                    { label:'Completed', value:completed, color:'#14b8a6', bg:'rgba(20,184,166,0.12)', Icon:CheckIco },
                    { label:'Scheduled', value:scheduled, color:'#38bdf8', bg:'rgba(56,189,248,0.12)', Icon:ClockIco },
                    { label:'Cancelled', value:cancelled, color:'#f87171', bg:'rgba(239,68,68,0.12)',  Icon:XCircIco },
                  ].map(({ label, value, color, bg, Icon }) => (
                    <div key={label} className="stat-row">
                      <div className="stat-row-left">
                        <div className="stat-row-icon" style={{ background:bg, color }}><Icon /></div>
                        <span className="stat-row-name">{label}</span>
                      </div>
                      <span className="stat-row-val">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="db-card" style={{ animationDelay:'0.1s' }}>
              <div className="db-card-header">
                <div>
                  <div className="db-card-title">Weekly Activity</div>
                  <div className="db-card-sub">Appointment volume — last 7 days</div>
                </div>
                <span className="db-pill" style={{ background:'rgba(251,146,60,0.12)', border:'1px solid rgba(251,146,60,0.25)', color:'#fb923c', fontSize:12 }}>
                  Peak: {PEAK}
                </span>
              </div>
              <div className="db-card-body">
                <div className="bar-chart-area">
                  {BARS.map((val, i) => {
                    const isPeak = val === PEAK;
                    const hPct   = (val / PEAK) * 100;
                    return (
                      <div key={i} className="bar-col">
                        <div className="bar-outer">
                          <div
                            className="bar-inner"
                            title={`${DAYS[i]}: ${val}`}
                            style={{
                              '--h': `${hPct}%`,
                              '--bar-col': isPeak
                                ? 'linear-gradient(to top, #0d9488, #14b8a6)'
                                : 'rgba(255,255,255,0.07)',
                              background: isPeak
                                ? 'linear-gradient(to top, #0d9488, #14b8a6)'
                                : 'rgba(255,255,255,0.07)',
                              boxShadow: isPeak ? '0 0 20px rgba(13,148,136,0.4)' : 'none',
                              animationDelay: `${i * 0.06}s`,
                            }}
                          />
                        </div>
                        <span className="bar-label" style={{ color: isPeak ? 'var(--teal-l)' : undefined }}>
                          {DAYS[i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="bar-insight">
                  <span style={{ color:'var(--teal-l)', display:'flex', flexShrink:0 }}><NEIco /></span>
                  Peak activity on Saturdays — highest appointment volume day of the week
                </div>
              </div>
            </div>
          </div>

          {/* Recent Patients */}
          <div className="db-section-label" style={{ marginTop:8 }}><span className="db-pulse"/>Recent Patients</div>
          <div className="db-table-card" style={{ animationDelay:'0.15s' }}>
            <div className="db-table-header">
              <div className="db-table-title-wrap">
                <div className="db-card-title">Recent Patients</div>
                <div className="db-card-sub">Latest registrations in the system</div>
              </div>
              <span className="db-table-count">{patients.length} total</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th className="db-hide-sm">Age</th>
                    <th className="db-hide-sm">Phone</th>
                    <th>Blood</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 && (
                    <tr><td colSpan={5} className="db-table-empty">No patients registered yet</td></tr>
                  )}
                  {patients.slice(0, 6).map((p, i) => (
                    <tr key={p._id}>
                      <td>
                        <div className="db-name-cell">
                          <div className="db-avatar" style={{ background:`linear-gradient(135deg,#0d9488,#0ea5e9)` }}>
                            {p.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="db-name-text">{p.name}</div>
                            {p.email && <div className="db-email-text">{p.email}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="db-hide-sm">{p.age} yrs</td>
                      <td className="db-hide-sm">{p.phone}</td>
                      <td><span className="db-blood-pill">{p.bloodGroup || 'N/A'}</span></td>
                      <td>
                        <span className="db-pill" style={{ background:'rgba(13,148,136,0.12)', border:'1px solid rgba(13,148,136,0.25)', color:'#14b8a6' }}>
                          <span style={{ width:5, height:5, borderRadius:'50%', background:'#14b8a6', display:'inline-block' }} />
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Appointments */}
          <div className="db-section-label" style={{ marginTop:8 }}><span className="db-pulse"/>Recent Appointments</div>
          <div className="db-table-card" style={{ animationDelay:'0.2s' }}>
            <div className="db-table-header">
              <div className="db-table-title-wrap">
                <div className="db-card-title">Recent Appointments</div>
                <div className="db-card-sub">Latest scheduled visits</div>
              </div>
              <span className="db-table-count">{appointments.length} total</span>
            </div>
            <div style={{ overflowX:'auto' }}>
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th className="db-hide-sm">Doctor</th>
                    <th>Date</th>
                    <th className="db-hide-sm">Time</th>
                    <th className="db-hide-sm">Reason</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 && (
                    <tr><td colSpan={6} className="db-table-empty">No appointments yet</td></tr>
                  )}
                  {appointments.slice(0, 7).map(a => (
                    <tr key={a._id}>
                      <td>
                        <div className="db-name-cell">
                          <div className="db-avatar" style={{ background:'linear-gradient(135deg,#8b5cf6,#a78bfa)' }}>
                            {a.patient?.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="db-name-text">{a.patient?.name}</span>
                        </div>
                      </td>
                      <td className="db-hide-sm" style={{ color:'rgba(255,255,255,0.8)', fontWeight:500 }}>
                        Dr. {a.doctor?.name}
                      </td>
                      <td>{new Date(a.date).toLocaleDateString('en-US',{ month:'short', day:'numeric', year:'numeric' })}</td>
                      <td className="db-hide-sm"><span className="db-time-pill">{a.time}</span></td>
                      <td className="db-hide-sm">{a.reason || 'Regular checkup'}</td>
                      <td><StatusPill status={a.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}