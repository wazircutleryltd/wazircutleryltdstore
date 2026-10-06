// @ts-nocheck
import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { slugify } from './utils'
import { handleAppError } from './error-handler'

// Helper function to handle Supabase errors
const handleSupabaseError = (error, context = "Database") => {
  handleAppError(error, context);
};

// Admin authentication hooks
export const useVerifyAdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const verifyAdminLogin = async (username, password, ipAddress, userAgent) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Admin credentials from env or fallback
      const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'wazir@gmail.com'
      const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'wazir@123'
      
      const isValid = username === ADMIN_USERNAME && password === ADMIN_PASSWORD
      
      // Log the login attempt
      const { error: insertError } = await supabase
        .from('admin_login_history')
        .insert({
          username,
          login_time: new Date().toISOString(),
          ip_address: ipAddress,
          user_agent: userAgent,
          success: isValid,
          failure_reason: isValid ? null : 'Invalid credentials'
        })
      
      if (insertError) throw insertError
      
      return {
        success: isValid,
        message: isValid ? 'Login successful' : 'Invalid username or password'
      }
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { verifyAdminLogin, isLoading, error }
}

export const useGetAdminLoginHistory = (limit = 50) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_login_history')
          .select('*')
          .order('login_time', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, isLoading, error }
}

export const useGetAdminLoginHistoryByUsername = (username, limit = 20) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!username) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_login_history')
          .select('*')
          .eq('username', username)
          .order('login_time', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [username, limit])

  return { data, isLoading, error }
}

// User hooks
export const useUserByClerkId = (clerkId) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!clerkId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerkId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [clerkId])

  return { data, isLoading, error }
}

export const useAllUsers = (page = 1, pageSize = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to)
        
        if (error) throw error
        setData(data || [])
        setTotalCount(count || 0)
        setTotalPages(Math.ceil((count || 0) / pageSize))
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page, pageSize])

  return { data, isLoading, error, totalCount, totalPages }
}

export const useUserById = (userId) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return { data, isLoading, error }
}

export const useCreateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createUser = async (userData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...userData,
          is_admin: userData.is_admin || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { createUser, isLoading, error }
}

export const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateUser = async (userId, updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateUser, isLoading, error }
}

export const useDeleteUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteUser = async (userId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (error) throw error
      return true
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteUser, isLoading, error }
}

// Product hooks
export const useActiveProducts = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export const useAllProducts = (reloadToken, page = 1, pageSize = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
          .from('products')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to);
        
        if (error) throw error
        setData(data || [])
        setTotalCount(count || 0)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [reloadToken, page, pageSize])

  return { 
    data, 
    isLoading, 
    error, 
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize)
  }
}

export const useFeaturedProducts = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export const useProductById = (productId) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!productId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId])

  return { data, isLoading, error }
}

export const useProductBySlug = (slug) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('slug', slug)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug])

  return { data, isLoading, error }
}

export const useProductsByCategory = (categoryId) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoryId) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  return { data, isLoading, error }
}

export const useSearchProducts = (searchTerm) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!searchTerm) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [searchTerm])

  return { data, isLoading, error }
}

export const useTopRatedProducts = (limit = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .not('rating', 'is', null)
          .gt('rating', 0)
          .order('rating', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, isLoading, error }
}

export const useTrendingProducts = (limit = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .or('is_trending.eq.true,is_top_rated.eq.true')
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, isLoading, error }
}

export const useBestSellingProducts = (limit = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('is_best_selling', true)
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, isLoading, error }
}

// Category hooks
export const useActiveCategories = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export const useAllCategories = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export const useCategoryById = (categoryId) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categoryId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  return { data, isLoading, error }
}

export const useCategoryBySlug = (slug) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!slug) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [slug])

  return { data, isLoading, error }
}

export const useCategoriesWithProductCounts = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })
        
        if (categoriesError) throw categoriesError

        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => {
            const { count, error: countError } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true })
              .eq('category_id', category.id)
              .eq('is_active', true)
            
            if (countError) throw countError
            
            return {
              ...category,
              product_count: count || 0
            }
          })
        )

        setData(categoriesWithCounts)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

// Contact form hooks
export const useSubmitContactForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const submitContactForm = async (formData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          ...formData,
          status: 'new',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { submitContactForm, isLoading, error }
}

export const useAllContactSubmissions = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

export const useContactSubmissionsByStatus = (status) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!status) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_submissions')
          .select('*')
          .eq('status', status)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [status])

  return { data, isLoading, error }
}

export const useUpdateContactSubmissionStatus = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateContactSubmissionStatus = async (submissionId, status) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', submissionId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateContactSubmissionStatus, isLoading, error }
}

// Order hooks
export const useAllOrders = (page = 1, pageSize = 10) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1

        const { data, error, count } = await supabase
          .from('orders')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range(from, to)
        
        if (error) throw error
        setData(data || [])
        setTotalCount(count || 0)
        setTotalPages(Math.ceil((count || 0) / pageSize))
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page, pageSize])

  return { data, isLoading, error, totalCount, totalPages }
}

export const useOrdersByUser = (userId) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setData(data || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return { data, isLoading, error }
}

export const useOrderById = (orderId) => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) {
      setData(null)
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single()
        
        if (error && error.code !== 'PGRST116') throw error
        setData(data)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [orderId])

  return { data, isLoading, error }
}

export const useCreateOrder = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createOrder = async (orderData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { createOrder, isLoading, error }
}

export const useUpdateOrderStatus = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateOrderStatus = async (orderId, status) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateOrderStatus, isLoading, error }
}

export const useUpdatePaymentStatus = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updatePaymentStatus = async (orderId, paymentStatus) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          payment_status: paymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updatePaymentStatus, isLoading, error }
}

// Product management hooks
export const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createProduct = async (productData) => {
    setIsLoading(true)
    setError(null)
    
    try {
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
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { createProduct, isLoading, error }
}

export const useUpdateProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateProduct = async (productId, updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const cleanUpdates = {};
      if (updates.name !== undefined) cleanUpdates.name = updates.name;
      if (updates.description !== undefined) cleanUpdates.description = updates.description;
      if (updates.short_description !== undefined || updates.shortDescription !== undefined) {
        cleanUpdates.short_description = updates.short_description !== undefined ? updates.short_description : updates.shortDescription;
      }
      if (updates.price !== undefined) cleanUpdates.price = parseFloat(updates.price) || 0;
      if (updates.compare_price !== undefined || updates.comparePrice !== undefined) {
        cleanUpdates.compare_price = updates.compare_price !== undefined ? updates.compare_price : updates.comparePrice;
      }
      if (updates.category_id !== undefined || updates.categoryId !== undefined) {
        cleanUpdates.category_id = updates.category_id !== undefined ? updates.category_id : updates.categoryId;
      }
      if (updates.images !== undefined) cleanUpdates.images = updates.images;
      if (updates.main_image !== undefined || updates.mainImage !== undefined) {
        cleanUpdates.main_image = updates.main_image !== undefined ? updates.main_image : updates.mainImage;
      }
      if (updates.is_active !== undefined || updates.isActive !== undefined) {
        cleanUpdates.is_active = updates.is_active !== undefined ? updates.is_active : updates.isActive;
      }
      if (updates.is_featured !== undefined || updates.isFeatured !== undefined) {
        cleanUpdates.is_featured = updates.is_featured !== undefined ? updates.is_featured : updates.isFeatured;
      }
      if (updates.is_top_rated !== undefined || updates.isTrending !== undefined) {
        cleanUpdates.is_top_rated = updates.is_top_rated !== undefined ? updates.is_top_rated : updates.isTrending;
      }
      if (updates.is_trending !== undefined || updates.isTrending !== undefined) {
        cleanUpdates.is_trending = updates.is_trending !== undefined ? updates.is_trending : updates.isTrending;
      }
      if (updates.is_best_selling !== undefined || updates.isBestSelling !== undefined) {
        cleanUpdates.is_best_selling = updates.is_best_selling !== undefined ? updates.is_best_selling : updates.isBestSelling;
      }
      if (updates.stock_quantity !== undefined || updates.stockQuantity !== undefined) {
        cleanUpdates.stock_quantity = updates.stock_quantity !== undefined ? updates.stock_quantity : updates.stockQuantity;
      }
      if (updates.sku !== undefined) cleanUpdates.sku = updates.sku;
      if (updates.weight !== undefined) cleanUpdates.weight = updates.weight;
      if (updates.product_size !== undefined || updates.productSize !== undefined) {
        cleanUpdates.product_size = updates.product_size !== undefined ? updates.product_size : updates.productSize;
      }
      if (updates.delivery_date !== undefined) cleanUpdates.delivery_date = updates.delivery_date;
      if (updates.tags !== undefined) cleanUpdates.tags = updates.tags;
      
      if (updates.name && updates.sku) {
        cleanUpdates.slug = slugify(`${updates.name}-${updates.sku}`);
      } else if (updates.name) {
        cleanUpdates.slug = slugify(updates.name);
      }
      cleanUpdates.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(cleanUpdates)
        .eq('id', productId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { updateProduct, isLoading, error }
}

export const useDeleteProduct = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteProduct = async (productId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
      
      if (error) throw error
      return true
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteProduct, isLoading, error }
}

// Category management hooks
export const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const createCategory = async (categoryData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          ...categoryData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { createCategory, isLoading, error }
}

export const useUpdateCategory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateCategory = async (categoryId, updates) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { updateCategory, isLoading, error }
}

export const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const deleteCategory = async (categoryId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
      
      if (error) throw error
      return true
    } catch (error) {
      setError(error)
      handleSupabaseError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return { deleteCategory, isLoading, error }
}

// Newsletter hooks
export const useAllNewsletterSubscribers = (reloadToken) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setData(data || []);
      } catch (error) {
        setError(error);
        handleSupabaseError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reloadToken]);

  return { data, isLoading, error };
};

export const useDeleteNewsletterSubscriber = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteNewsletterSubscriber = async (subscriberId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      setError(error);
      handleSupabaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteNewsletterSubscriber, isLoading, error };
};


// Additional hooks for homepage components
export const useProductsByCategorySlug = (categorySlug, limit = 5) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!categorySlug) {
      setData([])
      setIsLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        // First get the category by slug
        const { data: category, error: categoryError } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .eq('is_active', true)
          .single()
        
        if (categoryError) throw categoryError
        if (!category) {
          setData([])
          return
        }

        // Then get products for that category
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', category.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit)
        
        if (productsError) throw productsError
        setData(products || [])
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [categorySlug, limit])

  return { data, isLoading, error }
}

export const useRandomProducts = (limit = 6) => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit * 2) // Get more than needed to randomize
        
        if (error) throw error
        
        // Shuffle the array and take the first 'limit' items
        const shuffled = (data || []).sort(() => 0.5 - Math.random())
        setData(shuffled.slice(0, limit))
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [limit])

  return { data, isLoading, error }
}


export const useDashboardStats = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    productsCount: 0,
    ordersCount: 0,
    customersCount: 0,
    revenueHistory: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        // Use the optimized server-side RPC function
        const { data: summary, error: rpcError } = await supabase
          .rpc('get_dashboard_summary')
        
        if (rpcError) throw rpcError

        setData(summary)
      } catch (error) {
        setError(error)
        handleSupabaseError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { data, isLoading, error }
}
