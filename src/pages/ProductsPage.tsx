import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export default function ProductsPage() {
  const { products, addToCart, isLoggedIn } = useSimulation();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
        <p className="text-sm text-muted-foreground">Cloud-native products and services</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <div key={product.id} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all duration-300 group">
            <div className="text-4xl text-center py-6 group-hover:scale-110 transition-transform">{product.image}</div>
            <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="font-mono font-bold text-primary">${product.price}</span>
              <Button
                size="sm"
                onClick={() => addToCart(product)}
                disabled={!isLoggedIn}
                className="text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>
        ))}
      </div>

      {!isLoggedIn && (
        <p className="text-xs text-muted-foreground text-center">Login to add products to cart</p>
      )}
    </div>
  );
}
