import { useState, useEffect } from 'react';
import api from '../api/axios';

const SearchIco = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const PlusIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const EditIco   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIco  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>;
const CloseIco  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const PhoneIco  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.56 19a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const EmailIco  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const ClockIco  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const DocIco    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
const WarnIco   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

const SPEC_COLORS = {
  cardiology:   { bg:'rgba(239,68,68,0.12)',   border:'rgba(239,68,68,0.28)',   color:'#f87171'  },
  neurology:    { bg:'rgba(139,92,246,0.12)',  border:'rgba(139,92,246,0.28)',  color:'#a78bfa'  },
  orthopedics:  { bg:'rgba(251,146,60,0.12)',  border:'rgba(251,146,60,0.28)',  color:'#fb923c'  },
  pediatrics:   { bg:'rgba(13,148,136,0.14)',  border:'rgba(13,148,136,0.3)',   color:'#14b8a6'  },
  general:      { bg:'rgba(56,189,248,0.12)',  border:'rgba(56,189,248,0.28)',  color:'#38bdf8'  },
  dermatology:  { bg:'rgba(244,114,182,0.12)', border:'rgba(244,114,182,0.28)', color:'#f472b6'  },
  oncology:     { bg:'rgba(234,179,8,0.12)',   border:'rgba(234,179,8,0.28)',   color:'#eab308'  },
};
const getSpec = spec => {
  const key = Object.keys(SPEC_COLORS).find(k => spec?.toLowerCase().includes(k));
  return SPEC_COLORS[key] || { bg:'rgba(255,255,255,0.07)', border:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.55)' };
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--teal:#0d9488;--teal-l:#14b8a6;--teal-d:#0f766e;--sky:#0ea5e9;--emerald:#059669;--navy:#0c1a2e;--navy2:#0e2039;--white:#fff;--glass:rgba(255,255,255,0.055);--glass-b:rgba(255,255,255,0.11);--dim:rgba(255,255,255,0.45);--dim2:rgba(255,255,255,0.22);--dim3:rgba(255,255,255,0.07);}
html{scroll-behavior:smooth}body{font-family:'DM Sans',sans-serif;background:var(--navy);color:var(--white);overflow-x:hidden}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--navy)}::-webkit-scrollbar-thumb{background:var(--teal-d);border-radius:10px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
@keyframes blobFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-28px)}}
@keyframes slideIn{from{opacity:0;transform:scale(0.96) translateY(14px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes overlayFade{from{opacity:0}to{opacity:1}}

.pg-wrap{min-height:100vh;background:var(--navy);}
.pg-hero{position:relative;overflow:hidden;padding:44px 40px 32px;}
.pg-blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:0.14;animation:blobFloat 9s ease-in-out infinite;pointer-events:none;}
.pb1{width:480px;height:480px;background:var(--sky);top:-160px;left:-120px;}
.pb2{width:320px;height:320px;background:var(--teal);bottom:-80px;right:0;animation-delay:3s;}
.pb3{width:220px;height:220px;background:var(--emerald);top:20%;left:45%;animation-delay:5s;}
.pg-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(14,165,233,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.06) 1px,transparent 1px);background-size:56px 56px;}
.pg-inner{position:relative;z-index:2;max-width:1280px;margin:0 auto;}
.hero-row{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;flex-wrap:wrap;animation:fadeUp 0.6s ease both;}
.pg-eyebrow{display:inline-flex;align-items:center;gap:7px;background:rgba(56,189,248,0.13);border:1px solid rgba(56,189,248,0.28);border-radius:100px;padding:5px 14px;margin-bottom:14px;font-size:10px;font-weight:700;color:#38bdf8;text-transform:uppercase;letter-spacing:1.5px;}
.pg-dot{width:6px;height:6px;border-radius:50%;background:#38bdf8;animation:pulse 2s infinite;}
.pg-title{font-family:'Playfair Display',serif;font-size:clamp(32px,5vw,52px);font-weight:900;color:var(--white);line-height:0.95;letter-spacing:-2px;}
.pg-title em{color:#38bdf8;font-style:italic;}
.pg-sub{font-size:13px;color:var(--dim);margin-top:10px;}
.pg-add-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 26px;border:none;border-radius:14px;cursor:pointer;background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;box-shadow:0 8px 24px rgba(14,165,233,0.38);transition:all 0.3s;white-space:nowrap;flex-shrink:0;}
.pg-add-btn:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(14,165,233,0.52);}

.pg-toolbar{position:relative;z-index:2;padding:0 40px 28px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;animation:fadeUp 0.6s 0.08s ease both;}
.pg-spacer{flex:1;}
.pg-search-wrap{position:relative;display:flex;align-items:center;}
.pg-si{position:absolute;left:13px;color:var(--dim2);display:flex;pointer-events:none;}
.pg-search{padding:10px 14px 10px 40px;background:var(--glass);border:1px solid var(--glass-b);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:13.5px;color:var(--white);outline:none;width:260px;transition:all 0.25s;}
.pg-search::placeholder{color:var(--dim2);}
.pg-search:focus{border-color:#38bdf8;background:rgba(56,189,248,0.08);box-shadow:0 0 0 3px rgba(56,189,248,0.15);width:300px;}

.pg-table-wrap{position:relative;z-index:2;padding:0 40px 60px;animation:fadeUp 0.6s 0.14s ease both;}
.pg-card{background:var(--glass);border:1px solid var(--glass-b);border-radius:20px;overflow:hidden;backdrop-filter:blur(16px);}
.pg-card-head{padding:20px 26px;border-bottom:1px solid var(--dim3);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;}
.pg-card-icon{width:42px;height:42px;border-radius:12px;background:rgba(56,189,248,0.13);border:1px solid rgba(56,189,248,0.25);display:flex;align-items:center;justify-content:center;color:#38bdf8;}
.card-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--white);}
.card-sub{font-size:12px;color:var(--dim2);margin-top:2px;}
.count-badge{padding:6px 14px;border-radius:100px;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.25);font-size:12px;font-weight:600;color:#38bdf8;}
.tbl-scroll{overflow-x:auto;}
.tbl{width:100%;border-collapse:collapse;}
.tbl th{padding:13px 20px;text-align:left;font-size:10px;font-weight:700;color:var(--dim2);text-transform:uppercase;letter-spacing:1.5px;background:rgba(255,255,255,0.025);border-bottom:1px solid var(--dim3);white-space:nowrap;}
.tbl td{padding:14px 20px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:13.5px;color:var(--dim);vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tbody tr{transition:background 0.18s;}
.tbl tbody tr:hover{background:rgba(255,255,255,0.04);}
.name-cell{display:flex;align-items:center;gap:12px;}
.av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#fff;flex-shrink:0;}
.nm{font-size:13.5px;font-weight:600;color:var(--white);}
.spec-pill{display:inline-flex;padding:5px 12px;border-radius:100px;font-size:11.5px;font-weight:700;}
.contact-col{display:flex;flex-direction:column;gap:5px;}
.contact-row{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim);}
.ci{display:flex;color:var(--dim2);}
.avail-row{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--dim);}
.actions{display:flex;gap:8px;}
.edit-btn,.del-btn{width:34px;height:34px;border-radius:10px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.22s;}
.edit-btn{background:rgba(56,189,248,0.13);color:#38bdf8;}
.edit-btn:hover{background:rgba(56,189,248,0.26);transform:scale(1.08);}
.del-btn{background:rgba(239,68,68,0.12);color:#f87171;}
.del-btn:hover{background:rgba(239,68,68,0.24);transform:scale(1.08);}
.empty-state{display:flex;flex-direction:column;align-items:center;gap:12px;padding:60px 20px;}
.empty-icon{width:60px;height:60px;border-radius:50%;background:rgba(255,255,255,0.04);border:1px solid var(--dim3);display:flex;align-items:center;justify-content:center;font-size:26px;}
.empty-title{font-size:15px;font-weight:600;color:var(--dim);}
.empty-sub{font-size:12px;color:var(--dim2);text-align:center;}

.overlay{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,0.7);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:overlayFade 0.25s ease both;}
.modal{background:var(--navy2);border:1px solid var(--glass-b);border-radius:22px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;box-shadow:0 32px 80px rgba(0,0,0,0.55);animation:slideIn 0.3s cubic-bezier(0.4,0,0.2,1) both;}
.modal::-webkit-scrollbar{width:4px}.modal::-webkit-scrollbar-thumb{background:var(--teal-d)}
.modal-head{padding:22px 26px;border-bottom:1px solid var(--dim3);display:flex;align-items:center;justify-content:space-between;}
.modal-icon{width:40px;height:40px;border-radius:11px;background:rgba(56,189,248,0.13);border:1px solid rgba(56,189,248,0.25);display:flex;align-items:center;justify-content:center;color:#38bdf8;}
.modal-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--white);margin-left:12px;}
.close-btn{width:34px;height:34px;border-radius:9px;border:none;cursor:pointer;background:rgba(255,255,255,0.06);color:var(--dim);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.close-btn:hover{background:rgba(255,255,255,0.12);color:var(--white);}
.modal-body{padding:24px 26px;display:flex;flex-direction:column;gap:16px;}
.modal-foot{padding:18px 26px;border-top:1px solid var(--dim3);display:flex;justify-content:flex-end;gap:10px;}
.field-group{display:flex;flex-direction:column;gap:7px;}
.field-row{display:flex;gap:14px;}
.field-row .field-group{flex:1;}
.label{font-size:10px;font-weight:700;color:var(--dim2);text-transform:uppercase;letter-spacing:0.8px;}
.finput,.ftextarea{width:100%;padding:12px 14px;background:rgba(255,255,255,0.055);border:1px solid rgba(255,255,255,0.1);border-radius:12px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--white);outline:none;transition:all 0.25s;}
.finput::placeholder,.ftextarea::placeholder{color:var(--dim2);}
.finput:focus,.ftextarea:focus{border-color:#38bdf8;background:rgba(56,189,248,0.08);box-shadow:0 0 0 3px rgba(56,189,248,0.14);}
.ftextarea{resize:vertical;min-height:72px;}
.err-box{display:flex;align-items:center;gap:10px;background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.25);border-radius:10px;padding:12px 16px;font-size:13px;color:#fca5a5;}
.cancel-btn{padding:11px 20px;border-radius:11px;border:1px solid var(--glass-b);background:var(--glass);color:var(--dim);font-family:'DM Sans',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.22s;}
.cancel-btn:hover{background:rgba(255,255,255,0.09);color:var(--white);}
.save-btn{padding:11px 26px;border-radius:11px;border:none;cursor:pointer;background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#fff;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;box-shadow:0 6px 20px rgba(14,165,233,0.35);transition:all 0.3s;}
.save-btn:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(14,165,233,0.5);}

@media(max-width:900px){.pg-hero{padding:32px 20px 24px;}.pg-toolbar{padding:0 20px 22px;}.pg-table-wrap{padding:0 20px 40px;}.pg-search{width:200px;}.pg-search:focus{width:220px;}}
@media(max-width:640px){.hero-row{flex-direction:column;}.pg-add-btn{width:100%;justify-content:center;}.pg-spacer{display:none;}.pg-search-wrap{width:100%;}.pg-search,.pg-search:focus{width:100%;}.field-row{flex-direction:column;}.hide-sm{display:none;}}
`;

const EMPTY = { name:'', specialization:'', phone:'', email:'', availability:'Mon-Fri, 9am-5pm' };

export default function Doctors() {
  const [doctors, setDoctors]   = useState([]);
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [error, setError]       = useState('');
  const [search, setSearch]     = useState('');

  const load = async () => { const { data } = await api.get('/doctors'); setDoctors(data); };
  useEffect(() => { load(); }, []);

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setError(''); setOpen(true); };
  const openEdit = d  => { setForm(d); setEditId(d._id); setError(''); setOpen(true); };

  const handleSave = async () => {
    setError('');
    try {
      if (editId) await api.put(`/doctors/${editId}`, form);
      else        await api.post('/doctors', form);
      setOpen(false); load();
    } catch(e) { setError(e.response?.data?.message || 'Error saving'); }
  };

  const handleDelete = async id => {
    if (window.confirm('Delete this doctor?')) { await api.delete(`/doctors/${id}`); load(); }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="pg-wrap">

        {/* HERO */}
        <section className="pg-hero">
          <div className="pg-blob pb1"/><div className="pg-blob pb2"/><div className="pg-blob pb3"/>
          <div className="pg-grid"/>
          <div className="pg-inner">
            <div className="hero-row">
              <div>
                <div className="pg-eyebrow"><span className="pg-dot"/>Staff Management</div>
                <h1 className="pg-title">Medical<br/><em>Doctors</em></h1>
                <p className="pg-sub">{doctors.length} doctor{doctors.length!==1?'s':''} registered in the system</p>
              </div>
              <button className="pg-add-btn" onClick={openAdd}><PlusIco/> Add Doctor</button>
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <div className="pg-toolbar" style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="pg-spacer"/>
          <div className="pg-search-wrap">
            <span className="pg-si"><SearchIco/></span>
            <input className="pg-search" placeholder="Search name or specialization…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </div>

        {/* TABLE */}
        <div className="pg-table-wrap" style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="pg-card">
            <div className="pg-card-head">
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <div className="pg-card-icon"><DocIco/></div>
                <div>
                  <div className="card-title">Medical Staff</div>
                  <div className="card-sub">{filtered.length} result{filtered.length!==1?'s':''}</div>
                </div>
              </div>
              <span className="count-badge">{doctors.length} total</span>
            </div>
            <div className="tbl-scroll">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialization</th>
                    <th className="hide-sm">Contact</th>
                    <th className="hide-sm">Availability</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length===0 && (
                    <tr><td colSpan={5}>
                      <div className="empty-state">
                        <div className="empty-icon">👨‍⚕️</div>
                        <div className="empty-title">No doctors found</div>
                        <div className="empty-sub">Add your first doctor to get started</div>
                      </div>
                    </td></tr>
                  )}
                  {filtered.map(d => {
                    const sc = getSpec(d.specialization);
                    return (
                      <tr key={d._id}>
                        <td>
                          <div className="name-cell">
                            <div className="av" style={{background:'linear-gradient(135deg,#0ea5e9,#38bdf8)'}}>
                              {d.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="nm">Dr. {d.name}</div>
                          </div>
                        </td>
                        <td>
                          <span className="spec-pill" style={{background:sc.bg,border:`1px solid ${sc.border}`,color:sc.color}}>
                            {d.specialization}
                          </span>
                        </td>
                        <td className="hide-sm">
                          <div className="contact-col">
                            <div className="contact-row"><span className="ci"><PhoneIco/></span>{d.phone}</div>
                            {d.email&&<div className="contact-row"><span className="ci"><EmailIco/></span>{d.email}</div>}
                          </div>
                        </td>
                        <td className="hide-sm">
                          <div className="avail-row"><span className="ci"><ClockIco/></span>{d.availability}</div>
                        </td>
                        <td>
                          <div className="actions">
                            <button className="edit-btn" onClick={()=>openEdit(d)}><EditIco/></button>
                            <button className="del-btn" onClick={()=>handleDelete(d._id)}><TrashIco/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {open && (
          <div className="overlay" onClick={e=>e.target===e.currentTarget&&setOpen(false)}>
            <div className="modal">
              <div className="modal-head">
                <div style={{display:'flex',alignItems:'center'}}>
                  <div className="modal-icon"><DocIco/></div>
                  <div className="modal-title">{editId?'Edit Doctor':'Add Doctor'}</div>
                </div>
                <button className="close-btn" onClick={()=>setOpen(false)}><CloseIco/></button>
              </div>
              <div className="modal-body">
                {error && <div className="err-box"><WarnIco/>{error}</div>}
                <div className="field-group">
                  <label className="label">Full Name *</label>
                  <input className="finput" placeholder="Dr. John Smith" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
                </div>
                <div className="field-group">
                  <label className="label">Specialization *</label>
                  <input className="finput" placeholder="Cardiology, Neurology…" value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})}/>
                </div>
                <div className="field-row">
                  <div className="field-group">
                    <label className="label">Phone</label>
                    <input className="finput" placeholder="+91 98765 43210" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
                  </div>
                  <div className="field-group">
                    <label className="label">Email</label>
                    <input className="finput" type="email" placeholder="doctor@medicare.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
                  </div>
                </div>
                <div className="field-group">
                  <label className="label">Availability</label>
                  <input className="finput" placeholder="Mon-Fri, 9am-5pm" value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})}/>
                </div>
              </div>
              <div className="modal-foot">
                <button className="cancel-btn" onClick={()=>setOpen(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSave}>{editId?'Save Changes':'Add Doctor'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}