"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart3,
  FileText,
  Home,
  History,
  FolderOpen,
  Upload,
  Mail
} from "lucide-react";
import { FiArrowUpRight } from "react-icons/fi";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Newsletter', href: '/admin/newsletter', icon: FileText },
  { name: 'Contact Submissions', href: '/admin/contact-submissions', icon: Mail },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Login History', href: '/admin/login-history', icon: History },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-[#0C0D0E] text-white overflow-y-auto border-r border-neutral-800/80">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 mb-8">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img
              className="h-8 w-auto brightness-0 invert"
              src="/logo.svg"
              alt="Wazir Cutlery"
            />
            <div className="flex flex-col">
              <span className="text-base font-bold text-white font-[family-name:var(--font-outfit)] tracking-tight">Wazir Cutlery</span>
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#D6AF66]">Artisan Portal</span>
            </div>
          </Link>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-3 pb-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-3 py-2.5 text-xs font-semibold rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#D6AF66] text-neutral-950 shadow-md shadow-[#D6AF66]/20 font-bold'
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-neutral-950 stroke-[2.5]' : 'text-neutral-500 group-hover:text-neutral-200'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Footer Back to Storefront Link */}
          <div className="flex-shrink-0 flex border-t border-neutral-800/80 p-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
            >
              <div className="flex items-center">
                <Home className="mr-2.5 h-4 w-4 text-neutral-500 group-hover:text-[#D6AF66] transition-colors" />
                <span>Live Storefront</span>
              </div>
              <FiArrowUpRight className="h-3.5 w-3.5 text-neutral-500 group-hover:text-[#D6AF66] transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
