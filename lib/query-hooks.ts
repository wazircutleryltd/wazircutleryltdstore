'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';
import { slugify } from './utils';
import type { 
  Product, 
  Category, 
  Order, 
  DashboardSummary, 
  Customer, 
  ContactSubmission, 
  NewsletterSubscriber 
} from '@/types';

// ==========================================
// Query Keys Factory
// ==========================================
export const queryKeys = {
  products: {
    all: ['products'],
    list: (filters: Record<string, unknown>) => ['products', 'list', filters],
    active: ['products', 'active'],
    featured: ['products', 'featured'],
    trending: ['products', 'trending'],
    byCategory: (categoryId: string) => ['products', 'category', categoryId],
    byCategorySlug: (categorySlug: string) => ['products', 'categorySlug', categorySlug],
    detail: (slugOrId: string) => ['products', 'detail', slugOrId],
  },
  categories: {
    all: ['categories'],
    active: ['categories', 'active'],
    detail: (slugOrId: string) => ['categories', 'detail', slugOrId],
  },
  orders: {
    all: ['orders'],
    list: (page: number, pageSize: number, status?: string) => ['orders', 'list', page, pageSize, status],
    detail: (id: string) => ['orders', 'detail', id],
  },
  dashboard: {
    stats: ['dashboard', 'stats'],
  },
  newsletter: {
    subscribers: ['newsletter', 'subscribers'],
  },
  users: {
    all: ['users'],
    list: (page: number, pageSize: number, search?: string) => ['users', 'list', page, pageSize, search],
  },
  contactSubmissions: {
    all: ['contact_submissions'],
    list: (status?: string) => ['contact_submissions', 'list', status],
  },
  admin: {
    loginHistory: (username?: string, limit?: number) => ['admin', 'loginHistory', username, limit],
  },
};

// Lightweight projection for cards, grids, and catalogs (excludes multi-megabyte base64 galleries and full descriptions)
export const PRODUCT_CARD_SELECT = 'id, name, slug, price, compare_price, main_image, is_active, is_featured, is_trending, is_top_rated, is_best_selling, rating, delivery_date, category_id, sku, stock_quantity, created_at';

// ==========================================
// Product Queries & Mutations
// ==========================================

export function useAllProductsQuery(
  page = 1,
  pageSize = 10,
  searchTerm = '',
  categoryFilter = 'all',
  statusFilter = 'all'
) {
  return useQuery<{ products: Product[]; totalCount: number; totalPages: number }>({
    queryKey: queryKeys.products.list({ page, pageSize, searchTerm, categoryFilter, statusFilter }),
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select(`${PRODUCT_CARD_SELECT}, categories(id, name, slug)`, { count: 'exact' });

      if (searchTerm.trim()) {
        query = query.or(`name.ilike.%${searchTerm.trim()}%,sku.ilike.%${searchTerm.trim()}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category_id', categoryFilter);
      }

      if (statusFilter === 'active') {
        query = query.eq('is_active', true);
      } else if (statusFilter === 'inactive') {
        query = query.eq('is_active', false);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        products: (data || []) as unknown as Product[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

export function useActiveProductsQuery() {
  return useQuery<Product[]>({
    queryKey: queryKeys.products.active,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`${PRODUCT_CARD_SELECT}, categories(id, name, slug)`)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as unknown as Product[];
    },
  });
}

export function useProductBySlugQuery(slug: string) {
  return useQuery<Product | null>({
    queryKey: queryKeys.products.detail(slug),
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(*)')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: Boolean(slug),
  });
}

export function useFeaturedProductsQuery(limit = 10) {
  return useQuery<Product[]>({
    queryKey: [...queryKeys.products.featured, limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_CARD_SELECT)
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (data || []) as Product[];
      } catch (err) {
        console.warn('useFeaturedProductsQuery caught error:', err);
        return [];
      }
    },
  });
}

export function useTrendingProductsQuery(limit = 10) {
  return useQuery<Product[]>({
    queryKey: [...queryKeys.products.trending, limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_CARD_SELECT)
          .eq('is_active', true)
          .or('is_trending.eq.true,is_top_rated.eq.true')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (data || []) as Product[];
      } catch (err) {
        console.warn('useTrendingProductsQuery caught error:', err);
        return [];
      }
    },
  });
}

export function useProductsByCategorySlugQuery(categorySlug: string, limit = 5) {
  return useQuery<Product[]>({
    queryKey: [...queryKeys.products.byCategorySlug(categorySlug), limit],
    queryFn: async () => {
      if (!categorySlug) return [];

      try {
        const { data, error } = await supabase
          .from('products')
          .select(`${PRODUCT_CARD_SELECT}, categories!inner(slug)`)
          .eq('categories.slug', categorySlug)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (data || []) as unknown as Product[];
      } catch (err) {
        console.warn(`useProductsByCategorySlugQuery (${categorySlug}) caught error:`, err);
        return [];
      }
    },
    enabled: Boolean(categorySlug),
  });
}

export function useProductsByCategoryQuery(categoryId: string, limit = 5) {
  return useQuery<Product[]>({
    queryKey: [...queryKeys.products.byCategory(categoryId), limit],
    queryFn: async () => {
      if (!categoryId) return [];

      try {
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_CARD_SELECT)
          .eq('category_id', categoryId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        return (data || []) as Product[];
      } catch (err) {
        console.warn(`useProductsByCategoryQuery (${categoryId}) caught error:`, err);
        return [];
      }
    },
    enabled: Boolean(categoryId),
  });
}

export function useRandomProductsQuery(limit = 5) {
  return useQuery<Product[]>({
    queryKey: ['products', 'random', limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(PRODUCT_CARD_SELECT)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit * 3);

        if (error) throw error;
        const shuffled = (data || []).sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit) as Product[];
      } catch (err) {
        console.warn('useRandomProductsQuery caught error:', err);
        return [];
      }
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: any) => {
      const generatedSlug = productData.slug || (
        productData.sku 
          ? slugify(`${productData.name}-${productData.sku}`) 
          : slugify(productData.name)
      );

      const cleanProduct = {
        name: productData.name,
        description: productData.description,
        short_description: productData.short_description || productData.shortDescription || null,
        price: parseFloat(productData.price) || 0,
        compare_price: productData.compare_price !== undefined ? productData.compare_price : (productData.comparePrice || null),
        category_id: productData.category_id || productData.categoryId || null,
        images: Array.isArray(productData.images) ? productData.images : [],
        main_image: productData.main_image || productData.mainImage || '',
        is_active: productData.is_active !== undefined ? productData.is_active : (productData.isActive !== undefined ? productData.isActive : true),
        is_featured: productData.is_featured !== undefined ? productData.is_featured : Boolean(productData.isFeatured),
        is_top_rated: productData.is_top_rated !== undefined ? productData.is_top_rated : Boolean(productData.isTopRated || productData.isTrending),
        is_trending: productData.is_trending !== undefined ? productData.is_trending : Boolean(productData.isTrending),
        is_best_selling: productData.is_best_selling !== undefined ? productData.is_best_selling : Boolean(productData.isBestSelling),
        stock_quantity: productData.stock_quantity !== undefined ? parseInt(productData.stock_quantity) || 0 : (parseInt(productData.stockQuantity) || 0),
        sku: productData.sku,
        weight: productData.weight || null,
        product_size: productData.product_size || productData.productSize || null,
        delivery_date: productData.delivery_date || null,
        tags: Array.isArray(productData.tags) ? productData.tags : [],
        slug: generatedSlug,
        rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('products')
        .insert([cleanProduct])
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const cleanUpdates: any = { ...updates };
      if (updates.name && updates.sku) {
        cleanUpdates.slug = slugify(`${updates.name}-${updates.sku}`);
      } else if (updates.name) {
        cleanUpdates.slug = slugify(updates.name);
      }
      cleanUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return productId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

// ==========================================
// Category Queries & Mutations
// ==========================================

export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories.all,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return (data || []) as Category[];
    },
  });
}

export function useActiveCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories.active,
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (error) throw error;
        return (data || []) as Category[];
      } catch (err) {
        console.warn('useActiveCategoriesQuery caught error:', err);
        return [];
      }
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData: any) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Category;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });
}

// ==========================================
// Order Queries & Mutations
// ==========================================

export function useAllOrdersQuery(page = 1, pageSize = 10, statusFilter = 'all') {
  return useQuery<{ orders: Order[]; totalCount: number; totalPages: number }>({
    queryKey: ['orders', 'list', page, pageSize, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select('*', { count: 'exact' });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      return {
        orders: (data || []) as Order[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

// ==========================================
// Dashboard Stats Query
// ==========================================

export function useDashboardStatsQuery() {
  return useQuery<DashboardSummary>({
    queryKey: queryKeys.dashboard.stats,
    queryFn: async () => {
      // Try RPC first for instant database-level aggregation
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_dashboard_summary');
      if (!rpcError && rpcData) {
        return rpcData as DashboardSummary;
      }

      // Client-side fallback if RPC is not yet installed
      const [
        { count: productsCount },
        { data: orders },
        { count: customersCount }
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total, status, created_at'),
        supabase.from('users').select('*', { count: 'exact', head: true })
      ]);

      const validOrders = (orders as any[])?.filter(o => o.status !== 'cancelled') || [];
      const totalRevenue = validOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

      return {
        totalRevenue,
        productsCount: productsCount || 0,
        ordersCount: validOrders.length,
        customersCount: customersCount || 0,
      };
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// ==========================================
// Category With Product Counts Query
// ==========================================

export type CategoryWithProductCount = Category & {
  product_count: number;
};

export function useCategoriesWithProductCountsQuery() {
  return useQuery<CategoryWithProductCount[]>({
    queryKey: ['categories', 'with-counts'],
    queryFn: async () => {
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      const categoriesWithCounts = await Promise.all(
        (categories || []).map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true);

          if (countError) throw countError;

          return {
            ...category,
            product_count: count || 0,
          };
        })
      );

      return categoriesWithCounts as CategoryWithProductCount[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ==========================================
// Customer / User Queries
// ==========================================

export function useAllUsersQuery(page = 1, pageSize = 10, searchTerm = '') {
  return useQuery<{ users: Customer[]; totalCount: number; totalPages: number }>({
    queryKey: queryKeys.users.list(page, pageSize, searchTerm),
    queryFn: async () => {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' });

      if (searchTerm.trim()) {
        const term = searchTerm.trim();
        query = query.or(`email.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        users: (data || []) as Customer[],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });
}

// ==========================================
// Newsletter Subscribers Queries & Mutations
// ==========================================

export function useNewsletterSubscribersQuery() {
  return useQuery<NewsletterSubscriber[]>({
    queryKey: queryKeys.newsletter.subscribers,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as NewsletterSubscriber[];
    },
  });
}

export function useDeleteNewsletterSubscriberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriberId: string) => {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;
      return subscriberId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.newsletter.subscribers });
    },
  });
}

// ==========================================
// Contact Submissions Queries & Mutations
// ==========================================

export function useContactSubmissionsQuery(statusFilter = 'all') {
  return useQuery<ContactSubmission[]>({
    queryKey: queryKeys.contactSubmissions.list(statusFilter),
    queryFn: async () => {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as ContactSubmission[];
    },
  });
}

export function useUpdateContactSubmissionStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ submissionId, status }: { submissionId: string; status: string }) => {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', submissionId)
        .select()
        .single();

      if (error) throw error;
      return data as ContactSubmission;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contactSubmissions.all });
    },
  });
}

// ==========================================
// Order Creation Mutation
// ==========================================

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Partial<Order> | Record<string, any>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.stats });
    },
  });
}

// ==========================================
// Admin Auth & Login History Queries & Mutations
// ==========================================

export function useAdminLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      password,
      ipAddress,
      userAgent,
    }: {
      username: string;
      password: string;
      ipAddress: string;
      userAgent: string;
    }) => {
      const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'wazir@gmail.com';
      const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wazir@123';

      const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;

      const { error: insertError } = await supabase
        .from('admin_login_history')
        .insert({
          username,
          login_time: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
          success: isValid,
          failure_reason: isValid ? null : 'Invalid credentials',
        });

      if (insertError) {
        console.warn('Could not record login attempt to admin_login_history:', insertError);
      }

      return {
        success: isValid,
        message: isValid ? 'Login successful' : 'Invalid username or password',
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'loginHistory'] });
    },
  });
}

export function useAdminLoginHistoryQuery(username?: string, limit = 50) {
  return useQuery<any[]>({
    queryKey: queryKeys.admin.loginHistory(username, limit),
    queryFn: async () => {
      let query = supabase
        .from('admin_login_history')
        .select('*')
        .order('login_time', { ascending: false })
        .limit(limit);

      if (username) {
        query = query.eq('username', username);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });
}

