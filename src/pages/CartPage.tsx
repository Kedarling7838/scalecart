import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, placeOrder, isLoggedIn } = useSimulation();
  const navigate = useNavigate();
  const total = cart.reduce((a, i) => a + i.product.price * i.quantity, 0);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
        <p className="text-muted-foreground mb-4">Please login to view your cart</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center justify-between border border-border rounded-lg bg-card p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.product.image}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-primary">${(item.product.price * item.quantity).toFixed(2)}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-mono font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={placeOrder}>Place Order</Button>
        </>
      )}
    </div>
  );
}
