// ── Shared UI Components ──

import React from 'react';

// ── StatusBadge ──
const STATUS_STYLES = {
  'Submitted':  { bg: '#E6F1FB', color: '#185FA5' },
  'In review':  { bg: '#FAEEDA', color: '#BA7517' },
  'Assigned':   { bg: '#E1F5EE', color: '#0F6E56' },
  'In progress':{ bg: '#EAF3DE', color: '#3B6D11' },
  'Resolved':   { bg: '#EAF3DE', color: '#3B6D11' },
  'Closed':     { bg: '#F1EFE8', color: '#5F5E5A' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Closed'];
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 11, padding: '3px 10px',
      borderRadius: 12, fontWeight: 500,
    }}>
      {status}
    </span>
  );
}

// ── PriorityDot ──
const PRIORITY_COLORS = {
  low: 'var(--green-mid)', medium: 'var(--amber)',
  high: '#E24B4A',         critical: '#A32D2D',
};

export function PriorityDot({ priority, size = 10 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: PRIORITY_COLORS[priority] || 'var(--gray)',
      flexShrink: 0,
    }} />
  );
}

// ── LoadingSpinner ──
export function LoadingSpinner({ size = 24, color = 'var(--green)' }) {
  return (
    <div style={{
      width: size, height: size,
      border: `2px solid var(--green-light)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }} />
  );
}

// ── EmptyState ──
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
      {subtitle && <div style={{ fontSize: 13 }}>{subtitle}</div>}
    </div>
  );
}

// ── SectionHeader ──
export function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
      <h2 style={{ fontSize: 14, fontFamily: 'var(--font-display)' }}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{
          background: 'none', border: 'none', color: 'var(--green)',
          fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
        }}>
          {action}
        </button>
      )}
    </div>
  );
}

// ── InfoRow ── (label + value pair)
export function InfoRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '0.5px solid var(--border)' }}>
      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: valueColor || 'var(--text)' }}>{value}</span>
    </div>
  );
}

// ── TypeTag ──
const TYPE_COLORS = {
  'Paper':        { bg: '#E1F5EE', color: '#0F6E56' },
  'Plastic':      { bg: '#E6F1FB', color: '#185FA5' },
  'Glass':        { bg: '#FAEEDA', color: '#BA7517' },
  'Black bin':    { bg: '#F1EFE8', color: '#5F5E5A' },
  'Garden waste': { bg: '#EAF3DE', color: '#3B6D11' },
  'Bulky items':  { bg: '#FAEEDA', color: '#BA7517' },
};

export function TypeTag({ type }) {
  const c = TYPE_COLORS[type] || { bg: 'var(--surface2)', color: 'var(--text-muted)' };
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: 11, padding: '2px 8px',
      borderRadius: 10, fontWeight: 500,
    }}>
      {type}
    </span>
  );
}

// ── Avatar ──
export function Avatar({ initials, size = 40, bg = 'var(--green-light)', color = 'var(--green)' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: size * 0.32,
      fontWeight: 500, color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}
