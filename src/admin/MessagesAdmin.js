import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const tableStyle = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .admin-table { width: 100%; border-collapse: collapse; min-width: 700px; }
  .admin-table thead tr { border-bottom: 1px solid rgba(99,102,241,0.1); }
  .admin-table th { padding: 12px 16px; color: #334155; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; text-align: left; }
  .admin-table tbody tr { border-bottom: 1px solid rgba(99,102,241,0.05); transition: background 0.15s; cursor: pointer; }
  .admin-table tbody tr:hover { background: rgba(99,102,241,0.04); }
  .admin-table td { padding: 14px 16px; }
  .admin-del-btn { padding: 5px 14px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); border-radius: 7px; color: #f87171; font-size: 12px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .admin-del-btn:hover { background: rgba(239,68,68,0.15); }
  .admin-view-btn { padding: 5px 14px; background: rgba(6,182,212,0.1); border: 1px solid rgba(6,182,212,0.2); border-radius: 7px; color: #22d3ee; font-size: 12px; font-weight: 500; cursor: pointer; transition: background 0.15s; }
  .admin-view-btn:hover { background: rgba(6,182,212,0.18); }
`;

const MessagesAdmin = () => {
  const { data: messages, loading, getCollection } = useFirestore(COLLECTIONS.MESSAGES);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { getCollection(); }, []);

  if (loading) return <LoadingSpinner />;

  const unread = messages.filter(m => !m.read).length;

  return (
    <div style={p.page}>
      <style>{tableStyle}</style>
      <div style={p.header}>
        <div>
          <h1 style={p.title}>Messages</h1>
          <p style={p.subtitle}>
            {messages.length} total ·
            <span style={{color:'#f59e0b',fontWeight:'600'}}> {unread} unread</span>
          </p>
        </div>
        <div style={{display:'flex',gap:'10px'}}>
          <button style={p.secondaryBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <div style={p.tableWrap}>
        {messages.length === 0 ? (
          <div style={p.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{color:'#1e293b',marginBottom:'12px'}}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{color:'#334155',margin:0,fontSize:'14px'}}>No messages yet</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map(msg => (
                <React.Fragment key={msg.id}>
                  <tr onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                        <div style={{
                          width:'34px',height:'34px',borderRadius:'50%',
                          background:'linear-gradient(135deg, #f59e0b, #ef4444)',
                          display:'flex',alignItems:'center',justifyContent:'center',
                          color:'white',fontSize:'13px',fontWeight:'700',flexShrink:0,
                        }}>
                          {msg.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span style={{color:'#e2e8f0',fontWeight:'500',fontSize:'13.5px'}}>{msg.name}</span>
                      </div>
                    </td>
                    <td><span style={{color:'#94a3b8',fontSize:'13.5px'}}>{msg.subject || '(no subject)'}</span></td>
                    <td><span style={{color:'#475569',fontSize:'13px'}}>{msg.email}</span></td>
                    <td>
                      <span style={{
                        fontSize:'11px',fontWeight:'600',padding:'3px 10px',borderRadius:'20px',
                        background: !msg.read ? 'rgba(245,158,11,0.12)' : 'rgba(30,41,59,0.5)',
                        color: !msg.read ? '#f59e0b' : '#334155',
                        border: !msg.read ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(30,41,59,0.8)',
                      }}>
                        {!msg.read ? '● Unread' : '○ Read'}
                      </span>
                    </td>
                    <td>
                      <div style={{display:'flex',gap:'8px'}}>
                        <button className="admin-view-btn" onClick={e => { e.stopPropagation(); setExpandedId(expandedId === msg.id ? null : msg.id); }}>View</button>
                        <button className="admin-del-btn" onClick={e => e.stopPropagation()}>Delete</button>
                      </div>
                    </td>
                  </tr>
                  {expandedId === msg.id && (
                    <tr>
                      <td colSpan="5" style={{padding:0}}>
                        <div style={{
                          margin:'0 16px 16px',padding:'16px',
                          background:'rgba(99,102,241,0.05)',
                          border:'1px solid rgba(99,102,241,0.1)',
                          borderRadius:'12px',
                        }}>
                          <p style={{color:'#475569',fontSize:'11px',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',margin:'0 0 8px 0'}}>Message</p>
                          <p style={{color:'#94a3b8',fontSize:'13.5px',lineHeight:'1.6',margin:0,whiteSpace:'pre-wrap'}}>{msg.message || '(empty)'}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const p = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', letterSpacing: '-0.02em' },
  subtitle: { color: '#475569', fontSize: '13px', margin: 0 },
  secondaryBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '9px 16px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.15)',
    borderRadius: '10px', color: '#818cf8',
    fontSize: '13px', fontWeight: '500', cursor: 'pointer',
  },
  tableWrap: {
    background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.08)',
    borderRadius: '16px', overflowX: 'auto',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px',
  },
};

export default MessagesAdmin;
