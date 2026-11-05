import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// Default fallback settings if database table is not yet provisioned
const DEFAULT_SETTINGS = {
  usd_to_pkr_rate: 280.0,
  default_currency: 'USD',
  updated_at: new Date().toISOString()
};

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value')
      .eq('key', 'currency')
      .single();

    if (error || !data) {
      // Table doesn't exist yet or row missing; return graceful fallback
      return NextResponse.json({
        success: true,
        settings: DEFAULT_SETTINGS,
        source: 'default_fallback'
      });
    }

    const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

    return NextResponse.json({
      success: true,
      settings: {
        usd_to_pkr_rate: Number(value.usd_to_pkr_rate) || DEFAULT_SETTINGS.usd_to_pkr_rate,
        default_currency: value.default_currency || DEFAULT_SETTINGS.default_currency,
        updated_at: value.updated_at || DEFAULT_SETTINGS.updated_at
      },
      source: 'database'
    });
  } catch (err: any) {
    console.warn('Could not read store_settings from Supabase, using fallback:', err?.message || err);
    return NextResponse.json({
      success: true,
      settings: DEFAULT_SETTINGS,
      source: 'default_fallback'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rate = parseFloat(body.usd_to_pkr_rate);

    if (isNaN(rate) || rate <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid positive exchange rate is required.' },
        { status: 400 }
      );
    }

    const payload = {
      usd_to_pkr_rate: rate,
      default_currency: body.default_currency || 'USD',
      updated_at: new Date().toISOString()
    };

    // Try upserting into store_settings table
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        key: 'currency',
        value: payload,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      console.warn('Supabase upsert warning on store_settings:', error.message);
      // Return success with payload so client can still use it (localStorage cache)
      return NextResponse.json({
        success: true,
        settings: payload,
        warning: 'Saved locally, database table update had error: ' + error.message
      });
    }

    return NextResponse.json({
      success: true,
      settings: payload
    });
  } catch (err: any) {
    console.error('Error in settings API:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings.' },
      { status: 500 }
    );
  }
}
