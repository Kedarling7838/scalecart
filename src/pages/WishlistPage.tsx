import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WishlistPage() {
  const { products, wishlist, toggleWishlist, addToCart, isLoggedIn, isGuest } = useSimulation();
  const navigate = useNavigate();
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (!isLoggedIn || isGuest) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in">
        <p className="text-muted-foreground mb-4">Login to view your wishlist</p>
        <Button onClick={() => navigate('/login')}>Login</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">My Wishlist</h1>
      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Your wishlist is empty</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wishlistProducts.map(p => (
            <div key={p.id} className="flex items-center justify-between border border-border rounded-lg bg-card p-4">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                <span className="text-2xl">{p.image}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.name}</p>
                  <p className="font-mono text-primary text-sm">${p.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => addToCart(p)} disabled={p.stock === 0}>
                  <ShoppingCart className="w-3 h-3 mr-1" /> Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toggleWishlist(p.id)}>
                  <Heart className="w-4 h-4 fill-destructive text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
