import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --teal: #0d9488; --teal-light: #14b8a6; --teal-dark: #0f766e;
    --emerald: #059669; --navy: #0c1a2e; --sky: #0ea5e9;
    --white: #ffffff; --glass: rgba(255,255,255,0.06);
    --glass-border: rgba(255,255,255,0.12); --text-dim: rgba(255,255,255,0.5);
  }
  body { font-family: 'DM Sans', sans-serif; }

  .login-root { min-height:100vh; display:flex; background:var(--navy); overflow:hidden; position:relative; }

  .bg-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:0.18; animation:blobFloat 8s ease-in-out infinite; pointer-events:none; }
  .b1 { width:520px; height:520px; background:var(--teal); top:-120px; left:-100px; }
  .b2 { width:380px; height:380px; background:var(--sky); bottom:-80px; right:30%; animation-delay:3s; }
  .b3 { width:280px; height:280px; background:var(--emerald); top:40%; left:35%; animation-delay:5s; }
  @keyframes blobFloat { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-30px) scale(1.06)} }

  .grid-lines {
    position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(13,148,136,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(13,148,136,0.07) 1px,transparent 1px);
    background-size:60px 60px;
  }

  /* LEFT */
  .left-panel { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 64px; position:relative; z-index:2; }

  .brand { display:flex; align-items:center; gap:14px; margin-bottom:56px; }
  .brand-icon {
    width:52px; height:52px; background:linear-gradient(135deg,var(--teal),var(--sky));
    border-radius:14px; display:flex; align-items:center; justify-content:center;
    font-size:26px; box-shadow:0 8px 24px rgba(13,148,136,0.4);
  }
  .brand-name { font-family:'Playfair Display',serif; font-size:28px; font-weight:700; color:var(--white); }
  .brand-name span { color:var(--teal-light); }

  .hero-tag {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(13,148,136,0.15); border:1px solid rgba(13,148,136,0.3);
    border-radius:100px; padding:6px 16px; font-size:12px; color:var(--teal-light);
    font-weight:500; letter-spacing:0.5px; text-transform:uppercase;
    margin-bottom:28px; width:fit-content;
  }
  .pulse { width:7px; height:7px; background:var(--teal-light); border-radius:50%; animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .hero-h { font-family:'Playfair Display',serif; font-size:clamp(32px,4vw,52px); font-weight:700; color:var(--white); line-height:1.15; margin-bottom:18px; }
  .hero-h em { color:var(--teal-light); font-style:normal; }
  .hero-sub { font-size:15px; color:var(--text-dim); line-height:1.75; max-width:440px; margin-bottom:48px; }

  .stats-row { display:flex; gap:36px; flex-wrap:wrap; }
  .stat { display:flex; flex-direction:column; gap:4px; }
  .stat-n { font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--white); line-height:1; }
  .stat-n span { color:var(--teal-light); }
  .stat-l { font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.5px; }

  .pills { display:flex; gap:10px; flex-wrap:wrap; margin-top:40px; }
  .pill {
    display:flex; align-items:center; gap:8px;
    background:var(--glass); border:1px solid var(--glass-border);
    border-radius:100px; padding:8px 16px; font-size:13px;
    color:rgba(255,255,255,0.75); backdrop-filter:blur(8px);
  }

  .deco-cards { display:flex; gap:14px; margin-top:44px; flex-wrap:wrap; }
  .deco-card {
    background:var(--glass); border:1px solid var(--glass-border);
    border-radius:16px; padding:15px 18px; backdrop-filter:blur(12px);
    display:flex; gap:12px; align-items:center;
  }
  .deco-txt { font-size:12px; color:rgba(255,255,255,0.65); }
  .deco-txt strong { display:block; color:var(--white); font-size:13px; margin-bottom:2px; }

  /* DIVIDER */
  .vdiv {
    width:1px; margin:40px 0; position:relative; z-index:2;
    background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.1) 30%,rgba(255,255,255,0.1) 70%,transparent);
  }

  /* RIGHT */
  .right-panel {
    width:500px; display:flex; align-items:center; justify-content:center;
    padding:48px 52px; position:relative; z-index:2;
    background:rgba(255,255,255,0.025); backdrop-filter:blur(20px);
    border-left:1px solid rgba(255,255,255,0.07);
  }
  .form-inner { width:100%; }
  .eyebrow { font-size:11px; text-transform:uppercase; letter-spacing:2px; color:var(--teal-light); font-weight:600; margin-bottom:10px; }
  .f-title { font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--white); margin-bottom:6px; }
  .f-sub { font-size:14px; color:var(--text-dim); margin-bottom:34px; }

  .fg { margin-bottom:20px; }
  .fl { display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .fw { position:relative; display:flex; align-items:center; }
  .fi { position:absolute; left:14px; font-size:16px; opacity:0.45; pointer-events:none; z-index:1; }
  .finput {
    width:100%; background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.1);
    border-radius:12px; padding:13px 14px 13px 44px;
    font-family:'DM Sans',sans-serif; font-size:15px; color:var(--white); outline:none; transition:all 0.25s;
  }
  .finput::placeholder { color:rgba(255,255,255,0.22); }
  .finput:focus { border-color:var(--teal); background:rgba(13,148,136,0.09); box-shadow:0 0 0 3px rgba(13,148,136,0.18); }

  .forgot-row { text-align:right; margin-top:-12px; margin-bottom:20px; }
  .forgot-link { font-size:12px; color:var(--teal-light); text-decoration:none; }
  .forgot-link:hover { color:white; }

  .btn {
    width:100%; padding:15px; background:linear-gradient(135deg,var(--teal-light),var(--teal-dark));
    border:none; border-radius:12px; color:white; font-family:'DM Sans',sans-serif;
    font-size:15px; font-weight:600; cursor:pointer; transition:all 0.3s;
    display:flex; align-items:center; justify-content:center; gap:10px;
    box-shadow:0 8px 28px rgba(13,148,136,0.35); letter-spacing:0.3px;
  }
  .btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 14px 38px rgba(13,148,136,0.5); }
  .btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  .err {
    display:flex; align-items:flex-start; gap:10px;
    background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.25);
    border-radius:10px; padding:12px 16px; margin-bottom:20px;
    font-size:13px; color:#fca5a5; line-height:1.5;
  }

  .reg-link { text-align:center; font-size:14px; color:var(--text-dim); margin-top:22px; }
  .reg-link a { color:var(--teal-light); text-decoration:none; font-weight:600; }
  .reg-link a:hover { color:white; }

  .creator { text-align:center; margin-top:28px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:rgba(255,255,255,0.28); letter-spacing:0.5px; }
  .creator strong { color:rgba(255,255,255,0.5); font-weight:500; }

  .ecg { position:absolute; bottom:0; left:0; right:0; height:70px; overflow:hidden; opacity:0.1; pointer-events:none; }

  @keyframes spin { to { transform:rotate(360deg); } }
  @media(max-width:900px) { .left-panel,.vdiv{display:none} .right-panel{width:100%;border-left:none} }
`;

export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async () => {
    setError('');
    if (!email || !password) { setError('All fields are required.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="bg-blob b1" /><div className="bg-blob b2" /><div className="bg-blob b3" />
        <div className="grid-lines" />

        {/* ── LEFT PANEL ── */}
        <div className="left-panel">
          <div className="brand">
            <div className="brand-icon">✚</div>
            <div className="brand-name">Medi<span>Care</span></div>
          </div>

          <div className="hero-tag"><span className="pulse" /> Trusted Healthcare Platform</div>

          <h1 className="hero-h">
            Advanced Care,<br /><em>Smarter Health</em><br />Management
          </h1>
          <p className="hero-sub">
            A unified platform for healthcare professionals to manage patients,
            records, appointments, and analytics — all in one secure environment.
          </p>

          <div className="stats-row">
            <div className="stat"><div className="stat-n">50K<span>+</span></div><div className="stat-l">Patients Served</div></div>
            <div className="stat"><div className="stat-n">1.2K<span>+</span></div><div className="stat-l">Doctors Onboard</div></div>
            <div className="stat"><div className="stat-n">99<span>%</span></div><div className="stat-l">Uptime SLA</div></div>
          </div>

          <div className="pills">
            <div className="pill">🔒 HIPAA Compliant</div>
            <div className="pill">⚡ Real-time Analytics</div>
            <div className="pill">🩺 EHR Integrated</div>
            <div className="pill">📱 Mobile Ready</div>
          </div>

          <div className="deco-cards">
            <div className="deco-card">
              <span style={{fontSize:22}}>❤️</span>
              <div className="deco-txt"><strong>Patient Health Score</strong>98.4 / 100 — Excellent</div>
            </div>
            <div className="deco-card">
              <span style={{fontSize:22}}>🧬</span>
              <div className="deco-txt"><strong>Lab Results Ready</strong>12 new reports today</div>
            </div>
          </div>
        </div>

        <div className="vdiv" />

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          <div className="form-inner">
            <div className="eyebrow">Admin Portal</div>
            <h2 className="f-title">Welcome Back 👋</h2>
            <p className="f-sub">Sign in to access your healthcare dashboard</p>

            {error && <div className="err"><span>⚠️</span><span>{error}</span></div>}

            <div className="fg">
              <label className="fl">Email Address</label>
              <div className="fw">
                <span className="fi">✉️</span>
                <input className="finput" type="email" placeholder="doctor@medicare.com"
                  value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>

            <div className="fg">
              <label className="fl">Password</label>
              <div className="fw">
                <span className="fi">🔐</span>
                <input className="finput" type="password" placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  autoComplete="current-password" />
              </div>
            </div>

            <div className="forgot-row">
              <a href="/forgot-password" className="forgot-link">Forgot password?</a>
            </div>

            <button className="btn" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⟳</span> Authenticating...</>
                : 'Sign In to Dashboard →'}
            </button>

            <div className="reg-link">
              No account? <a href="/register">Create one here</a>
            </div>

            <div className="creator">
              Crafted with precision by <strong>Amrish Kumar Tiwary</strong>
            </div>
          </div>

          <div className="ecg">
            <svg viewBox="0 0 800 70" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <polyline fill="none" stroke="#14b8a6" strokeWidth="2"
                points="0,35 80,35 100,35 110,8 120,62 130,18 140,35 300,35 320,35 330,4 340,66 350,20 360,35 520,35 540,35 550,10 560,60 570,16 580,35 800,35"/>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}