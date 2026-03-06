import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, isLoggedIn, isGuest } = useSimulation();
  const navigate = useNavigate();
  const total = cart.reduce((a, i) => a + i.product.price * i.quantity, 0);

  if (!isLoggedIn || isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
        <p className="text-muted-foreground mb-4">{isGuest ? 'Register to access cart' : 'Please login to view your cart'}</p>
        <Button onClick={() => navigate('/login')}>Login / Register</Button>
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
          <Button variant="outline" className="mt-4" onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      ) : (
        <>
          {/* Cart Summary Table */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left p-3 text-muted-foreground">Product</th>
                  <th className="text-center p-3 text-muted-foreground">Quantity</th>
                  <th className="text-right p-3 text-muted-foreground">Price</th>
                  <th className="text-right p-3 text-muted-foreground">Total</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.product.id} className="border-b border-border/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.product.image}</span>
                        <span className="text-sm font-semibold text-foreground">{item.product.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="font-mono w-8 text-center text-foreground">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono text-muted-foreground">${item.product.price.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-primary">${(item.product.price * item.quantity).toFixed(2)}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.product.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-mono font-bold text-primary">${total.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/payment')}>Proceed to Payment</Button>
        </>
      )}
    </div>
  );
}
