import { NavLink } from '@/components/NavLink';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard, ShoppingBag, Monitor, Zap, Network, DollarSign,
  BarChart3, Layers, ShoppingCart, LogIn, Shield, Package, Heart,
} from 'lucide-react';

const navGroups = [
  {
    label: 'Cloud Console',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
      { title: 'Cloud Monitoring', url: '/monitoring', icon: Monitor },
      { title: 'Traffic Simulation', url: '/traffic', icon: Zap },
      { title: 'Live Architecture', url: '/architecture', icon: Network },
      { title: 'Cost Optimization', url: '/costs', icon: DollarSign },
      { title: 'Multi-Cloud', url: '/multi-cloud', icon: Layers },
      { title: 'Startup Analytics', url: '/analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Store',
    items: [
      { title: 'Products', url: '/products', icon: ShoppingBag },
      { title: 'Cart', url: '/cart', icon: ShoppingCart },
      { title: 'Orders', url: '/orders', icon: Package },
      { title: 'Wishlist', url: '/wishlist', icon: Heart },
    ],
  },
  {
    label: 'Account',
    items: [
      { title: 'Login / Register', url: '/login', icon: LogIn },
      { title: 'Admin Panel', url: '/admin', icon: Shield },
    ],
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        {!collapsed && (
          <div className="px-4 pb-4 mb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground leading-none">Cloud Commerce</h2>
                <p className="text-xs text-muted-foreground">Simulator Pro</p>
              </div>
            </div>
          </div>
        )}

        {navGroups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-muted-foreground">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === '/'}
                        className="hover:bg-secondary/50 text-sidebar-foreground"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <item.icon className="mr-2 h-4 w-4 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
