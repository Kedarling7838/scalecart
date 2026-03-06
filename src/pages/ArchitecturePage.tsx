import { useSimulation } from '@/lib/simulation';

export default function ArchitecturePage() {
  const { metrics } = useSimulation();
  const runningServers = metrics.servers.filter(s => s.status === 'running');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Live Cloud Architecture</h1>
        <p className="text-sm text-muted-foreground">Real-time infrastructure visualization</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-8 overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-4">
          {/* Users */}
          <ArchNode label="Users" icon="👥" count={metrics.activeUsers} color="primary" animate />
          
          {/* Arrow */}
          <FlowArrow />

          {/* CDN */}
          <ArchNode label="CDN" icon="🌐" subtitle="Edge Cache" color="info" />
          
          <FlowArrow />

          {/* Load Balancer */}
          <ArchNode label="Load Balancer" icon="⚖️" subtitle="Round Robin" color="warning" />
          
          <FlowArrow />

          {/* Auto Scaling Group */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono mb-1">Auto Scaling Group</span>
            <div className="border border-accent/30 rounded-lg p-3 bg-accent/5 min-w-[120px]">
              <div className="flex flex-wrap gap-2 justify-center">
                {runningServers.map(s => (
                  <div key={s.id} className="flex flex-col items-center p-2 rounded border border-accent/20 bg-card text-xs font-mono animate-scale-in">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse mb-1" />
                    <span className="text-foreground">{s.id}</span>
                    <span className="text-muted-foreground">{s.cpu.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <FlowArrow />

          {/* Serverless */}
          <ArchNode label="Serverless" icon="λ" subtitle="Workers" color="purple" />

          <FlowArrow />

          {/* Database & Storage */}
          <div className="flex flex-col gap-3">
            <ArchNode label="Database" icon="🗄️" subtitle={`${metrics.dbLoad.toFixed(0)}% load`} color="info" small />
            <ArchNode label="Storage" icon="💾" subtitle="Objects" color="muted" small />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <span className="text-xs text-muted-foreground">Request Flow</span>
          <p className="text-sm font-mono text-foreground mt-1">User → CDN → LB → Server → DB</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <span className="text-xs text-muted-foreground">Active Servers</span>
          <p className="text-2xl font-mono font-bold text-accent mt-1">{runningServers.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <span className="text-xs text-muted-foreground">Network Throughput</span>
          <p className="text-sm font-mono text-foreground mt-1">{metrics.networkTraffic} MB/s</p>
        </div>
      </div>
    </div>
  );
}

function ArchNode({ label, icon, count, subtitle, color, animate, small }: {
  label: string; icon: string; count?: number; subtitle?: string;
  color: string; animate?: boolean; small?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${animate ? 'animate-float' : ''}`}>
      <div className={`${small ? 'w-16 h-16' : 'w-20 h-20'} rounded-xl border border-border bg-card flex flex-col items-center justify-center shadow-lg`}>
        <span className={small ? 'text-lg' : 'text-2xl'}>{icon}</span>
        {count !== undefined && <span className="text-xs font-mono text-primary font-bold">{count}</span>}
      </div>
      <span className="text-xs font-semibold text-foreground mt-2">{label}</span>
      {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="flex items-center">
      <div className="w-8 h-px bg-border relative">
        <div className="absolute inset-0 bg-primary/60 animate-pulse-glow" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-primary/60" />
      </div>
    </div>
  );
}
