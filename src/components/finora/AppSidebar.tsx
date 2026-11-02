import { Link } from "@tanstack/react-router";
import {
  ChartPie,
  CreditCard,
  Gauge,
  LayoutDashboard,
  Lightbulb,
  UserRoundSearch,
} from "lucide-react";
import finoraIcon from "@/assets/finora-icon.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Customer 360", url: "/customer-360", icon: UserRoundSearch },
  { title: "Fraud Detection", url: "/fraud-detection", icon: CreditCard },
  { title: "Customer Churn", url: "/customer-churn", icon: ChartPie },
  {
    title: "Product Recommendations",
    url: "/product-recommendations",
    icon: Lightbulb,
  },
  { title: "Model Insights", url: "/model-insights", icon: Gauge },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2.5 px-2 py-1.5">
          <img
            src={finoraIcon}
            alt="FINORA icon"
            className="h-9 w-9 shrink-0 object-contain"
          />
          <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold tracking-[0.18em] text-sidebar-foreground">
              FINORA
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] text-sidebar-foreground/60 uppercase">
              Beyond the Numbers
            </span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Intelligence</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      to={item.url}
                      activeProps={{
                        className:
                          "bg-sidebar-accent text-sidebar-accent-foreground font-semibold",
                      }}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent px-3 py-2.5 text-[11px] leading-relaxed text-sidebar-foreground/70 group-data-[collapsible=icon]:hidden">
          Demo environment — predictions are mock data pending the Python model
          backend.
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
