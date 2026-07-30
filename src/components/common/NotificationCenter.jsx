import React from 'react';
import { X, Bell, Check, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const NotificationCenter = ({ isOpen, onClose, notifications, onMarkRead }) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="text-success-600" size={18} />;
      case 'warning': return <AlertTriangle className="text-warning-600" size={18} />;
      default: return <Info className="text-primary-600" size={18} />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', margin: '0 1rem 0 auto', height: '100vh', borderRadius: 0 }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
            <Bell size={18} />
            <span>Platform Notifications</span>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              No new notifications.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: n.read ? 'var(--bg-card)' : 'var(--primary-50)',
                  display: 'flex',
                  gap: '0.75rem',
                  position: 'relative'
                }}
              >
                <div style={{ marginTop: '0.2rem' }}>{getIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                    {n.message}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(n.date).toLocaleString()}
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => onMarkRead(n.id)}
                    title="Mark as read"
                    style={{
                      padding: '0.25rem',
                      color: 'var(--primary-600)',
                      alignSelf: 'flex-start'
                    }}
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
