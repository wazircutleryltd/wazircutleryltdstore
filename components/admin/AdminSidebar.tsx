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
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <Link href="/" className="flex items-center">
            <img
              className="h-8 w-auto"
              src="/logo.svg"
              alt="Wazir Cutlery"
            />
            <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
          </Link>
        </div>
        
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-[#F27F0C] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              href="/"
              className="flex-shrink-0 w-full group block text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              <div className="flex items-center">
                <Home className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                Back to Store
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
