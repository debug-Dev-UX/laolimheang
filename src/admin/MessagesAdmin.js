import React, { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { COLLECTIONS } from '../utils/constants';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  MessageSquare,
  Mail,
  Search,
  Download,
  Trash2,
  CheckCircle2,
  Eye,
  Copy,
  Check,
  Clock,
  User,
  ArrowUpRight,
  X,
  AlertCircle,
  RefreshCw,
  MailOpen,
  Filter,
} from 'lucide-react';

/* ─── Message View Modal ─── */
const MessageViewModal = ({ message, onClose, onDelete, onToggleRead }) => {
  const [copied, setCopied] = useState(false);

  if (!message) return null;

  const copyText = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.message || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white border-2 border-black max-w-2xl w-full p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-black text-white font-black text-sm flex items-center justify-center shrink-0">
              {message.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">
                  {message.name || 'Anonymous Client'}
                </h3>
                <span
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${
                    !message.read
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                  }`}
                >
                  {!message.read ? 'UNREAD' : 'ARCHIVED / READ'}
                </span>
              </div>
              <a
                href={`mailto:${message.email}`}
                className="text-xs text-neutral-500 font-medium hover:text-black underline"
              >
                {message.email}
              </a>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-black hover:text-neutral-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-50 p-4 border border-neutral-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
              SUBJECT / INQUIRY TOPIC
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-black block mt-0.5">
              {message.subject || 'General Inquiry'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block">
              RECEIVED TIMESTAMP
            </span>
            <span className="text-xs font-medium text-neutral-600 block mt-0.5">
              {formatDate(message.createdAt)}
            </span>
          </div>
        </div>

        {/* Message Body */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              CLIENT TRANSMISSION CONTENT
            </span>
            <button
              onClick={copyText}
              className="text-[10px] font-black uppercase tracking-wider text-neutral-600 hover:text-black inline-flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
            </button>
          </div>
          <div className="p-4 bg-neutral-100 border border-neutral-300 text-xs text-neutral-900 font-medium leading-relaxed whitespace-pre-wrap select-text">
            {message.message}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-200">
          <button
            onClick={() => {
              onDelete(message.id);
              onClose();
            }}
            className="px-4 py-2.5 border border-neutral-300 text-neutral-600 hover:text-black hover:border-black text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>DELETE</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleRead(message.id, !message.read)}
              className="px-4 py-2.5 border border-neutral-300 text-black text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              {message.read ? 'MARK AS UNREAD' : 'MARK AS READ'}
            </button>
            <a
              href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject || 'Portfolio Inquiry')}`}
              className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-widest inline-flex items-center gap-2 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>REPLY VIA EMAIL</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MessagesAdmin() {
  const { data: messages, loading, deleteDoc, updateDoc } = useFirestore(COLLECTIONS.MESSAGES);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this client inquiry permanently?')) return;
    try {
      await deleteDoc(id);
      showToast('Client message deleted.');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleRead = async (id, status) => {
    try {
      await updateDoc(id, { read: status });
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg((prev) => ({ ...prev, read: status }));
      }
      showToast(status ? 'Marked inquiry as read.' : 'Marked inquiry as unread.');
    } catch (err) {
      console.error('Update read state error:', err);
    }
  };

  const exportCSV = () => {
    if (!messages || messages.length === 0) return;
    const headers = ['Name', 'Email', 'Subject', 'Date', 'Read', 'Message'];
    const rows = messages.map((m) => [
      `"${(m.name || '').replace(/"/g, '""')}"`,
      `"${(m.email || '').replace(/"/g, '""')}"`,
      `"${(m.subject || '').replace(/"/g, '""')}"`,
      `"${m.createdAt?.toDate ? m.createdAt.toDate().toISOString() : m.createdAt || ''}"`,
      m.read ? 'Yes' : 'No',
      `"${(m.message || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `client_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = (messages || []).filter((m) => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'read' && !m.read) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchEmail = m.email?.toLowerCase().includes(q);
      const matchSub = m.subject?.toLowerCase().includes(q);
      const matchBody = m.message?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchSub && !matchBody) return false;
    }
    return true;
  });

  const unreadCount = (messages || []).filter((m) => !m.read).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 text-xs font-black uppercase tracking-wider bg-black text-white border border-neutral-700 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="border border-neutral-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest mb-3">
            <MessageSquare className="w-3 h-3" />
            <span>CLIENT COMMUNICATIONS DISPATCH</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black">
            CLIENT INQUIRIES
          </h1>
          <p className="text-xs text-neutral-500 font-medium mt-1">
            Incoming communication from your portfolio storefront contact form.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            disabled={!messages || messages.length === 0}
            className="px-4 py-3 border border-neutral-300 hover:border-black text-black text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Filter Tabs */}
        <div className="flex items-center border border-neutral-200 bg-white">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
            }`}
          >
            ALL ({(messages || []).length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'bg-black text-white'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
            }`}
          >
            <span>UNREAD</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors ${
              filter === 'read'
                ? 'bg-black text-white'
                : 'text-neutral-600 hover:text-black hover:bg-neutral-50'
            }`}
          >
            READ ({(messages || []).length - unreadCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="SEARCH BY SENDER, EMAIL, SUBJECT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 text-black placeholder-neutral-400 text-xs font-medium focus:outline-none focus:border-black uppercase tracking-wider"
          />
        </div>
      </div>

      {/* Inquiries Table / List */}
      {loading ? (
        <div className="border border-neutral-200 bg-white p-12 text-center">
          <LoadingSpinner />
        </div>
      ) : !messages || messages.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-neutral-100 text-black flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-black">
            NO INQUIRIES LOGGED YET
          </h3>
          <p className="text-xs text-neutral-500 font-medium max-w-md mx-auto">
            When prospective clients or collaborators submit the contact form on your storefront, messages will populate here in real-time.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="border border-neutral-200 bg-white p-12 text-center space-y-2">
          <Search className="w-6 h-6 text-neutral-400 mx-auto" />
          <h3 className="text-base font-black uppercase tracking-tight text-black">
            NO INQUIRIES MATCH YOUR FILTER
          </h3>
          <p className="text-xs text-neutral-500 font-medium">
            Try resetting your search query or filter mode.
          </p>
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <th className="py-3.5 px-4 w-12 text-center">STATUS</th>
                <th className="py-3.5 px-4">SENDER &amp; CONTACT</th>
                <th className="py-3.5 px-4">SUBJECT &amp; EXCERPT</th>
                <th className="py-3.5 px-4">RECEIVED</th>
                <th className="py-3.5 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedMsg(m)}
                  className={`cursor-pointer transition-colors hover:bg-neutral-50 ${
                    !m.read ? 'bg-white font-bold' : 'bg-neutral-50/40 text-neutral-600'
                  }`}
                >
                  <td className="py-4 px-4 text-center">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        !m.read ? 'bg-black' : 'bg-neutral-300'
                      }`}
                      title={!m.read ? 'Unread message' : 'Read'}
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-black uppercase tracking-wider text-black">
                      {m.name || 'Anonymous Client'}
                    </div>
                    <div className="text-[11px] text-neutral-500 font-medium">
                      {m.email}
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-md">
                    <div className="font-black uppercase tracking-tight text-black truncate">
                      {m.subject || 'Direct Inquiry'}
                    </div>
                    <div className="text-[11px] text-neutral-500 truncate font-normal mt-0.5">
                      {m.message}
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-[11px] text-neutral-500 font-medium">
                    {m.createdAt?.toDate
                      ? m.createdAt.toDate().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Recently'}
                  </td>
                  <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedMsg(m)}
                        className="px-3 py-1.5 border border-neutral-300 hover:border-black text-black text-[10px] font-black uppercase tracking-wider transition-colors"
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 text-neutral-400 hover:text-black transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Lightbox Modal */}
      <MessageViewModal
        message={selectedMsg}
        onClose={() => setSelectedMsg(null)}
        onDelete={handleDelete}
        onToggleRead={handleToggleRead}
      />
    </div>
  );
}
