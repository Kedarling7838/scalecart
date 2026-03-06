import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSimulation } from '@/lib/simulation';
import { Badge } from '@/components/ui/badge';

export function TopBar() {
  const { metrics, username, isLoggedIn, provider } = useSimulation();

  return (
    <header className="h-12 flex items-center justify-between border-b border-border px-4 bg-card/50 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs text-muted-foreground font-mono">
            {metrics.servers.filter(s => s.status === 'running').length} nodes
          </span>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary font-mono">
            {provider.toUpperCase()}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {metrics.trafficMode === 'viral' && (
          <Badge className="bg-destructive/20 text-destructive border-destructive/30 animate-pulse text-xs">
            ⚡ VIRAL MODE
          </Badge>
        )}
        <span className="text-xs text-muted-foreground font-mono">
          ${metrics.estimatedMonthlyCost}/mo
        </span>
        {isLoggedIn && (
          <span className="text-xs text-foreground">{username}</span>
        )}
      </div>
    </header>
  );
}
