import { useParams, useNavigate } from 'react-router-dom';
import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Package, CreditCard, Truck } from 'lucide-react';

const STATUS_STEPS: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1 };
const PAYMENT_LABELS: Record<string, string> = { credit_card: 'Credit Card', upi: 'UPI', cod: 'Cash on Delivery' };

export default function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders } = useSimulation();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return <div className="text-center py-12 text-muted-foreground animate-fade-in">Order not found</div>;
  }

  const step = STATUS_STEPS[order.status] ?? 0;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Order Confirmed</h1>
          <p className="text-sm font-mono text-muted-foreground">{order.id}</p>
        </div>
      </div>

      {/* Order Tracking */}
      {order.status !== 'cancelled' && (
        <div className="border border-border rounded-lg bg-card p-6">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">Order Status</h3>
          <div className="flex items-center justify-between">
            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((label, i) => (
              <div key={label} className="flex flex-col items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-xs ${i <= step ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            {[0, 1, 2].map(i => (
              <div key={i} className={`flex-1 h-1 mx-1 rounded ${i < step ? 'bg-primary' : 'bg-secondary'}`} />
            ))}
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="border border-destructive/30 rounded-lg bg-destructive/5 p-4 text-center">
          <p className="text-destructive font-semibold">This order has been cancelled</p>
        </div>
      )}

      {/* Items */}
      <div className="border border-border rounded-lg bg-card p-4 space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Items</h3>
        {order.items.map(i => (
          <div key={i.product.id} className="flex justify-between text-sm">
            <span className="text-foreground">{i.product.image} {i.product.name} x{i.quantity}</span>
            <span className="font-mono text-primary">${(i.product.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span className="text-foreground">Total</span>
          <span className="font-mono text-primary">${order.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div className="border border-border rounded-lg bg-card p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{PAYMENT_LABELS[order.paymentMethod]}</span>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          order.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
        }`}>
          {order.paymentStatus}
        </span>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate('/orders')}>All Orders</Button>
        <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
      </div>
    </div>
  );
}
