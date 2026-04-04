import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

:root {
  --teal: #0d9488;
  --teal-l: #14b8a6;
  --teal-d: #0f766e;
  --sky: #0ea5e9;
  --navy: #0c1a2e;
  --navy-2: #0e2039;
  --white: #ffffff;
  --glass: rgba(255,255,255,0.055);
  --glass-b: rgba(255,255,255,0.11);
  --dim: rgba(255,255,255,0.45);
  --dim2: rgba(255,255,255,0.22);
}

/* ── NAVBAR WRAP ── */
.mc-nav {
  position: sticky;
  top: 0;
  z-index: 1000;
  font-family: 'DM Sans', sans-serif;
}

/* Blurred backdrop bar */
.mc-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 66px;
  padding: 0 36px;
  background: rgba(12, 26, 46, 0.92);
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  position: relative;
  z-index: 2;
  transition: background 0.3s;
}

/* Subtle teal glow line at very top */
.mc-nav-inner::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--teal) 35%, var(--teal-l) 60%, transparent 100%);
  opacity: 0.7;
}

/* ── BRAND ── */
.mc-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  text-decoration: none;
  flex-shrink: 0;
}
.mc-logo {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--teal), var(--sky));
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 18px; font-weight: 900; color: #fff;
  box-shadow: 0 4px 16px rgba(13,148,136,0.45);
  flex-shrink: 0;
  transition: transform 0.25s, box-shadow 0.25s;
}
.mc-brand:hover .mc-logo {
  transform: scale(1.08);
  box-shadow: 0 6px 22px rgba(13,148,136,0.65);
}
.mc-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 20px; font-weight: 700;
  color: var(--white);
  letter-spacing: -0.3px;
}
.mc-brand-name span { color: var(--teal-l); }

.mc-live-pill {
  display: flex; align-items: center; gap: 6px;
  background: rgba(13,148,136,0.13);
  border: 1px solid rgba(13,148,136,0.28);
  border-radius: 100px;
  padding: 4px 11px;
  font-size: 10px; font-weight: 600;
  color: var(--teal-l);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-left: 2px;
}
.mc-pulse {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--teal-l);
  animation: mcPulse 2s ease-in-out infinite;
}
@keyframes mcPulse { 0%,100%{opacity:1} 50%{opacity:0.25} }

/* ── DESKTOP NAV LINKS ── */
.mc-links {
  display: flex;
  align-items: center;
  gap: 2px;
  list-style: none;
}

.mc-link {
  position: relative;
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--dim);
  padding: 7px 14px;
  border-radius: 10px;
  transition: color 0.22s, background 0.22s;
  display: flex; align-items: center; gap: 7px;
  white-space: nowrap;
}
.mc-link:hover {
  color: var(--white);
  background: var(--glass);
}
.mc-link.active {
  color: var(--white);
  background: rgba(13,148,136,0.15);
}
.mc-link.active::after {
  content: '';
  position: absolute;
  bottom: -1px; left: 50%;
  transform: translateX(-50%);
  width: 20px; height: 2px;
  background: var(--teal-l);
  border-radius: 2px;
}
.mc-link-icon {
  display: flex; align-items: center;
  opacity: 0.65;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
.mc-link:hover .mc-link-icon,
.mc-link.active .mc-link-icon { opacity: 1; color: var(--teal-l); }

/* ── RIGHT SIDE ── */
.mc-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* User chip */
.mc-user-chip {
  display: flex; align-items: center; gap: 9px;
  background: var(--glass);
  border: 1px solid var(--glass-b);
  border-radius: 100px;
  padding: 5px 14px 5px 6px;
  cursor: default;
}
.mc-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--teal), var(--teal-d));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 13px; font-weight: 700; color: #fff;
  box-shadow: 0 0 0 2px rgba(13,148,136,0.35);
  flex-shrink: 0;
}
.mc-username {
  font-size: 12.5px; font-weight: 500;
  color: rgba(255,255,255,0.75);
  max-width: 100px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}

/* Logout button */
.mc-logout {
  display: flex; align-items: center; gap: 7px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.22);
  border-radius: 10px;
  padding: 8px 16px;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; font-weight: 500;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.22s;
  white-space: nowrap;
}
.mc-logout:hover {
  background: rgba(239,68,68,0.2);
  border-color: rgba(239,68,68,0.4);
  color: #fff;
}

/* Hamburger button */
.mc-ham {
  display: none;
  align-items: center; justify-content: center;
  width: 38px; height: 38px;
  background: var(--glass);
  border: 1px solid var(--glass-b);
  border-radius: 10px;
  cursor: pointer;
  color: var(--white);
  transition: all 0.2s;
  flex-shrink: 0;
}
.mc-ham:hover { background: rgba(13,148,136,0.15); border-color: var(--teal); }

/* ── MOBILE DRAWER ── */
.mc-drawer {
  position: fixed;
  top: 66px; left: 0; right: 0; bottom: 0;
  z-index: 999;
  display: flex;
  flex-direction: column;
  background: var(--navy-2);
  backdrop-filter: blur(24px);
  padding: 20px 20px 32px;
  transform: translateX(-100%);
  transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
  overflow-y: auto;
  border-top: 1px solid var(--glass-b);
}
.mc-drawer.open {
  transform: translateX(0);
}

/* Mobile greeting */
.mc-drawer-greeting {
  display: flex; align-items: center; gap: 12px;
  background: var(--glass);
  border: 1px solid var(--glass-b);
  border-radius: 14px;
  padding: 14px 18px;
  margin-bottom: 20px;
}
.mc-drawer-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--teal), var(--teal-d));
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 18px; font-weight: 700; color: #fff;
  box-shadow: 0 0 0 3px rgba(13,148,136,0.3);
  flex-shrink: 0;
}
.mc-drawer-name { font-size: 15px; font-weight: 600; color: var(--white); }
.mc-drawer-role { font-size: 11px; color: var(--dim2); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

.mc-drawer-section-title {
  font-size: 10px; text-transform: uppercase; letter-spacing: 2px;
  color: var(--dim2); font-weight: 600;
  padding: 0 4px; margin-bottom: 8px; margin-top: 4px;
}

.mc-drawer-links { display: flex; flex-direction: column; gap: 6px; flex: 1; }

.mc-drawer-link {
  display: flex; align-items: center; gap: 14px;
  padding: 13px 16px;
  background: var(--glass);
  border: 1px solid var(--glass-b);
  border-radius: 13px;
  text-decoration: none;
  font-size: 14.5px; font-weight: 500;
  color: rgba(255,255,255,0.8);
  transition: all 0.22s;
}
.mc-drawer-link:hover {
  background: rgba(13,148,136,0.14);
  border-color: rgba(13,148,136,0.3);
  color: var(--white);
}
.mc-drawer-link.active {
  background: rgba(13,148,136,0.16);
  border-color: rgba(13,148,136,0.35);
  color: var(--white);
}
.mc-drawer-link-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all 0.22s;
}
.mc-drawer-link:hover .mc-drawer-link-icon,
.mc-drawer-link.active .mc-drawer-link-icon {
  background: rgba(13,148,136,0.2) !important;
}
.mc-drawer-link-label { flex: 1; }
.mc-drawer-link-arrow { font-size: 14px; color: var(--dim2); transition: transform 0.2s; }
.mc-drawer-link:hover .mc-drawer-link-arrow { transform: translateX(3px); color: var(--teal-l); }

/* Mobile logout */
.mc-drawer-logout {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; margin-top: 14px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  border-radius: 13px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14.5px; font-weight: 500;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.22s;
  width: 100%; text-align: left;
}
.mc-drawer-logout:hover {
  background: rgba(239,68,68,0.18);
  border-color: rgba(239,68,68,0.4);
  color: #fff;
}
.mc-drawer-logout-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: rgba(239,68,68,0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* Backdrop overlay for mobile */
.mc-overlay {
  display: none;
  position: fixed;
  inset: 0; top: 66px;
  z-index: 998;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(2px);
}
.mc-overlay.open { display: block; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .mc-links { display: none; }
  .mc-user-chip { display: none; }
  .mc-logout { display: none; }
  .mc-ham { display: flex; }
  .mc-live-pill { display: none; }
}

@media (max-width: 480px) {
  .mc-nav-inner { padding: 0 16px; height: 60px; }
  .mc-drawer { top: 60px; }
  .mc-overlay { top: 60px; }
  .mc-brand-name { font-size: 18px; }
  .mc-logo { width: 34px; height: 34px; font-size: 16px; }
}
`;

/* ── SVG Icons ── */
const HomeIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const PeopleIco= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const DocIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const CalIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const GridIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const LogoutIco= () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>;
const MenuIco  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CloseIco = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const ArrowIco = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;

const NAV_ITEMS = [
  { label: 'Home',         path: '/',             Icon: HomeIco,   color: '#14b8a6', bg: 'rgba(20,184,166,0.12)'  },
  { label: 'Patients',     path: '/patients',     Icon: PeopleIco, color: '#14b8a6', bg: 'rgba(20,184,166,0.12)'  },
  { label: 'Doctors',      path: '/doctors',      Icon: DocIco,    color: '#38bdf8', bg: 'rgba(56,189,248,0.12)'  },
  { label: 'Appointments', path: '/appointments', Icon: CalIco,    color: '#fb923c', bg: 'rgba(251,146,60,0.12)'  },
  { label: 'Dashboard',    path: '/dashboard',    Icon: GridIco,   color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };
  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!user) return null;

  return (
    <>
      <style>{CSS}</style>

      <header className="mc-nav">
        <div className="mc-nav-inner">

          {/* ── Brand ── */}
          <Link to="/" className="mc-brand">
            <div className="mc-logo">M</div>
            <span className="mc-brand-name">Medi<span>Care</span></span>
            <div className="mc-live-pill">
              <span className="mc-pulse" /> Live
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav>
            <ul className="mc-links">
              {NAV_ITEMS.map(({ label, path, Icon }) => (
                <li key={path}>
                  <Link to={path} className={`mc-link ${isActive(path) ? 'active' : ''}`}>
                    <span className="mc-link-icon"><Icon /></span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Right: User + Logout ── */}
          <div className="mc-right">
            <div className="mc-user-chip">
              <div className="mc-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
              <span className="mc-username">{user?.name?.split(' ')[0]}</span>
            </div>

            <button className="mc-logout" onClick={handleLogout}>
              <LogoutIco /> Sign Out
            </button>

            {/* Hamburger */}
            <button className="mc-ham" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
              {open ? <CloseIco /> : <MenuIco />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Overlay ── */}
      <div className={`mc-overlay ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />

      {/* ── Mobile Drawer ── */}
      <div className={`mc-drawer ${open ? 'open' : ''}`}>

        {/* User greeting */}
        <div className="mc-drawer-greeting">
          <div className="mc-drawer-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="mc-drawer-name">{user?.name}</div>
            <div className="mc-drawer-role">Admin · Healthcare Portal</div>
          </div>
        </div>

        <div className="mc-drawer-section-title">Navigation</div>

        <div className="mc-drawer-links">
          {NAV_ITEMS.map(({ label, path, Icon, color, bg }) => (
            <Link
              key={path}
              to={path}
              className={`mc-drawer-link ${isActive(path) ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <div className="mc-drawer-link-icon" style={{ background: bg, color }}>
                <Icon />
              </div>
              <span className="mc-drawer-link-label">{label}</span>
              <span className="mc-drawer-link-arrow"><ArrowIco /></span>
            </Link>
          ))}
        </div>

        <button className="mc-drawer-logout" onClick={handleLogout}>
          <div className="mc-drawer-logout-icon">
            <LogoutIco />
          </div>
          Sign Out
        </button>
      </div>
    </>
  );
}