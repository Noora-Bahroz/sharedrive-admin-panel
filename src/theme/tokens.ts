/**
 * ShareDrive Admin — design tokens
 *
 * Colors reference CSS custom properties so light/dark mode switching
 * works without touching individual component files.
 * Brand colors (lime, info, warning, etc.) are static.
 */

export const color = {
  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  border: 'var(--color-border)',

  textPrimary: 'var(--color-text-primary)',
  textSecondary: 'var(--color-text-secondary)',
  textDisabled: 'var(--color-text-disabled)',

  brand: '#C8F227',
  brandMuted: '#8FA82A',

  info: '#4FD1C5',
  warning: '#F2A93B',
  danger: '#E5484D',
  success: '#4ADE80',
} as const;

export const font = {
  display: '"Space Grotesk", "Segoe UI", sans-serif',
  body: '"Inter", "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "Consolas", monospace',
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
};

export const shadow = {
  card: '0 1px 3px rgba(0,0,0,0.08)',
  raised: '0 4px 12px rgba(0,0,0,0.1)',
};

export const statusColor: Record<string, string> = {
  active: color.success,
  approved: color.success,
  completed: color.success,
  pending: color.warning,
  requested: color.warning,
  in_progress: color.info,
  accepted: color.info,
  started: color.info,
  suspended: color.danger,
  rejected: color.danger,
  cancelled: color.danger,
};
