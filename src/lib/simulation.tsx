import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type TrafficMode = 'idle' | 'normal' | 'high' | 'viral';
export type CloudProvider = 'aws' | 'azure' | 'gcp';
export type UserRole = 'admin' | 'customer' | 'guest';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'credit_card' | 'upi' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface ServerInstance {
  id: string;
  status: 'running' | 'stopped' | 'launching' | 'terminating';
  cpu: number;
  memory: number;
  launchedAt: number;
}

export interface CloudMetrics {
  activeUsers: number;
  ordersPerMinute: number;
  cpuUsage: number;
  memoryUsage: number;
  dbLoad: number;
  networkTraffic: number;
  estimatedMonthlyCost: number;
  servers: ServerInstance[];
  trafficMode: TrafficMode;
  scalingLogs: string[];
  alerts: string[];
}

export interface CostBreakdown {
  servers: number;
  database: number;
  storage: number;
  serverless: number;
  loadBalancer: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  rating: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  productId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  username: string;
  createdAt: number;
}

export interface RegisteredUser {
  user_id: string;
  username: string;
  role: UserRole;
  login_provider: 'local' | 'google';
  created_at: number;
}

const CATEGORIES = ['All', 'Software', 'Course', 'Hardware', 'Service'];

const PRODUCTS: Product[] = [
  { id: '1', name: 'Cloud Starter Kit', price: 29.99, category: 'Software', image: '☁️', description: 'Everything you need to get started with cloud computing. Includes setup guides, templates, and best practices.', stock: 50, rating: 4.5, reviewCount: 24 },
  { id: '2', name: 'DevOps Toolkit Pro', price: 79.99, category: 'Software', image: '🛠️', description: 'Professional DevOps automation tools for CI/CD pipelines, infrastructure as code, and monitoring.', stock: 30, rating: 4.8, reviewCount: 56 },
  { id: '3', name: 'Kubernetes Masterclass', price: 149.99, category: 'Course', image: '🎓', description: 'Complete K8s training from beginner to expert. 40+ hours of content with hands-on labs.', stock: 100, rating: 4.9, reviewCount: 132 },
  { id: '4', name: 'Monitoring Dashboard', price: 49.99, category: 'Software', image: '📊', description: 'Real-time infrastructure monitoring solution with alerting and custom dashboards.', stock: 45, rating: 4.3, reviewCount: 18 },
  { id: '5', name: 'Auto-Scaling Engine', price: 199.99, category: 'Software', image: '⚡', description: 'Intelligent auto-scaling for your applications with predictive algorithms.', stock: 20, rating: 4.7, reviewCount: 41 },
  { id: '6', name: 'Cloud Security Suite', price: 99.99, category: 'Software', image: '🔒', description: 'Enterprise-grade security for cloud deployments including WAF, DDoS protection.', stock: 35, rating: 4.6, reviewCount: 67 },
  { id: '7', name: 'Serverless Framework', price: 59.99, category: 'Software', image: '🚀', description: 'Build and deploy serverless applications easily across multiple cloud providers.', stock: 60, rating: 4.4, reviewCount: 29 },
  { id: '8', name: 'Database Optimizer', price: 89.99, category: 'Software', image: '🗄️', description: 'Optimize your database performance and costs with intelligent query analysis.', stock: 25, rating: 4.2, reviewCount: 15 },
  { id: '9', name: 'Cloud GPU Server', price: 299.99, category: 'Hardware', image: '🖥️', description: 'High-performance GPU compute instance for ML training and rendering.', stock: 10, rating: 4.8, reviewCount: 8 },
  { id: '10', name: 'Managed CDN Service', price: 39.99, category: 'Service', image: '🌐', description: 'Global content delivery network with edge caching and DDoS protection.', stock: 999, rating: 4.5, reviewCount: 44 },
  { id: '11', name: 'Docker Workshop', price: 69.99, category: 'Course', image: '🐳', description: 'Hands-on Docker containerization workshop with real-world projects.', stock: 80, rating: 4.6, reviewCount: 71 },
  { id: '12', name: 'CI/CD Pipeline Kit', price: 119.99, category: 'Service', image: '🔄', description: 'Pre-configured CI/CD pipelines for rapid deployment automation.', stock: 40, rating: 4.4, reviewCount: 33 },
];

const SAMPLE_REVIEWS: Review[] = [
  { id: 'r1', productId: '1', username: 'clouddev', rating: 5, comment: 'Great starter kit! Got my project running in hours.', createdAt: Date.now() - 86400000 * 5 },
  { id: 'r2', productId: '1', username: 'techie42', rating: 4, comment: 'Good content but could use more advanced examples.', createdAt: Date.now() - 86400000 * 3 },
  { id: 'r3', productId: '2', username: 'devops_guru', rating: 5, comment: 'Best DevOps toolkit I have used. Highly recommend!', createdAt: Date.now() - 86400000 * 7 },
  { id: 'r4', productId: '3', username: 'k8s_learner', rating: 5, comment: 'Comprehensive course. The labs are fantastic.', createdAt: Date.now() - 86400000 * 2 },
  { id: 'r5', productId: '5', username: 'startup_cto', rating: 4, comment: 'Saved us thousands in cloud costs with smart scaling.', createdAt: Date.now() - 86400000 * 10 },
];

const PROVIDER_MULTIPLIERS: Record<CloudProvider, { name: string; multiplier: number; color: string }> = {
  aws: { name: 'AWS', multiplier: 1.0, color: 'hsl(38, 92%, 55%)' },
  azure: { name: 'Azure', multiplier: 1.12, color: 'hsl(200, 80%, 55%)' },
  gcp: { name: 'Google Cloud', multiplier: 0.95, color: 'hsl(142, 60%, 50%)' },
};

function createServer(id: string): ServerInstance {
  return { id, status: 'running', cpu: 20 + Math.random() * 30, memory: 30 + Math.random() * 20, launchedAt: Date.now() };
}

function getTargetServers(users: number): number {
  if (users < 100) return 1;
  if (users <= 300) return 2;
  if (users <= 600) return 3;
  return 5;
}

interface SimulationState {
  metrics: CloudMetrics;
  costBreakdown: CostBreakdown;
  provider: CloudProvider;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  isLoggedIn: boolean;
  isAdmin: boolean;
  isGuest: boolean;
  role: UserRole;
  username: string;
  growthDay: number;
  wishlist: string[];
  reviews: Review[];
  registeredUsers: RegisteredUser[];
  categories: string[];
  setProvider: (p: CloudProvider) => void;
  setTrafficMode: (m: TrafficMode) => void;
  simulateFailure: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  placeOrder: (paymentMethod: PaymentMethod) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder: (orderId: string) => void;
  login: (username: string, password: string) => boolean;
  register: (username: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  googleLogin: () => void;
  guestLogin: () => void;
  logout: () => void;
  toggleWishlist: (productId: string) => void;
  addReview: (productId: string, rating: number, comment: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  providerInfo: typeof PROVIDER_MULTIPLIERS;
}

const SimulationContext = createContext<SimulationState | null>(null);

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const [trafficMode, setTrafficModeState] = useState<TrafficMode>('idle');
  const [provider, setProvider] = useState<CloudProvider>('aws');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [role, setRole] = useState<UserRole>('guest');
  const [username, setUsername] = useState('');
  const [growthDay, setGrowthDay] = useState(1);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [productList, setProductList] = useState<Product[]>(PRODUCTS);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    { user_id: 'u-admin', username: 'admin', role: 'admin', login_provider: 'local', created_at: Date.now() - 86400000 * 30 },
  ]);

  const [metrics, setMetrics] = useState<CloudMetrics>({
    activeUsers: 12,
    ordersPerMinute: 2,
    cpuUsage: 15,
    memoryUsage: 25,
    dbLoad: 10,
    networkTraffic: 50,
    estimatedMonthlyCost: 85,
    servers: [createServer('srv-001')],
    trafficMode: 'idle',
    scalingLogs: ['System initialized with 1 server instance'],
    alerts: [],
  });

  const tickRef = useRef<ReturnType<typeof setInterval>>();

  const setTrafficMode = useCallback((mode: TrafficMode) => {
    setTrafficModeState(mode);
    setMetrics(prev => {
      const newAlerts = [...prev.alerts];
      const newLogs = [...prev.scalingLogs];
      if (mode === 'viral') {
        newAlerts.push('⚡ Viral Sale Mode Activated!');
        newLogs.push('⚡ VIRAL SALE MODE — Auto Scaling Triggered');
      } else if (mode === 'high') {
        newAlerts.push('🔶 High Traffic Simulation Started');
        newLogs.push('High traffic pattern detected');
      } else if (mode === 'normal') {
        newAlerts.push('🟢 Normal Traffic Simulation Started');
      } else {
        newAlerts.push('Traffic simulation stopped');
      }
      return { ...prev, trafficMode: mode, alerts: newAlerts.slice(-20), scalingLogs: newLogs.slice(-30) };
    });
  }, []);

  const simulateFailure = useCallback(() => {
    setMetrics(prev => {
      if (prev.servers.length === 0) return prev;
      const failIdx = Math.floor(Math.random() * prev.servers.length);
      const failed = prev.servers[failIdx];
      const newServers = prev.servers.map((s, i) => i === failIdx ? { ...s, status: 'stopped' as const } : s);
      const replacementId = `srv-${String(Date.now()).slice(-3)}`;
      const newLogs = [
        ...prev.scalingLogs,
        `🔴 Server ${failed.id} FAILURE DETECTED`,
        `🔄 Load Balancer redirecting traffic...`,
        `🟢 Launching replacement instance ${replacementId}`,
        `✅ Traffic redirected successfully`,
      ].slice(-30);
      const newAlerts = [
        ...prev.alerts,
        `🔴 Server Failure Detected — ${failed.id}`,
        `🟢 Launching Replacement Instance`,
        `✅ Traffic Redirected Successfully`,
      ].slice(-20);

      setTimeout(() => {
        setMetrics(p => ({
          ...p,
          servers: [...p.servers.filter(s => s.id !== failed.id), createServer(replacementId)],
        }));
      }, 2000);

      return { ...prev, servers: newServers, scalingLogs: newLogs, alerts: newAlerts };
    });
  }, []);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setMetrics(prev => {
        const mode = prev.trafficMode;
        let targetUsers: number;
        if (mode === 'idle') targetUsers = 8 + Math.random() * 15;
        else if (mode === 'normal') targetUsers = 80 + Math.random() * 120;
        else if (mode === 'high') targetUsers = 300 + Math.random() * 300;
        else targetUsers = 800 + Math.random() * 500;

        const activeUsers = Math.round(prev.activeUsers + (targetUsers - prev.activeUsers) * 0.15);
        const ordersPerMinute = Math.max(0, Math.round(activeUsers * (0.02 + Math.random() * 0.03)));
        const targetServerCount = getTargetServers(activeUsers);
        let servers = [...prev.servers.filter(s => s.status === 'running')];
        const newLogs = [...prev.scalingLogs];

        if (servers.length < targetServerCount) {
          const needed = targetServerCount - servers.length;
          for (let i = 0; i < needed; i++) {
            const id = `srv-${String(Date.now() + i).slice(-3)}`;
            servers.push(createServer(id));
            newLogs.push(`🟢 Auto Scaling: Launching ${id} (${servers.length}/${targetServerCount} servers)`);
          }
        } else if (servers.length > targetServerCount) {
          const excess = servers.length - targetServerCount;
          for (let i = 0; i < excess; i++) {
            const removed = servers.pop()!;
            newLogs.push(`🔻 Scaling Down: Terminating ${removed.id}`);
          }
        }

        servers = servers.map(s => ({
          ...s,
          cpu: Math.min(95, Math.max(5, (activeUsers / (servers.length * 200)) * 100 + (Math.random() - 0.5) * 20)),
          memory: Math.min(90, Math.max(15, (activeUsers / (servers.length * 250)) * 100 + (Math.random() - 0.5) * 15)),
        }));

        const cpuUsage = servers.reduce((a, s) => a + s.cpu, 0) / servers.length;
        const memoryUsage = servers.reduce((a, s) => a + s.memory, 0) / servers.length;
        const dbLoad = Math.min(95, activeUsers * 0.08 + Math.random() * 10);
        const networkTraffic = activeUsers * 2.5 + Math.random() * 100;
        const baseCost = servers.length * 45 + 35 + 15 + ordersPerMinute * 0.5 + 20;
        const estimatedMonthlyCost = Math.round(baseCost * 100) / 100;

        return {
          ...prev,
          activeUsers,
          ordersPerMinute,
          cpuUsage: Math.round(cpuUsage * 10) / 10,
          memoryUsage: Math.round(memoryUsage * 10) / 10,
          dbLoad: Math.round(dbLoad * 10) / 10,
          networkTraffic: Math.round(networkTraffic),
          estimatedMonthlyCost,
          servers,
          scalingLogs: newLogs.slice(-30),
        };
      });
    }, 1500);
    return () => clearInterval(tickRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrowthDay(d => Math.min(d + 1, 90));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const costBreakdown: CostBreakdown = {
    servers: metrics.servers.length * 45 * PROVIDER_MULTIPLIERS[provider].multiplier,
    database: 35 * PROVIDER_MULTIPLIERS[provider].multiplier,
    storage: 15 * PROVIDER_MULTIPLIERS[provider].multiplier,
    serverless: metrics.ordersPerMinute * 0.5 * PROVIDER_MULTIPLIERS[provider].multiplier,
    loadBalancer: 20 * PROVIDER_MULTIPLIERS[provider].multiplier,
  };

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
    } else {
      setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
    }
  }, []);

  const placeOrder = useCallback((paymentMethod: PaymentMethod): Order | null => {
    if (cart.length === 0) return null;
    const order: Order = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      items: [...cart],
      total: cart.reduce((a, i) => a + i.product.price * i.quantity, 0),
      status: 'pending',
      paymentMethod,
      paymentStatus: 'completed',
      username,
      createdAt: Date.now(),
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setMetrics(prev => ({
      ...prev,
      scalingLogs: [...prev.scalingLogs, `📦 Order ${order.id} placed — triggering cloud resource allocation`].slice(-30),
    }));
    return order;
  }, [cart, username]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' as OrderStatus, paymentStatus: 'failed' as PaymentStatus } : o));
  }, []);

  const register = useCallback((u: string, _p: string): boolean => {
    if (!u.trim()) return false;
    if (registeredUsers.some(r => r.username === u)) return false;
    const newUser: RegisteredUser = {
      user_id: `u-${Date.now()}`,
      username: u,
      role: 'customer',
      login_provider: 'local',
      created_at: Date.now(),
    };
    setRegisteredUsers(prev => [...prev, newUser]);
    setUsername(u);
    setIsLoggedIn(true);
    setIsAdmin(false);
    setIsGuest(false);
    setRole('customer');
    return true;
  }, [registeredUsers]);

  const login = useCallback((u: string, _p: string) => {
    if (u.trim()) {
      setUsername(u);
      setIsLoggedIn(true);
      setIsAdmin(false);
      setIsGuest(false);
      setRole('customer');
      if (!registeredUsers.some(r => r.username === u)) {
        setRegisteredUsers(prev => [...prev, {
          user_id: `u-${Date.now()}`,
          username: u,
          role: 'customer' as UserRole,
          login_provider: 'local' as const,
          created_at: Date.now(),
        }]);
      }
      return true;
    }
    return false;
  }, [registeredUsers]);

  const adminLogin = useCallback((u: string, p: string) => {
    if (u === 'admin' && p === 'admin123') {
      setUsername('admin');
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsGuest(false);
      setRole('admin');
      return true;
    }
    return false;
  }, []);

  const googleLogin = useCallback(() => {
    const googleName = 'GoogleUser_' + Math.floor(Math.random() * 1000);
    setUsername(googleName);
    setIsLoggedIn(true);
    setIsAdmin(false);
    setIsGuest(false);
    setRole('customer');
    setRegisteredUsers(prev => [...prev, {
      user_id: `u-${Date.now()}`,
      username: googleName,
      role: 'customer' as UserRole,
      login_provider: 'google' as const,
      created_at: Date.now(),
    }]);
  }, []);

  const guestLogin = useCallback(() => {
    setUsername('Guest');
    setIsLoggedIn(true);
    setIsAdmin(false);
    setIsGuest(true);
    setRole('guest');
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsGuest(false);
    setRole('guest');
    setUsername('');
    setCart([]);
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  }, []);

  const addReview = useCallback((productId: string, rating: number, comment: string) => {
    const review: Review = {
      id: `r-${Date.now()}`,
      productId,
      username,
      rating,
      comment,
      createdAt: Date.now(),
    };
    setReviews(prev => [...prev, review]);
    // Update product rating
    setProductList(prev => prev.map(p => {
      if (p.id !== productId) return p;
      const productReviews = [...reviews.filter(r => r.productId === productId), review];
      const avgRating = productReviews.reduce((a, r) => a + r.rating, 0) / productReviews.length;
      return { ...p, rating: Math.round(avgRating * 10) / 10, reviewCount: productReviews.length };
    }));
  }, [username, reviews]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = { ...product, id: `p-${Date.now()}`, rating: 0, reviewCount: 0 };
    setProductList(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductList(prev => prev.filter(p => p.id !== id));
  }, []);

  return (
    <SimulationContext.Provider value={{
      metrics, costBreakdown, provider, products: productList, cart, orders,
      isLoggedIn, isAdmin, isGuest, role, username, growthDay,
      wishlist, reviews, registeredUsers, categories: CATEGORIES,
      setProvider, setTrafficMode, simulateFailure,
      addToCart, removeFromCart, updateCartQuantity,
      placeOrder, updateOrderStatus, cancelOrder,
      login, register, adminLogin, googleLogin, guestLogin, logout,
      toggleWishlist, addReview,
      addProduct, updateProduct, deleteProduct,
      providerInfo: PROVIDER_MULTIPLIERS,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
