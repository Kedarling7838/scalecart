import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  delivered: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function OrdersPage() {
  const { orders, isLoggedIn, isGuest, username } = useSimulation();
  const navigate = useNavigate();

  if (!isLoggedIn || isGuest) {
    return <div className="flex items-center justify-center h-64 text-muted-foreground animate-fade-in">Please login to view orders</div>;
  }

  const userOrders = orders.filter(o => o.username === username);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Order History</h1>
      {userOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No orders yet</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {userOrders.map(order => (
            <div key={order.id} className="border border-border rounded-lg bg-card p-4 cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate(`/order-confirmation/${order.id}`)}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm text-primary">{order.id}</span>
                <span className={`text-xs capitalize px-2 py-1 rounded font-semibold ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
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
