import { supabase } from '../../../lib/supabase';
import { auth } from "@clerk/nextjs/server";

async function getAuthenticatedUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const { data: user, error } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('clerk_id', clerkId)
    .single();

  if (error || !user) {
    console.error('Error identifying user:', error);
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    let query = supabase.from('orders').select('*');
    
    // If not admin, only show user's own orders
    if (!user.is_admin) {
      query = query.eq('user_id', user.id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return Response.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return Response.json({ orders: data || [] });
  } catch (error) {
    console.error('Error in orders API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderData = await request.json();
    
    if (!orderData || !orderData.order_number) {
      return Response.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Ensure users can only create orders for themselves unless they are admin
    const targetUserId = user.is_admin ? (orderData.user_id || user.id) : user.id;

    const orderToInsert = {
      id: orderData.id || crypto.randomUUID(),
      order_number: orderData.order_number,
      user_id: targetUserId,
      status: orderData.status || 'pending',
      items: orderData.items,
      subtotal: parseFloat(orderData.subtotal) || 0,
      shipping_cost: parseFloat(orderData.shipping_cost) || 0,
      tax: parseFloat(orderData.tax) || 0,
      total: parseFloat(orderData.total) || 0,
      shipping_address: orderData.shipping_address,
      payment_status: orderData.payment_status || 'pending',
      payment_method: orderData.payment_method,
      notes: orderData.notes || null,
      estimated_delivery: orderData.estimated_delivery || null
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return Response.json({ error: 'Failed to create order', details: error.message }, { status: 500 });
    }

    return Response.json({ order: data }, { status: 201 });
  } catch (error) {
    console.error('Error in orders POST API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = await getAuthenticatedUser();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, updates } = await request.json();
    
    if (!orderId) {
      return Response.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Permission check: only admin can update any order, or user can update their own (if logic allows)
    // For now, let's assume only admins can update order status/details via this API
    if (!user.is_admin) {
      // Check if the order belongs to the user
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('user_id')
        .eq('id', orderId)
        .single();
      
      if (!existingOrder || existingOrder.user_id !== user.id) {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Further restriction: Users can't change status to 'delivered' etc if we wanted to be strict.
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return Response.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return Response.json({ order: data });
  } catch (error) {
    console.error('Error in orders PUT API:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
