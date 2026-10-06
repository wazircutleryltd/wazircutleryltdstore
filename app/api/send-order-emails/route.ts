import { type NextRequest } from 'next/server';
import { sendOrderNotification, sendOrderConfirmation } from '@/lib/email-service';
import type { Order } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const orderData = (await request.json()) as Order;
    
    if (!orderData || !orderData.order_number) {
      return Response.json({ error: 'Invalid order data' }, { status: 400 });
    }

    // Send emails to both admin and customer
    const [adminResult, customerResult] = await Promise.allSettled([
      sendOrderNotification(orderData),
      sendOrderConfirmation(orderData)
    ]);

    const results = {
      adminEmail: adminResult.status === 'fulfilled' ? adminResult.value : { success: false, error: adminResult.reason },
      customerEmail: customerResult.status === 'fulfilled' ? customerResult.value : { success: false, error: customerResult.reason }
    };

    return Response.json({ 
      success: true, 
      results 
    });

  } catch (error) {
    console.error('Error sending order emails:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to send emails' 
    }, { status: 500 });
  }
}
