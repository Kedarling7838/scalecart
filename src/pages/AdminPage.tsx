import { useSimulation, OrderStatus } from '@/lib/simulation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react';

const STATUS_OPTIONS: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  delivered: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminPage() {
  const { isAdmin, products, orders, registeredUsers, updateOrderStatus, cancelOrder, addProduct, updateProduct, deleteProduct } = useSimulation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'products' | 'orders' | 'users'>('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: '', category: 'Software', image: '📦', description: '', stock: '' });

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 animate-fade-in gap-4">
        <p className="text-muted-foreground">Admin access required</p>
        <Button onClick={() => navigate('/login')}>Admin Login</Button>
      </div>
    );
  }

  const handleAddProduct = () => {
    if (!form.name || !form.price) return;
    addProduct({
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image,
      description: form.description,
      stock: parseInt(form.stock) || 0,
    });
    setForm({ name: '', price: '', category: 'Software', image: '📦', description: '', stock: '' });
    setShowAddForm(false);
  };

  const handleUpdateProduct = (id: string) => {
    updateProduct(id, {
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image,
      description: form.description,
      stock: parseInt(form.stock) || 0,
    });
    setEditingId(null);
  };

  const startEdit = (p: typeof products[0]) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), category: p.category, image: p.image, description: p.description, stock: String(p.stock) });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>

      <div className="flex gap-2">
        <Button variant={tab === 'products' ? 'default' : 'outline'} onClick={() => setTab('products')}>Products</Button>
        <Button variant={tab === 'orders' ? 'default' : 'outline'} onClick={() => setTab('orders')}>Orders ({orders.length})</Button>
        <Button variant={tab === 'users' ? 'default' : 'outline'} onClick={() => setTab('users')}>Users ({registeredUsers.length})</Button>
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div className="space-y-4">
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </Button>

          {showAddForm && (
            <div className="border border-primary/30 rounded-lg bg-card p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">New Product</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary" />
                <Input placeholder="Price" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-secondary" />
                <Input placeholder="Category" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="bg-secondary" />
                <Input placeholder="Emoji icon" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="bg-secondary" />
                <Input placeholder="Stock" type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="bg-secondary" />
                <Input placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="bg-secondary col-span-2" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddProduct}>Add</Button>
                <Button size="sm" variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

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
                    {editingId === p.id ? (
                      <>
                        <td className="p-3"><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="bg-secondary h-8 text-sm" /></td>
                        <td className="p-3"><Input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="bg-secondary h-8 text-sm w-24 ml-auto" /></td>
                        <td className="p-3"><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} className="bg-secondary h-8 text-sm w-20 ml-auto" /></td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleUpdateProduct(p.id)}><Check className="w-4 h-4 text-green-500" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}><X className="w-4 h-4 text-muted-foreground" /></Button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-foreground">{p.image} {p.name}</td>
                        <td className="p-3 text-right font-mono text-primary">${p.price}</td>
                        <td className="p-3 text-right font-mono text-muted-foreground">{p.stock}</td>
                        <td className="p-3 text-right space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => startEdit(p)}><Edit2 className="w-3 h-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet</p>
          ) : orders.map(order => (
            <div key={order.id} className="border border-border rounded-lg bg-card p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-mono text-sm text-primary">{order.id}</span>
                  <span className="text-xs text-muted-foreground ml-2">by {order.username}</span>
                </div>
                <span className={`text-xs capitalize px-2 py-1 rounded font-semibold ${STATUS_COLORS[order.status] || ''}`}>{order.status}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {order.items.map(i => <span key={i.product.id} className="mr-2">{i.product.image} {i.product.name} x{i.quantity}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-foreground">${order.total.toFixed(2)}</span>
                <div className="flex gap-1">
                  {order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <>
                      <select
                        className="text-xs bg-secondary border border-border rounded px-2 py-1 text-foreground"
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => cancelOrder(order.id)}>Cancel</Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left p-3 text-muted-foreground">Username</th>
                <th className="text-left p-3 text-muted-foreground">Role</th>
                <th className="text-left p-3 text-muted-foreground">Provider</th>
                <th className="text-left p-3 text-muted-foreground">Joined</th>
              </tr>
            </thead>
            <tbody>
              {registeredUsers.map(u => (
                <tr key={u.user_id} className="border-b border-border/50">
                  <td className="p-3 font-mono text-foreground">{u.username}</td>
                  <td className="p-3"><span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded capitalize">{u.role}</span></td>
                  <td className="p-3 text-muted-foreground capitalize">{u.login_provider}</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
