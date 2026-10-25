import type { Order } from '@/types';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SENDER_EMAIL = "onboarding@resend.dev";

export interface SendEmailResult {
  success: boolean;
  message: string;
}

// Send an email using Resend
export const sendEmail = async (to: string, subject: string, html: string): Promise<SendEmailResult> => {
  if (!RESEND_API_KEY) {
    console.error("CRITICAL: RESEND_API_KEY environment variable is not set. Email not sent.");
    return { success: false, message: "Email configuration missing." };
  }

  console.log(`Attempting to send email to: ${to} with subject: ${subject}`);

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    const responseBody = await response.json();
    console.log("Resend API Response Status:", response.status);
    console.log("Resend API Response Body:", responseBody);

    if (!response.ok) {
      console.error("Failed to send email. See response body above.");
      return { success: false, message: "Failed to send email." };
    }

    console.log("Email sent successfully according to Resend.");
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
};

// Send contact form notification email
export const sendContactNotification = async (contactData: Record<string, any>): Promise<SendEmailResult> => {
  const emailHtml = `
    <h1>New Contact Form Submission</h1>
    <p><strong>Contact ID:</strong> ${contactData.id}</p>
    <h2>Customer Details:</h2>
    <ul>
      <li><strong>Name:</strong> ${contactData.full_name}</li>
      <li><strong>Email:</strong> ${contactData.email}</li>
      <li><strong>Phone:</strong> ${contactData.phone_number || 'Not provided'}</li>
      <li><strong>WhatsApp:</strong> ${contactData.whatsapp_number || 'Not provided'}</li>
    </ul>
    <h2>Company Information:</h2>
    <ul>
      <li><strong>Company Name:</strong> ${contactData.company_name || 'Not provided'}</li>
      <li><strong>Company Email:</strong> ${contactData.company_email || 'Not provided'}</li>
    </ul>
    <h2>Location:</h2>
    <ul>
      <li><strong>Country:</strong> ${contactData.country || 'Not provided'}</li>
      <li><strong>Location:</strong> ${contactData.location || 'Not provided'}</li>
      <li><strong>City:</strong> ${contactData.city || 'Not provided'}</li>
    </ul>
    <h2>Order Details:</h2>
    <ul>
      <li><strong>Product Quantity:</strong> ${contactData.product_quantity || 'Not specified'}</li>
      <li><strong>Shipment Address:</strong> ${contactData.shipment_address || 'Not provided'}</li>
      <li><strong>Emergency Contact:</strong> ${contactData.emergency_contact || 'Not provided'}</li>
    </ul>
    <h2>Message:</h2>
    <p>${contactData.message || 'No message provided'}</p>
  `;

  return await sendEmail(
    "wazircutleryltd@gmail.com",
    "New Contact Form Submission",
    emailHtml
  );
};

// Send order notification email to admin
export const sendOrderNotification = async (orderData: Order): Promise<SendEmailResult> => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #f27f0c; text-align: center;">New Order Received</h1>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Information</h2>
        <p><strong>Order ID:</strong> ${orderData.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> ${orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
        <p><strong>Total Amount:</strong> $${orderData.total.toFixed(2)}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Customer Information</h2>
        <p><strong>Name:</strong> ${orderData.shipping_address.full_name}</p>
        <p><strong>Email:</strong> ${orderData.shipping_address.email}</p>
        <p><strong>Phone:</strong> ${orderData.shipping_address.phone}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Shipping Address</h2>
        <p>${orderData.shipping_address.address}</p>
        <p>${orderData.shipping_address.city}, ${orderData.shipping_address.country} ${orderData.shipping_address.postal_code || ''}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Items</h2>
        ${orderData.items.map(item => `
          <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
            <p><strong>${item.product_name}</strong></p>
            <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)} | Total: $${item.total.toFixed(2)}</p>
          </div>
        `).join('')}
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Summary</h2>
        <p>Subtotal: $${orderData.subtotal.toFixed(2)}</p>
        <p>Tax (10%): $${orderData.tax.toFixed(2)}</p>
        <p>Shipping: ${orderData.shipping_cost === 0 ? 'FREE' : `$${orderData.shipping_cost.toFixed(2)}`}</p>
        <p><strong>Total: $${orderData.total.toFixed(2)}</strong></p>
      </div>
    </div>
  `;

  return await sendEmail(
    "wazircutleryltd@gmail.com",
    `New Order: ${orderData.order_number}`,
    emailHtml
  );
};

// Send order confirmation email to customer
export const sendOrderConfirmation = async (orderData: Order): Promise<SendEmailResult> => {
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #f27f0c; margin-bottom: 10px;">Thank You for Your Order!</h1>
        <p style="color: #666;">Your order has been successfully placed and is being processed.</p>
      </div>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Information</h2>
        <p><strong>Order ID:</strong> ${orderData.order_number}</p>
        <p><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
        <p><strong>Payment Method:</strong> ${orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card'}</p>
        <p><strong>Order Status:</strong> ${orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}</p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Items</h2>
        ${orderData.items.map(item => `
          <div style="border-bottom: 1px solid #ddd; padding: 10px 0;">
            <p><strong>${item.product_name}</strong></p>
            <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)} | Total: $${item.total.toFixed(2)}</p>
          </div>
        `).join('')}
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">Order Summary</h2>
        <p>Subtotal: $${orderData.subtotal.toFixed(2)}</p>
        <p>Tax (10%): $${orderData.tax.toFixed(2)}</p>
        <p>Shipping: ${orderData.shipping_cost === 0 ? 'FREE' : `$${orderData.shipping_cost.toFixed(2)}`}</p>
        <p><strong>Total: $${orderData.total.toFixed(2)}</strong></p>
      </div>

      <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h2 style="color: #333; margin-top: 0;">What's Next?</h2>
        <p>1. We'll process your order and prepare it for shipment.</p>
        <p>2. You'll receive tracking information once your order ships.</p>
        <p>3. Your order will be delivered to your specified address.</p>
        ${orderData.payment_method === 'cod' ? '<p>4. Please have the exact amount ready for cash on delivery.</p>' : ''}
      </div>

      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666;">If you have any questions, please contact us.</p>
        <p style="color: #666;">Thank you for choosing our store!</p>
      </div>
    </div>
  `;

  return await sendEmail(
    orderData.shipping_address.email,
    `Order Confirmation: ${orderData.order_number}`,
    emailHtml
  );
};
