import { useSimulation } from '@/lib/simulation';

export default function OrdersPage() {
  const { orders, isLoggedIn } = useSimulation();

  if (!isLoggedIn) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground animate-fade-in">Please login to view orders</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="border border-border rounded-lg bg-card p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-primary">{order.id}</span>
                <span className="text-xs text-accent capitalize bg-accent/10 px-2 py-1 rounded">{order.status}</span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                {order.items.map(i => (
                  <p key={i.product.id}>{i.product.image} {i.product.name} x{i.quantity}</p>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</span>
                <span className="font-mono font-bold text-foreground">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
