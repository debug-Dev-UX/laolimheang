import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

const tableStyle = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .admin-table { width: 100%; border-collapse: collapse; min-width: 720px; table-layout: fixed; }
  .admin-table thead tr { border-bottom: 1px solid rgba(99,102,241,0.12); }
  .admin-table th { padding: 14px 16px; color: #475569; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; text-align: left; }
  .admin-table tbody tr { border-bottom: 1px solid rgba(99,102,241,0.06); transition: background 0.15s; cursor: pointer; }
  .admin-table tbody tr:hover { background: rgba(99,102,241,0.05); }
  .admin-table td { padding: 14px 16px; vertical-align: middle; }
  .admin-del-btn { padding: 6px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.22); border-radius: 8px; color: #f87171; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .admin-del-btn:hover { background: rgba(239,68,68,0.2); transform: translateY(-1px); }
  .admin-view-btn { padding: 6px 14px; background: rgba(6,182,212,0.12); border: 1px solid rgba(6,182,212,0.25); border-radius: 8px; color: #22d3ee; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .admin-view-btn:hover { background: rgba(6,182,212,0.22); transform: translateY(-1px); }
  .msg-modal-body pre { font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace; }
`;

/* ─── Message View Lightbox Modal ─── */
const MessageViewModal = ({ message, onClose, onDelete, onToggleRead, onReply }) => {
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const copyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.message || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const formatDate = (val) => {
    if (!val) return 'Recently';
    try {
      const d = val?.toDate ? val.toDate() : new Date(val);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(3, 4, 12, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'rgba(12, 14, 28, 0.98)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '24px',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 18, 36, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '17px',
                fontWeight: '800',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              {message.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '17px', fontWeight: '800' }}>
                  {message.name || 'Anonymous Sender'}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: !message.read ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: !message.read ? '#fbbf24' : '#34d399',
                    border: !message.read ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  {!message.read ? '● Unread' : '✓ Read'}
                </span>
              </div>
              <a
                href={`mailto:${message.email}`}
                style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none', fontWeight: '500' }}
              >
                {message.email}
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Subject & Meta */}
        <div style={{ padding: '16px 24px', background: 'rgba(6, 8, 18, 0.4)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>
            Subject
          </div>
          <div style={{ color: '#e2e8f0', fontSize: '15px', fontWeight: '700' }}>
            {message.subject || '(No Subject Provided)'}
          </div>
          <div style={{ color: '#64748b', fontSize: '12px', marginTop: '6px' }}>
            Received: {formatDate(message.createdAt)}
          </div>
        </div>

        {/* Message Content Container */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }} className="msg-modal-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Message Payload
            </span>
            <button
              onClick={copyText}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 10px',
                background: copied ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                border: copied ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: '6px',
                color: copied ? '#34d399' : '#a5b4fc',
                fontSize: '11.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ Copied' : '📋 Copy Text'}
            </button>
          </div>

          <div
            style={{
              background: 'rgba(6, 8, 18, 0.85)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
              borderRadius: '12px',
              padding: '18px',
              maxHeight: '340px',
              overflowY: 'auto',
            }}
          >
            <pre
              style={{
                margin: 0,
                color: '#cbd5e1',
                fontSize: '13.5px',
                lineHeight: 1.65,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.message || '(Empty message content)'}
            </pre>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 18, 36, 0.6)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onToggleRead(message)}
              style={{
                padding: '8px 14px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#cbd5e1',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {message.read ? 'Mark as Unread' : 'Mark as Read'}
            </button>
            <button
              onClick={() => onDelete(message)}
              style={{
                padding: '8px 14px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '8px',
                color: '#f87171',
                fontSize: '12.5px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🗑️ Delete
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#94a3b8',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
            <button
              onClick={() => onReply(message)}
              style={{
                padding: '8px 18px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
              }}
            >
              ✉️ Reply via Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Messages Admin Component ─── */
const MessagesAdmin = () => {
  const { data: firestoreMessages, loading, getCollection, deleteDoc, updateDoc } = useFirestore(COLLECTIONS.MESSAGES);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'unread' | 'read'
  const [toast, setToast] = useState('');

  useEffect(() => {
    getCollection();

    // Check cached messages if available
    try {
      const local = localStorage.getItem('custom_messages_cache');
      if (local) {
        setMessages(JSON.parse(local));
      }
    } catch (e) {}
  }, [getCollection]);

  useEffect(() => {
    if (firestoreMessages && firestoreMessages.length > 0) {
      setMessages(firestoreMessages);
      try {
        localStorage.setItem('custom_messages_cache', JSON.stringify(firestoreMessages));
      } catch (e) {}
    }
  }, [firestoreMessages]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleDelete = async (msg, e) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete message from "${msg.name}"?`);
    if (!confirmed) return;

    try {
      await deleteDoc(msg.id);
    } catch (err) {
      console.warn('Error deleting message from Firestore, removing locally:', err);
    }

    const updated = messages.filter((m) => m.id !== msg.id);
    setMessages(updated);
    try {
      localStorage.setItem('custom_messages_cache', JSON.stringify(updated));
    } catch (e) {}

    if (selectedMessage?.id === msg.id) {
      setSelectedMessage(null);
    }

    showToast(`✓ Message from "${msg.name}" deleted successfully.`);
  };

  const handleView = async (msg, e) => {
    if (e) e.stopPropagation();
    setSelectedMessage(msg);

    // Auto mark as read on view
    if (!msg.read) {
      try {
        await updateDoc(msg.id, { read: true });
      } catch (err) {
        console.warn('Could not mark read in Firestore:', err);
      }
      const updated = messages.map((m) => (m.id === msg.id ? { ...m, read: true } : m));
      setMessages(updated);
      try {
        localStorage.setItem('custom_messages_cache', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleToggleRead = async (msg, e) => {
    if (e) e.stopPropagation();
    const nextStatus = !msg.read;
    try {
      await updateDoc(msg.id, { read: nextStatus });
    } catch (err) {
      console.warn('Could not toggle read in Firestore:', err);
    }

    const updated = messages.map((m) => (m.id === msg.id ? { ...m, read: nextStatus } : m));
    setMessages(updated);
    if (selectedMessage?.id === msg.id) {
      setSelectedMessage({ ...selectedMessage, read: nextStatus });
    }
    try {
      localStorage.setItem('custom_messages_cache', JSON.stringify(updated));
    } catch (e) {}
    showToast(nextStatus ? '✓ Marked as read' : '● Marked as unread');
  };

  const handleReply = (msg) => {
    const subject = encodeURIComponent(`Re: ${msg.subject || 'Portfolio Inquiry'}`);
    const mailtoUrl = `mailto:${msg.email}?subject=${subject}`;
    window.open(mailtoUrl, '_blank');
  };

  const exportCSV = () => {
    if (messages.length === 0) {
      showToast('No messages to export');
      return;
    }
    const headers = ['Sender Name', 'Email', 'Subject', 'Status', 'Date', 'Message'];
    const rows = messages.map((m) => [
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.subject || '').replace(/"/g, '""')}"`,
      `"${m.read ? 'Read' : 'Unread'}"`,
      `"${m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'}"`,
      `"${(m.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `messages_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${messages.length} messages to CSV`);
  };

  if (loading && messages.length === 0) return <LoadingSpinner />;

  const unreadCount = messages.filter((m) => !m.read).length;

  const filteredMessages = messages.filter((m) => {
    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'unread' && !m.read) ||
      (statusFilter === 'read' && m.read);

    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      m.name?.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.subject?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div style={p.page}>
      <style>{tableStyle}</style>

      {toast && <div style={p.toast}>{toast}</div>}

      {/* Header */}
      <div style={p.header}>
        <div>
          <h1 style={p.title}>Direct Communications Vault</h1>
          <p style={p.subtitle}>
            {messages.length} total inquiries ·
            <span style={{ color: '#f59e0b', fontWeight: '700' }}> {unreadCount} unread</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={p.secondaryBtn} onClick={exportCSV}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Ribbon */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'all', label: `All (${messages.length})` },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'read', label: `Read (${messages.length - unreadCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === tab.id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(15, 17, 36, 0.8)',
                color: statusFilter === tab.id ? '#ffffff' : '#94a3b8',
                border: statusFilter === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ minWidth: '240px', maxWidth: '360px', flex: 1 }}>
          <input
            placeholder="Search by sender, email, subject, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={p.sInput}
          />
        </div>
      </div>

      {/* Messages Table */}
      <div style={p.tableWrap}>
        {messages.length === 0 ? (
          <div style={p.emptyState}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: '#334155', marginBottom: '12px' }}>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: 600 }}>No messages yet</p>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '12px' }}>Customer inquiries from your portfolio contact form will appear here.</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div style={p.emptyState}>
            <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px', fontWeight: 600 }}>No messages match your search or filter</p>
            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '12px' }}>Try switching tabs or clearing your search term.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>Sender</th>
                <th style={{ width: '32%' }}>Subject</th>
                <th style={{ width: '24%' }}>Email</th>
                <th style={{ width: '10%' }}>Status</th>
                <th style={{ width: '12%', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} onClick={(e) => handleView(msg, e)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '700',
                          flexShrink: 0,
                        }}
                      >
                        {msg.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span
                        style={{
                          color: '#e2e8f0',
                          fontWeight: '600',
                          fontSize: '13.5px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '160px',
                          display: 'inline-block',
                        }}
                        title={msg.name}
                      >
                        {msg.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        color: msg.read ? '#94a3b8' : '#f1f5f9',
                        fontWeight: msg.read ? '400' : '600',
                        fontSize: '13.5px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '240px',
                        display: 'inline-block',
                      }}
                      title={msg.subject || '(no subject)'}
                    >
                      {msg.subject || '(no subject)'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '13px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                        display: 'inline-block',
                      }}
                      title={msg.email}
                    >
                      {msg.email}
                    </span>
                  </td>
                  <td>
                    <span
                      onClick={(e) => handleToggleRead(msg, e)}
                      title="Click to toggle read / unread"
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        background: !msg.read ? 'rgba(245,158,11,0.12)' : 'rgba(30,41,59,0.5)',
                        color: !msg.read ? '#f59e0b' : '#64748b',
                        border: !msg.read ? '1px solid rgba(245,158,11,0.25)' : '1px solid rgba(30,41,59,0.8)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {!msg.read ? '● Unread' : '○ Read'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        className="admin-view-btn"
                        onClick={(e) => handleView(msg, e)}
                      >
                        View
                      </button>
                      <button
                        className="admin-del-btn"
                        onClick={(e) => handleDelete(msg, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Dedicated View Modal */}
      <MessageViewModal
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
        onDelete={(msg) => handleDelete(msg)}
        onToggleRead={(msg) => handleToggleRead(msg)}
        onReply={(msg) => handleReply(msg)}
      />
    </div>
  );
};

const p = {
  page: { display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' },
  title: { color: '#f1f5f9', fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', letterSpacing: '-0.02em' },
  subtitle: { color: '#64748b', fontSize: '13px', margin: 0 },
  secondaryBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '9px 16px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '10px', color: '#818cf8',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    transition: 'all 0.15s',
  },
  sInput: {
    width: '100%',
    padding: '9px 14px',
    background: 'rgba(15,15,30,0.8)',
    border: '1px solid rgba(99,102,241,0.2)',
    borderRadius: '8px',
    color: '#e2e8f0',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  tableWrap: {
    background: 'rgba(10,10,24,0.6)', border: '1px solid rgba(99,102,241,0.1)',
    borderRadius: '16px', overflowX: 'auto',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: '60px 20px',
  },
  toast: {
    position: 'fixed', bottom: '28px', right: '28px',
    background: 'rgba(16,185,129,0.95)', color: 'white',
    padding: '12px 22px', borderRadius: '12px',
    fontSize: '14px', fontWeight: '600',
    boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 2000,
  },
};

export default MessagesAdmin;
