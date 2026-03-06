import { useState } from 'react';
import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Star, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProductsPage() {
  const { products, addToCart, isLoggedIn, isGuest, wishlist, toggleWishlist, categories } = useSimulation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  const recommended = products.filter(p => p.rating >= 4.5).slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
        <p className="text-sm text-muted-foreground">Cloud-native products and services</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <Button key={c} variant={category === c ? 'default' : 'outline'} size="sm" onClick={() => setCategory(c)} className="text-xs">
              {c}
            </Button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-all duration-300 group relative">
            {/* Wishlist */}
            {isLoggedIn && !isGuest && (
              <button onClick={() => toggleWishlist(product.id)} className="absolute top-3 right-3 z-10">
                <Heart className={`w-4 h-4 transition-colors ${wishlist.includes(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground hover:text-destructive'}`} />
              </button>
            )}

            <div className="text-4xl text-center py-6 group-hover:scale-110 transition-transform cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
              {product.image}
            </div>
            <h3 className="text-sm font-semibold text-foreground cursor-pointer hover:text-primary" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{product.description}</p>

            {/* Rating */}
            <div className="flex items-center gap-1 mt-2">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs text-foreground font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="font-mono font-bold text-primary">${product.price}</span>
              <Button
                size="sm"
                onClick={() => addToCart(product)}
                disabled={!isLoggedIn || isGuest || product.stock === 0}
                className="text-xs"
              >
                <ShoppingCart className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <span className={`text-xs ${product.stock > 0 ? 'text-muted-foreground' : 'text-destructive font-semibold'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">No products found</p>
      )}

      {(!isLoggedIn || isGuest) && (
        <p className="text-xs text-muted-foreground text-center">
          {isGuest ? 'Register or login to add products to cart' : 'Login to add products to cart'}
        </p>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="pt-6 border-t border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">⭐ Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommended.map(p => (
              <div key={p.id} className="rounded-lg border border-accent/20 bg-accent/5 p-3 cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="text-2xl text-center py-3">{p.image}</div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-mono text-primary text-sm">${p.price}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs">{p.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
