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

  .reg-root { min-height:100vh; display:flex; background:var(--navy); overflow:hidden; position:relative; }

  .mesh-bg {
    position:absolute; inset:0; pointer-events:none;
    background:
      radial-gradient(ellipse 60% 50% at 75% 20%,rgba(13,148,136,0.18) 0%,transparent 70%),
      radial-gradient(ellipse 40% 60% at 10% 80%,rgba(14,165,233,0.12) 0%,transparent 70%),
      radial-gradient(ellipse 50% 40% at 50% 50%,rgba(5,150,105,0.08) 0%,transparent 70%);
  }
  .grid-pattern {
    position:absolute; inset:0; pointer-events:none;
    background-image:linear-gradient(rgba(13,148,136,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(13,148,136,0.06) 1px,transparent 1px);
    background-size:50px 50px;
  }

  /* FORM — LEFT */
  .form-panel {
    width:500px; display:flex; flex-direction:column; justify-content:center;
    padding:48px 52px; position:relative; z-index:2;
    background:rgba(255,255,255,0.025); backdrop-filter:blur(24px);
    border-right:1px solid rgba(255,255,255,0.07);
  }
  .eyebrow { font-size:11px; text-transform:uppercase; letter-spacing:2px; color:var(--teal-light); font-weight:600; margin-bottom:10px; }
  .f-title { font-family:'Playfair Display',serif; font-size:30px; font-weight:700; color:var(--white); margin-bottom:6px; }
  .f-sub { font-size:14px; color:var(--text-dim); margin-bottom:30px; }

  .fg { margin-bottom:18px; }
  .fl { display:block; font-size:11px; font-weight:600; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
  .fl-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
  .fl-row .fl { margin-bottom:0; }
  .str-label { font-size:11px; font-weight:600; }
  .fw { position:relative; display:flex; align-items:center; }
  .fi { position:absolute; left:14px; font-size:16px; opacity:0.45; pointer-events:none; z-index:1; }
  .finput {
    width:100%; background:rgba(255,255,255,0.055); border:1px solid rgba(255,255,255,0.1);
    border-radius:12px; padding:13px 14px 13px 44px;
    font-family:'DM Sans',sans-serif; font-size:15px; color:var(--white); outline:none; transition:all 0.25s;
  }
  .finput::placeholder { color:rgba(255,255,255,0.22); }
  .finput:focus { border-color:var(--teal); background:rgba(13,148,136,0.09); box-shadow:0 0 0 3px rgba(13,148,136,0.18); }

  .str-bar { display:flex; gap:4px; margin-top:8px; }
  .str-seg { height:3px; flex:1; border-radius:10px; background:rgba(255,255,255,0.1); transition:background 0.3s; }

  .terms-row { display:flex; align-items:flex-start; gap:10px; margin:16px 0 22px; }
  .terms-check { width:17px; height:17px; accent-color:var(--teal); cursor:pointer; margin-top:3px; flex-shrink:0; }
  .terms-label { font-size:13px; color:var(--text-dim); line-height:1.55; }
  .terms-label a { color:var(--teal-light); text-decoration:none; }

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
    border-radius:10px; padding:12px 16px; margin-bottom:18px;
    font-size:13px; color:#fca5a5; line-height:1.5;
  }

  .login-link { text-align:center; font-size:14px; color:var(--text-dim); margin-top:20px; }
  .login-link a { color:var(--teal-light); text-decoration:none; font-weight:600; }
  .login-link a:hover { color:white; }

  .creator { text-align:center; margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); font-size:11px; color:rgba(255,255,255,0.28); letter-spacing:0.5px; }
  .creator strong { color:rgba(255,255,255,0.5); font-weight:500; }

  /* DIVIDER */
  .vdiv {
    width:1px; margin:40px 0; position:relative; z-index:2;
    background:linear-gradient(to bottom,transparent,rgba(255,255,255,0.1) 30%,rgba(255,255,255,0.1) 70%,transparent);
  }

  /* INFO — RIGHT */
  .info-panel { flex:1; display:flex; flex-direction:column; justify-content:center; padding:60px 56px; position:relative; z-index:2; }

  .brand { display:flex; align-items:center; gap:12px; margin-bottom:60px; }
  .brand-icon {
    width:50px; height:50px; background:linear-gradient(135deg,var(--teal),var(--sky));
    border-radius:13px; display:flex; align-items:center; justify-content:center;
    font-size:24px; box-shadow:0 6px 20px rgba(13,148,136,0.4);
  }
  .brand-name { font-family:'Playfair Display',serif; font-size:26px; font-weight:700; color:var(--white); }
  .brand-name span { color:var(--teal-light); }

  .info-h { font-family:'Playfair Display',serif; font-size:clamp(28px,3.5vw,46px); font-weight:700; color:var(--white); line-height:1.2; margin-bottom:16px; }
  .info-h em { color:var(--teal-light); font-style:normal; }
  .info-sub { font-size:15px; color:var(--text-dim); line-height:1.75; max-width:420px; margin-bottom:44px; }

  .steps-title { font-size:11px; text-transform:uppercase; letter-spacing:2px; color:var(--teal-light); font-weight:600; margin-bottom:18px; }
  .step-list { display:flex; flex-direction:column; gap:14px; }
  .step-item {
    display:flex; gap:16px; align-items:flex-start; padding:16px 18px;
    background:var(--glass); border:1px solid var(--glass-border);
    border-radius:14px; backdrop-filter:blur(10px); transition:all 0.3s;
  }
  .step-item:hover { background:rgba(13,148,136,0.1); border-color:rgba(13,148,136,0.25); transform:translateX(4px); }
  .step-num {
    width:34px; height:34px; border-radius:9px;
    background:linear-gradient(135deg,var(--teal),var(--teal-dark));
    display:flex; align-items:center; justify-content:center;
    font-size:13px; font-weight:700; color:white; flex-shrink:0;
    box-shadow:0 4px 12px rgba(13,148,136,0.35);
  }
  .step-t { font-size:14px; font-weight:600; color:var(--white); margin-bottom:3px; }
  .step-d { font-size:12px; color:var(--text-dim); line-height:1.5; }

  .trust-row { display:flex; gap:10px; flex-wrap:wrap; margin-top:36px; }
  .trust-badge {
    display:flex; align-items:center; gap:7px;
    background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09);
    border-radius:100px; padding:7px 13px; font-size:12px; color:rgba(255,255,255,0.65);
  }

  @keyframes spin { to { transform:rotate(360deg); } }
  @media(max-width:960px) { .info-panel,.vdiv{display:none} .form-panel{width:100%;border-right:none} }
`;

const STRENGTH_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'];
const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];

function getStrength(pwd) {
  if (!pwd) return 0;
  let s = 0;
  if (pwd.length >= 8)           s++;
  if (/[A-Z]/.test(pwd))         s++;
  if (/[0-9]/.test(pwd))         s++;
  if (/[^A-Za-z0-9]/.test(pwd))  s++;
  return s;
}

export default function Register() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();
  const strength                = getStrength(password);

  const handleSubmit = async () => {
    setError('');
    if (!name || !email || !password) { setError('All fields are required.'); return; }
    if (!agreed) { setError('Please accept the Terms of Service to continue.'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      login(data.token, data.user);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">
        <div className="mesh-bg" /><div className="grid-pattern" />

        {/* ── FORM PANEL ── */}
        <div className="form-panel">
          <div className="eyebrow">New Account</div>
          <h2 className="f-title">Join MediCare 🏥</h2>
          <p className="f-sub">Create your healthcare admin account today</p>

          {error && <div className="err"><span>⚠️</span><span>{error}</span></div>}

          <div className="fg">
            <label className="fl">Full Name</label>
            <div className="fw">
              <span className="fi">👤</span>
              <input className="finput" type="text" placeholder="Dr. John Smith"
                value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
            </div>
          </div>

          <div className="fg">
            <label className="fl">Email Address</label>
            <div className="fw">
              <span className="fi">✉️</span>
              <input className="finput" type="email" placeholder="doctor@medicare.com"
                value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>

          <div className="fg">
            <div className="fl-row">
              <label className="fl">Password</label>
              {password && (
                <span className="str-label" style={{color: STRENGTH_COLORS[strength]}}>
                  {STRENGTH_LABELS[strength]}
                </span>
              )}
            </div>
            <div className="fw">
              <span className="fi">🔐</span>
              <input className="finput" type="password" placeholder="Create a strong password"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoComplete="new-password" />
            </div>
            <div className="str-bar">
              {[1,2,3,4].map(i => (
                <div key={i} className="str-seg"
                  style={{ background: strength >= i ? STRENGTH_COLORS[strength] : undefined }} />
              ))}
            </div>
          </div>

          <div className="terms-row">
            <input type="checkbox" id="terms" className="terms-check"
              checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <label htmlFor="terms" className="terms-label">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> of the MediCare platform
            </label>
          </div>

          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⟳</span> Creating Account...</>
              : 'Create My Account →'}
          </button>

          <div className="login-link">
            Already a member? <a href="/login">Sign in here</a>
          </div>

          <div className="creator">
            Designed &amp; Developed by <strong>Amrish Kumar Tiwary</strong>
          </div>
        </div>

        <div className="vdiv" />

        {/* ── INFO PANEL ── */}
        <div className="info-panel">
          <div className="brand">
            <div className="brand-icon">✚</div>
            <div className="brand-name">Medi<span>Care</span></div>
          </div>

          <h2 className="info-h">
            Your Journey to<br /><em>Smarter Healthcare</em><br />Starts Here
          </h2>
          <p className="info-sub">
            Join thousands of healthcare professionals using MediCare to streamline
            operations, manage patient records, and deliver exceptional care outcomes.
          </p>

          <div className="steps-title">How It Works</div>
          <div className="step-list">
            <div className="step-item">
              <div className="step-num">1</div>
              <div>
                <div className="step-t">Create Your Account</div>
                <div className="step-d">Register with your professional email and set up your secure healthcare profile</div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">2</div>
              <div>
                <div className="step-t">Verify Your Identity</div>
                <div className="step-d">Complete HIPAA-compliant verification to ensure platform security</div>
              </div>
            </div>
            <div className="step-item">
              <div className="step-num">3</div>
              <div>
                <div className="step-t">Access Your Dashboard</div>
                <div className="step-d">Manage patients, view analytics, and collaborate with your care team instantly</div>
              </div>
            </div>
          </div>

          <div className="trust-row">
            <div className="trust-badge">🔒 HIPAA Compliant</div>
            <div className="trust-badge">🛡️ SOC 2 Certified</div>
            <div className="trust-badge">⚕️ HL7 FHIR Ready</div>
            <div className="trust-badge">🌐 256-bit SSL</div>
          </div>
        </div>
      </div>
    </>
  );
}