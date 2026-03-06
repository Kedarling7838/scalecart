import { useSimulation } from '@/lib/simulation';
import { MetricCard } from '@/components/MetricCard';
import { Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export default function StartupAnalyticsPage() {
  const { metrics, orders, growthDay } = useSimulation();

  const growthTimeline = [
    { day: 1, users: 10, label: 'Launch Day' },
    { day: 7, users: 35, label: 'Week 1' },
    { day: 14, users: 70, label: 'Week 2' },
    { day: 30, users: 200, label: 'Month 1' },
    { day: 60, users: 500, label: 'Month 2' },
    { day: 90, users: 1000, label: 'Month 3' },
  ];

  const revenue = orders.reduce((a, o) => a + o.total, 0);
  const conversionRate = metrics.activeUsers > 0 ? ((metrics.ordersPerMinute / metrics.activeUsers) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Startup Growth Analytics</h1>
        <p className="text-sm text-muted-foreground">Business growth metrics and projections</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Daily Active Users" value={metrics.activeUsers} icon={<Users className="w-4 h-4" />} glow="primary" trend="up" />
        <MetricCard label="Total Orders" value={orders.length} icon={<ShoppingCart className="w-4 h-4" />} trend="up" />
        <MetricCard label="Revenue" value={`$${revenue.toFixed(2)}`} icon={<DollarSign className="w-4 h-4" />} glow="accent" />
        <MetricCard label="Conversion Rate" value={`${conversionRate}%`} icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Growth Timeline */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Startup Growth Timeline</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {growthTimeline.map(point => {
            const active = growthDay >= point.day;
            const height = (point.users / 1000) * 100;
            return (
              <div key={point.day} className="flex-1 flex flex-col items-center justify-end h-full">
                <span className={`text-xs font-mono mb-1 ${active ? 'text-primary' : 'text-muted-foreground/50'}`}>
                  {point.users}
                </span>
                <div
                  className={`w-full max-w-12 rounded-t transition-all duration-1000 ${
                    active ? 'bg-primary/80' : 'bg-secondary'
                  }`}
                  style={{ height: `${active ? height : 10}%` }}
                />
                <span className={`text-xs mt-2 text-center ${active ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {point.label}
                </span>
                <span className="text-xs text-muted-foreground">Day {point.day}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-xs text-muted-foreground font-mono text-center">
          Current: Day {growthDay} / 90
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-2">Growth Impact on Infrastructure</h3>
        <p className="text-xs text-muted-foreground">
          As user base grows, servers and cloud costs scale automatically. Day {growthDay}: {metrics.servers.length} servers running, ${metrics.estimatedMonthlyCost}/mo estimated cost.
        </p>
      </div>
    </div>
  );
}
