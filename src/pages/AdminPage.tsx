import { useSimulation } from '@/lib/simulation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

export default function AdminPage() {
  const { isAdmin, products, orders } = useSimulation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'orders'>('products');

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in gap-4">
        <p className="text-muted-foreground">Admin access required</p>
        <Button onClick={() => navigate('/login')}>Admin Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="flex gap-2">
        <Button variant={tab === 'products' ? 'default' : 'outline'} onClick={() => setTab('products')}>Products</Button>
        <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')}>Orders</Button>
      </div>

      {tab === 'products' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-3 text-muted-foreground">Product</th>
                <th className="text-right p-3 text-muted-foreground">Price</th>
                <th className="text-right p-3 text-muted-foreground">Stock</th>
                <th className="text-right p-3 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-border/50">
                  <td className="p-3 text-foreground">{p.image} {p.name}</td>
                  <td className="p-3 text-right font-mono text-primary">${p.price}</td>
                  <td className="p-3 text-right font-mono text-muted-foreground">{p.stock}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet</p>
          ) : orders.map(order => (
            <div key={order.id} className="border border-border rounded-lg bg-card p-4 flex justify-between items-center">
              <div>
                <span className="font-mono text-sm text-primary">{order.id}</span>
                <p className="text-xs text-muted-foreground">{order.items.length} items</p>
              </div>
              <span className="font-mono font-bold text-foreground">${order.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
