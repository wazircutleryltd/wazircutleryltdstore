import { NextResponse, type NextRequest } from "next/server";
import { sendContactNotification } from "@/lib/email-service";
import { supabase } from "@/lib/supabase";

const RECAPTCHA_SCORE_THRESHOLD = 0.5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recaptchaToken, ...formData } = body;

    // 1. Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("RECAPTCHA_SECRET_KEY is not set.");
      return NextResponse.json({ success: false, message: "Server configuration error." }, { status: 500 });
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
    
    const recaptchaRes = await fetch(verificationUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success || recaptchaData.score < RECAPTCHA_SCORE_THRESHOLD) {
      return NextResponse.json({ success: false, message: "reCAPTCHA verification failed.", details: recaptchaData['error-codes'] }, { status: 400 });
    }

    // 2. Prepare and Insert into Supabase
    const submissionData = {
      ...formData,
      product_quantity: formData.product_quantity ? parseInt(formData.product_quantity, 10) : undefined,
      status: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: contactData, error: supabaseError } = await supabase
      .from('contact_submissions')
      .insert([submissionData])
      .select()
      .single();

    if (supabaseError) {
      console.error("Supabase insert error:", supabaseError);
      return NextResponse.json({ success: false, message: "Database error.", details: supabaseError.message }, { status: 500 });
    }

    // 3. Send email
    await sendContactNotification(contactData);

    return NextResponse.json({ success: true, message: "Form submitted successfully.", data: contactData });
  } catch (error) {
    console.error("Error in contact API:", error);
    return NextResponse.json({ success: false, message: "Failed to process contact form." }, { status: 500 });
  }
}
