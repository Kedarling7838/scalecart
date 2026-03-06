import { useSimulation } from '@/lib/simulation';
import { MetricCard } from '@/components/MetricCard';
import { Users, ShoppingCart, Server, Cpu, HardDrive, Database, Wifi, DollarSign } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MonitoringPage() {
  const { metrics } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cloud Monitoring</h1>
        <p className="text-sm text-muted-foreground">Detailed infrastructure health metrics</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Active Users" value={metrics.activeUsers} icon={<Users className="w-4 h-4" />} glow="primary" />
        <MetricCard label="Orders / Min" value={metrics.ordersPerMinute} icon={<ShoppingCart className="w-4 h-4" />} />
        <MetricCard label="Running Servers" value={metrics.servers.filter(s => s.status === 'running').length} icon={<Server className="w-4 h-4" />} glow="accent" />
        <MetricCard label="Monthly Cost" value={`$${metrics.estimatedMonthlyCost}`} icon={<DollarSign className="w-4 h-4" />} />
      </div>

      {/* Resource usage bars */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'CPU Usage', value: metrics.cpuUsage, icon: <Cpu className="w-4 h-4" /> },
          { label: 'Memory Usage', value: metrics.memoryUsage, icon: <HardDrive className="w-4 h-4" /> },
          { label: 'Database Load', value: metrics.dbLoad, icon: <Database className="w-4 h-4" /> },
        ].map(item => (
          <div key={item.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground flex items-center gap-2">{item.icon}{item.label}</span>
              <span className={`font-mono text-sm font-bold ${item.value > 80 ? 'text-destructive' : item.value > 50 ? 'text-warning' : 'text-accent'}`}>
                {item.value}%
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  item.value > 80 ? 'bg-destructive' : item.value > 50 ? 'bg-warning' : 'bg-accent'
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Wifi className="w-4 h-4" /> Network: {metrics.networkTraffic} MB/s
        </h3>
        <div className="w-full bg-secondary rounded-full h-2">
          <div className="bg-info h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, metrics.networkTraffic / 30)}%` }} />
        </div>
      </div>

      {/* Alerts */}
      {metrics.alerts.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">System Alerts</h3>
          <ScrollArea className="h-32">
            {metrics.alerts.slice(-10).reverse().map((alert, i) => (
              <p key={i} className="text-xs font-mono text-warning py-1 border-b border-border/50 last:border-0">{alert}</p>
            ))}
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
