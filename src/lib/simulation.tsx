import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export type TrafficMode = 'idle' | 'normal' | 'high' | 'viral';
export type CloudProvider = 'aws' | 'azure' | 'gcp';

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
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed';
  createdAt: number;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Cloud Starter Kit', price: 29.99, category: 'Software', image: '☁️', description: 'Everything you need to get started with cloud computing.', stock: 50 },
  { id: '2', name: 'DevOps Toolkit Pro', price: 79.99, category: 'Software', image: '🛠️', description: 'Professional DevOps automation tools.', stock: 30 },
  { id: '3', name: 'Kubernetes Masterclass', price: 149.99, category: 'Course', image: '🎓', description: 'Complete K8s training from beginner to expert.', stock: 100 },
  { id: '4', name: 'Monitoring Dashboard', price: 49.99, category: 'Software', image: '📊', description: 'Real-time infrastructure monitoring solution.', stock: 45 },
  { id: '5', name: 'Auto-Scaling Engine', price: 199.99, category: 'Software', image: '⚡', description: 'Intelligent auto-scaling for your applications.', stock: 20 },
  { id: '6', name: 'Cloud Security Suite', price: 99.99, category: 'Software', image: '🔒', description: 'Enterprise-grade security for cloud deployments.', stock: 35 },
  { id: '7', name: 'Serverless Framework', price: 59.99, category: 'Software', image: '🚀', description: 'Build and deploy serverless applications easily.', stock: 60 },
  { id: '8', name: 'Database Optimizer', price: 89.99, category: 'Software', image: '🗄️', description: 'Optimize your database performance and costs.', stock: 25 },
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
  username: string;
  growthDay: number;
  setProvider: (p: CloudProvider) => void;
  setTrafficMode: (m: TrafficMode) => void;
  simulateFailure: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  placeOrder: () => void;
  login: (username: string, password: string) => boolean;
  adminLogin: (username: string, password: string) => boolean;
  guestLogin: () => void;
  logout: () => void;
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
  const [username, setUsername] = useState('');
  const [growthDay, setGrowthDay] = useState(1);

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

  // Growth day simulation
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

  const placeOrder = useCallback(() => {
    if (cart.length === 0) return;
    const order: Order = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      items: [...cart],
      total: cart.reduce((a, i) => a + i.product.price * i.quantity, 0),
      status: 'pending',
      createdAt: Date.now(),
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setMetrics(prev => ({
      ...prev,
      scalingLogs: [...prev.scalingLogs, `📦 Order ${order.id} placed — triggering cloud resource allocation`].slice(-30),
    }));
  }, [cart]);

  const login = useCallback((u: string, _p: string) => {
    if (u.trim()) {
      setUsername(u);
      setIsLoggedIn(true);
      setIsAdmin(false);
      return true;
    }
    return false;
  }, []);

  const adminLogin = useCallback((u: string, p: string) => {
    if (u === 'admin' && p === 'admin123') {
      setUsername('admin');
      setIsLoggedIn(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const guestLogin = useCallback(() => {
    setUsername('Guest');
    setIsLoggedIn(true);
    setIsAdmin(false);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername('');
    setCart([]);
  }, []);

  return (
    <SimulationContext.Provider value={{
      metrics, costBreakdown, provider, products: PRODUCTS, cart, orders,
      isLoggedIn, isAdmin, username, growthDay,
      setProvider, setTrafficMode, simulateFailure,
      addToCart, removeFromCart, placeOrder,
      login, adminLogin, guestLogin, logout,
      providerInfo: PROVIDER_MULTIPLIERS,
    }}>
      {children}
    </SimulationContext.Provider>
  );
}
