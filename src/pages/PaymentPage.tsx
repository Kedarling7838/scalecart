import { useState } from 'react';
import { useSimulation, PaymentMethod } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Truck, CheckCircle2 } from 'lucide-react';

const PAYMENT_OPTIONS: { method: PaymentMethod; label: string; icon: React.ReactNode; desc: string }[] = [
  { method: 'credit_card', label: 'Credit Card', icon: <CreditCard className="w-5 h-5" />, desc: 'Pay securely with credit or debit card' },
  { method: 'upi', label: 'UPI', icon: <Smartphone className="w-5 h-5" />, desc: 'Instant payment via UPI' },
  { method: 'cod', label: 'Cash on Delivery', icon: <Truck className="w-5 h-5" />, desc: 'Pay when your order arrives' },
];

export default function PaymentPage() {
  const { cart, placeOrder, isLoggedIn } = useSimulation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<PaymentMethod>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const total = cart.reduce((a, i) => a + i.product.price * i.quantity, 0);

  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  if (cart.length === 0 && !orderId) {
    navigate('/cart');
    return null;
  }

  if (orderId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in gap-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Payment Successful – Order Confirmed</h2>
        <p className="text-muted-foreground font-mono">{orderId}</p>
        <div className="flex gap-3 mt-4">
          <Button variant="outline" onClick={() => navigate('/orders')}>View Orders</Button>
          <Button onClick={() => navigate(`/order-confirmation/${orderId}`)}>Order Details</Button>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      const order = placeOrder(selected);
      if (order) setOrderId(order.id);
      setProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <h1 className="text-2xl font-bold text-foreground">Payment</h1>

      {/* Order Summary */}
      <div className="border border-border rounded-lg bg-card p-4 space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Order Summary</h3>
        {cart.map(item => (
          <div key={item.product.id} className="flex justify-between text-sm">
            <span className="text-foreground">{item.product.image} {item.product.name} x{item.quantity}</span>
            <span className="font-mono text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t border-border pt-2 flex justify-between font-semibold">
          <span className="text-foreground">Total</span>
          <span className="font-mono text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-muted-foreground">Select Payment Method</h3>
        {PAYMENT_OPTIONS.map(opt => (
          <button
            key={opt.method}
            onClick={() => setSelected(opt.method)}
            className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
              selected === opt.method ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <div className={selected === opt.method ? 'text-primary' : 'text-muted-foreground'}>{opt.icon}</div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <Button className="w-full" onClick={handlePay} disabled={processing}>
        {processing ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </div>
  );
}
