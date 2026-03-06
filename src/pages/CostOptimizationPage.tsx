import { useSimulation } from '@/lib/simulation';
import { MetricCard } from '@/components/MetricCard';
import { Lightbulb, TrendingDown } from 'lucide-react';

export default function CostOptimizationPage() {
  const { costBreakdown, provider, providerInfo } = useSimulation();

  const total = Object.values(costBreakdown).reduce((a, b) => a + b, 0);
  const optimized = total * 0.72;
  const savings = total - optimized;

  const items = [
    { name: 'Application Servers', cost: costBreakdown.servers, optimizedCost: costBreakdown.servers * 0.65 },
    { name: 'Managed Database', cost: costBreakdown.database, optimizedCost: costBreakdown.database * 0.7 },
    { name: 'Cloud Storage', cost: costBreakdown.storage, optimizedCost: costBreakdown.storage * 0.8 },
    { name: 'Serverless Tasks', cost: costBreakdown.serverless, optimizedCost: costBreakdown.serverless * 0.85 },
    { name: 'Load Balancer', cost: costBreakdown.loadBalancer, optimizedCost: costBreakdown.loadBalancer * 0.9 },
  ];

  const suggestions = [
    { title: 'Reserved Database Instances', desc: 'Switch to 1-year reserved instances for ~30% savings on database costs.', saving: '$' + (costBreakdown.database * 0.3).toFixed(2) },
    { title: 'Serverless Background Processing', desc: 'Move batch jobs to serverless functions to reduce compute costs.', saving: '$' + (costBreakdown.servers * 0.15).toFixed(2) },
    { title: 'Storage Lifecycle Optimization', desc: 'Auto-archive cold data to cheaper storage tiers after 30 days.', saving: '$' + (costBreakdown.storage * 0.2).toFixed(2) },
    { title: 'Compute Right-Sizing', desc: 'Downsize over-provisioned instances based on actual CPU/memory usage.', saving: '$' + (costBreakdown.servers * 0.2).toFixed(2) },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cost Optimization Analytics</h1>
        <p className="text-sm text-muted-foreground">Provider: {providerInfo[provider].name}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Current Monthly Cost" value={`$${total.toFixed(2)}`} glow="warning" />
        <MetricCard label="Optimized Cost" value={`$${optimized.toFixed(2)}`} glow="accent" />
        <MetricCard label="Estimated Savings" value={`$${savings.toFixed(2)}`} glow="primary" trend="down" />
      </div>

      {/* Cost Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Resource</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Current</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Optimized</th>
              <th className="text-right p-3 font-medium text-muted-foreground">Savings</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.name} className="border-b border-border/50">
                <td className="p-3 text-foreground">{item.name}</td>
                <td className="p-3 text-right font-mono text-muted-foreground">${item.cost.toFixed(2)}</td>
                <td className="p-3 text-right font-mono text-accent">${item.optimizedCost.toFixed(2)}</td>
                <td className="p-3 text-right font-mono text-primary flex items-center justify-end gap-1">
                  <TrendingDown className="w-3 h-3" />${(item.cost - item.optimizedCost).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Suggestions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-warning" /> Smart Optimization Suggestions
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {suggestions.map(s => (
            <div key={s.title} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-semibold text-foreground">{s.title}</h4>
                <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">Save {s.saving}/mo</span>
              </div>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
