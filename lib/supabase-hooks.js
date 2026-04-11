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
      const { data, error } = await supabase
        .from('products')
        .insert([{
          ...productData,
          slug: slugify(productData.name),
          rating: 0,
          review_count: 0,
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
      // Update slug if name changes
      const updatedData = { ...updates };
      if (updates.name) {
        updatedData.slug = slugify(updates.name);
      }
      updatedData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(updatedData)
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
