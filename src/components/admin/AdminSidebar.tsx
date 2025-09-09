import { Package, Plus, LogOut, FolderOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import hungLongLogo from "@/assets/hung-long-logo.png";

const menuItems = [
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Add Product", url: "/admin/products/add", icon: Plus },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-admin-secondary text-white font-medium shadow-sm" 
      : "hover:bg-admin-accent text-foreground";

  return (
    <Sidebar
      className="border-r border-border bg-card"
      collapsible="icon"
    >
      <SidebarHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <img 
            src={hungLongLogo} 
            alt="Hung Long Sports" 
            className={`transition-all duration-300 ${collapsed ? "w-8 h-8" : "w-12 h-12"}`}
          />
          {!collapsed && (
            <div>
              <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
              <p className="text-sm text-muted-foreground">Sports Shop</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${getNavCls({ isActive })}`}
                    >
                      <item.icon className={`${collapsed ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="w-full">
                  <button className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-destructive hover:text-destructive-foreground text-muted-foreground">
                    <LogOut className={`${collapsed ? "w-5 h-5" : "w-5 h-5"} flex-shrink-0`} />
                    {!collapsed && <span>Logout</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}