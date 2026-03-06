import { useSimulation } from '@/lib/simulation';
import { MetricCard } from '@/components/MetricCard';
import { Users, ShoppingCart, Server, Cpu, HardDrive, Database, Wifi, DollarSign } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DashboardPage() {
  const { metrics } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cloud Monitoring Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live system metrics and infrastructure status</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Active Users" value={metrics.activeUsers} icon={<Users className="w-4 h-4" />} glow={metrics.activeUsers > 500 ? 'warning' : 'primary'} trend="up" />
        <MetricCard label="Orders / Min" value={metrics.ordersPerMinute} icon={<ShoppingCart className="w-4 h-4" />} trend="up" />
        <MetricCard label="Running Servers" value={metrics.servers.filter(s => s.status === 'running').length} icon={<Server className="w-4 h-4" />} glow="accent" />
        <MetricCard label="CPU Usage" value={`${metrics.cpuUsage}%`} icon={<Cpu className="w-4 h-4" />} glow={metrics.cpuUsage > 80 ? 'destructive' : undefined} />
        <MetricCard label="Memory Usage" value={`${metrics.memoryUsage}%`} icon={<HardDrive className="w-4 h-4" />} />
        <MetricCard label="DB Load" value={`${metrics.dbLoad}%`} icon={<Database className="w-4 h-4" />} glow={metrics.dbLoad > 70 ? 'warning' : undefined} />
        <MetricCard label="Network Traffic" value={`${metrics.networkTraffic} MB/s`} icon={<Wifi className="w-4 h-4" />} />
        <MetricCard label="Monthly Cost" value={`$${metrics.estimatedMonthlyCost}`} icon={<DollarSign className="w-4 h-4" />} glow="primary" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Server Nodes */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Server Instances</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.servers.map(server => (
              <div key={server.id} className={`rounded-md border p-3 text-xs font-mono transition-all duration-500 animate-scale-in ${
                server.status === 'running' ? 'border-accent/30 bg-accent/5' : 'border-destructive/30 bg-destructive/5'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-accent animate-pulse' : 'bg-destructive'}`} />
                  <span className="text-foreground">{server.id}</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>CPU</span>
                    <span className={server.cpu > 80 ? 'text-destructive' : 'text-accent'}>{server.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div className="bg-primary h-1 rounded-full transition-all duration-1000" style={{ width: `${server.cpu}%` }} />
                  </div>
                  <div className="flex justify-between">
                    <span>MEM</span>
                    <span>{server.memory.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1">
                    <div className="bg-info h-1 rounded-full transition-all duration-1000" style={{ width: `${server.memory}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scaling Logs */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Scaling Logs</h3>
          <ScrollArea className="h-64">
            <div className="space-y-1">
              {metrics.scalingLogs.slice().reverse().map((log, i) => (
                <div key={i} className="text-xs font-mono text-muted-foreground py-1 border-b border-border/50 last:border-0">
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Alerts */}
      {metrics.alerts.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Recent Alerts</h3>
          <div className="space-y-1">
            {metrics.alerts.slice(-5).reverse().map((alert, i) => (
              <div key={i} className="text-xs font-mono text-warning py-1">{alert}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
