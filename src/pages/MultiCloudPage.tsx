import { useSimulation, CloudProvider } from '@/lib/simulation';
import { Button } from '@/components/ui/button';

export default function MultiCloudPage() {
  const { costBreakdown, provider, setProvider, providerInfo } = useSimulation();
  const providers: CloudProvider[] = ['aws', 'azure', 'gcp'];

  const getProviderCosts = (p: CloudProvider) => {
    const m = providerInfo[p].multiplier;
    const base = {
      servers: (costBreakdown.servers / providerInfo[provider].multiplier) * m,
      database: (costBreakdown.database / providerInfo[provider].multiplier) * m,
      storage: (costBreakdown.storage / providerInfo[provider].multiplier) * m,
      serverless: (costBreakdown.serverless / providerInfo[provider].multiplier) * m,
      loadBalancer: (costBreakdown.loadBalancer / providerInfo[provider].multiplier) * m,
    };
    return { ...base, total: Object.values(base).reduce((a, b) => a + b, 0) };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Multi-Cloud Cost Comparison</h1>
        <p className="text-sm text-muted-foreground">Compare estimated costs across cloud providers</p>
      </div>

      <div className="flex gap-3">
        {providers.map(p => (
          <Button
            key={p}
            onClick={() => setProvider(p)}
            variant={provider === p ? 'default' : 'outline'}
            className="flex-1 h-16 text-lg"
          >
            {providerInfo[p].name}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left p-3 font-medium text-muted-foreground">Resource</th>
              {providers.map(p => (
                <th key={p} className={`text-right p-3 font-medium ${p === provider ? 'text-primary' : 'text-muted-foreground'}`}>
                  {providerInfo[p].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['servers', 'database', 'storage', 'serverless', 'loadBalancer'].map(resource => (
              <tr key={resource} className="border-b border-border/50">
                <td className="p-3 text-foreground capitalize">{resource === 'loadBalancer' ? 'Load Balancer' : resource}</td>
                {providers.map(p => {
                  const costs = getProviderCosts(p);
                  return (
                    <td key={p} className={`p-3 text-right font-mono ${p === provider ? 'text-primary' : 'text-muted-foreground'}`}>
                      ${(costs as any)[resource].toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-secondary/20">
              <td className="p-3 font-semibold text-foreground">Total Monthly</td>
              {providers.map(p => {
                const costs = getProviderCosts(p);
                const isLowest = providers.every(op => costs.total <= getProviderCosts(op).total);
                return (
                  <td key={p} className={`p-3 text-right font-mono font-bold ${isLowest ? 'text-accent' : p === provider ? 'text-primary' : 'text-muted-foreground'}`}>
                    ${costs.total.toFixed(2)}
                    {isLowest && <span className="ml-2 text-xs">★ Best</span>}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
