import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  glow?: 'primary' | 'accent' | 'warning' | 'destructive';
}

export function MetricCard({ label, value, icon, trend, className, glow }: MetricCardProps) {
  const glowClass = glow ? `glow-${glow}` : '';

  return (
    <div className={cn(
      'rounded-lg border border-border bg-card p-4 transition-all duration-300 hover:border-primary/30',
      glowClass,
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="metric-label">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className="metric-value text-foreground">{value}</span>
        {trend && (
          <span className={cn(
            'text-xs font-mono mb-1',
            trend === 'up' && 'text-accent',
            trend === 'down' && 'text-destructive',
            trend === 'neutral' && 'text-muted-foreground',
          )}>
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
          </span>
        )}
      </div>
    </div>
  );
}
