import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Activity, AlertTriangle } from 'lucide-react';

export default function TrafficSimulationPage() {
  const { metrics, setTrafficMode, simulateFailure } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Traffic Simulation Engine</h1>
        <p className="text-sm text-muted-foreground">Control simulated traffic patterns and test auto-scaling behavior</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setTrafficMode('idle')}
          variant={metrics.trafficMode === 'idle' ? 'default' : 'outline'}
          className="h-24 flex-col gap-2"
        >
          <Activity className="w-6 h-6" />
          <span>Idle Mode</span>
        </Button>
        <Button
          onClick={() => setTrafficMode('normal')}
          variant={metrics.trafficMode === 'normal' ? 'default' : 'outline'}
          className="h-24 flex-col gap-2"
        >
          <TrendingUp className="w-6 h-6" />
          <span>Normal Traffic</span>
        </Button>
        <Button
          onClick={() => setTrafficMode('high')}
          variant={metrics.trafficMode === 'high' ? 'default' : 'outline'}
          className="h-24 flex-col gap-2 border-warning/30"
        >
          <TrendingUp className="w-6 h-6" />
          <span>High Traffic</span>
        </Button>
        <Button
          onClick={() => setTrafficMode('viral')}
          variant={metrics.trafficMode === 'viral' ? 'default' : 'outline'}
          className={`h-24 flex-col gap-2 ${metrics.trafficMode === 'viral' ? 'bg-destructive hover:bg-destructive/90 animate-pulse' : 'border-destructive/30 hover:bg-destructive/10'}`}
        >
          <Zap className="w-6 h-6" />
          <span>⚡ Viral Sale Mode</span>
        </Button>
      </div>

      <Button
        onClick={simulateFailure}
        variant="outline"
        className="border-destructive/50 text-destructive hover:bg-destructive/10"
      >
        <AlertTriangle className="w-4 h-4 mr-2" />
        Simulate Server Failure
      </Button>

      {metrics.trafficMode === 'viral' && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 glow-destructive animate-scale-in">
          <h3 className="text-lg font-bold text-destructive mb-2">⚡ VIRAL SALE MODE ACTIVE</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
            <div><span className="text-muted-foreground">Users:</span> <span className="text-foreground">{metrics.activeUsers}</span></div>
            <div><span className="text-muted-foreground">Orders/min:</span> <span className="text-foreground">{metrics.ordersPerMinute}</span></div>
            <div><span className="text-muted-foreground">CPU:</span> <span className={metrics.cpuUsage > 80 ? 'text-destructive' : 'text-foreground'}>{metrics.cpuUsage}%</span></div>
            <div><span className="text-muted-foreground">Servers:</span> <span className="text-accent">{metrics.servers.length}</span></div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-xs text-warning font-mono">⚡ Auto Scaling Triggered</p>
            <p className="text-xs text-accent font-mono">🟢 Launching Server Instances...</p>
            <p className="text-xs text-info font-mono">⚖️ Load Balanced Across {metrics.servers.length} Servers</p>
          </div>
        </div>
      )}

      {/* Live stats */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">Live Scaling Status</h3>
        <div className="flex items-center gap-6 flex-wrap">
          {metrics.servers.map(s => (
            <div key={s.id} className={`flex items-center gap-2 text-xs font-mono p-2 rounded border animate-scale-in ${
              s.status === 'running' ? 'border-accent/30 text-accent' : 'border-destructive/30 text-destructive'
            }`}>
              <span className={`w-2 h-2 rounded-full ${s.status === 'running' ? 'bg-accent' : 'bg-destructive'} animate-pulse`} />
              {s.id} — CPU {s.cpu.toFixed(0)}%
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
