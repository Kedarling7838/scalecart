import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSimulation } from '@/lib/simulation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, isLoggedIn, isGuest, wishlist, toggleWishlist, reviews, addReview } = useSimulation();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const product = products.find(p => p.id === id);
  if (!product) {
    return <div className="text-center py-12 text-muted-foreground animate-fade-in">Product not found</div>;
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addReview(product.id, rating, comment);
    setComment('');
    setRating(5);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-muted-foreground">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Products
      </Button>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex items-center justify-center text-8xl bg-secondary/30 rounded-lg py-16">
          {product.image}
        </div>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.reviewCount} reviews)</span>
          </div>
          <p className="text-muted-foreground">{product.description}</p>
          <span className="text-xs text-muted-foreground">Category: {product.category}</span>
          <p className="text-3xl font-mono font-bold text-primary">${product.price}</p>
          <p className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-destructive'}`}>
            {product.stock > 0 ? `✓ ${product.stock} in stock` : '✕ Out of stock'}
          </p>
          <div className="flex gap-3">
            <Button onClick={() => addToCart(product)} disabled={!isLoggedIn || isGuest || product.stock === 0} className="flex-1">
              <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
            </Button>
            {isLoggedIn && !isGuest && (
              <Button variant="outline" onClick={() => toggleWishlist(product.id)}>
                <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-border pt-6 space-y-4">
        <h2 className="text-lg font-bold text-foreground">Customer Reviews</h2>
        {productReviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {productReviews.map(r => (
              <div key={r.id} className="border border-border rounded-lg bg-card p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.username}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-foreground">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add Review */}
        {isLoggedIn && !isGuest && (
          <form onSubmit={handleSubmitReview} className="border border-border rounded-lg bg-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Write a Review</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} type="button" onClick={() => setRating(s)}>
                    <Star className={`w-5 h-5 cursor-pointer ${s <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
            <Input placeholder="Write your review..." value={comment} onChange={e => setComment(e.target.value)} className="bg-secondary" />
            <Button type="submit" size="sm">Submit Review</Button>
          </form>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Related Products</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {relatedProducts.map(p => (
              <div key={p.id} className="border border-border rounded-lg bg-card p-3 cursor-pointer hover:border-primary/30 transition-all" onClick={() => navigate(`/product/${p.id}`)}>
                <div className="text-2xl text-center py-3">{p.image}</div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <span className="font-mono text-primary text-sm">${p.price}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
