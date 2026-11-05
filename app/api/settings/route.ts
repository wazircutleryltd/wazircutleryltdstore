import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_STORE_SETTINGS } from '@/stores/settingsStore';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value')
      .eq('key', 'general')
      .single();

    if (error || !data) {
      // Check legacy 'currency' key if general doesn't exist yet
      const { data: currData } = await supabase
        .from('store_settings')
        .select('key, value')
        .eq('key', 'currency')
        .single();

      const rate = currData?.value?.usd_to_pkr_rate 
        ? Number(currData.value.usd_to_pkr_rate) 
        : DEFAULT_STORE_SETTINGS.usdToPkrRate;

      return NextResponse.json({
        success: true,
        settings: {
          ...DEFAULT_STORE_SETTINGS,
          usdToPkrRate: rate,
          usd_to_pkr_rate: rate // backward-compatible alias
        },
        source: 'fallback'
      });
    }

    const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
    const merged = {
      ...DEFAULT_STORE_SETTINGS,
      ...value,
      usdToPkrRate: Number(value.usdToPkrRate || value.usd_to_pkr_rate || DEFAULT_STORE_SETTINGS.usdToPkrRate),
      freeShippingThreshold: Number(value.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold),
      standardShippingFee: Number(value.standardShippingFee ?? DEFAULT_STORE_SETTINGS.standardShippingFee),
      // backward-compatible alias for legacy consumers
      usd_to_pkr_rate: Number(value.usdToPkrRate || value.usd_to_pkr_rate || DEFAULT_STORE_SETTINGS.usdToPkrRate)
    };

    return NextResponse.json({
      success: true,
      settings: merged,
      source: 'database'
    });
  } catch (err: any) {
    console.warn('Could not read store_settings from Supabase, using fallback:', err?.message || err);
    return NextResponse.json({
      success: true,
      settings: {
        ...DEFAULT_STORE_SETTINGS,
        usd_to_pkr_rate: DEFAULT_STORE_SETTINGS.usdToPkrRate
      },
      source: 'fallback'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Normalize and sanitize all fields
    const updatedSettings = {
      ...DEFAULT_STORE_SETTINGS,
      ...body,
      usdToPkrRate: Number(body.usdToPkrRate || body.usd_to_pkr_rate || DEFAULT_STORE_SETTINGS.usdToPkrRate),
      freeShippingThreshold: Number(body.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold),
      standardShippingFee: Number(body.standardShippingFee ?? DEFAULT_STORE_SETTINGS.standardShippingFee),
      enableCurrencySwitcher: body.enableCurrencySwitcher !== false,
      allowGptBot: body.allowGptBot !== false,
      allowClaudeBot: body.allowClaudeBot !== false,
      allowPerplexityBot: body.allowPerplexityBot !== false,
      allowGoogleExtended: body.allowGoogleExtended !== false,
      updated_at: new Date().toISOString()
    };

    // Upsert the full settings into key 'general'
    const { error: generalError } = await supabase
      .from('store_settings')
      .upsert({
        key: 'general',
        value: updatedSettings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    // Also upsert key 'currency' for any direct currency queries
    await supabase
      .from('store_settings')
      .upsert({
        key: 'currency',
        value: {
          usd_to_pkr_rate: updatedSettings.usdToPkrRate,
          default_currency: updatedSettings.currency || 'USD',
          updated_at: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (generalError) {
      console.warn('Supabase store_settings upsert warning:', generalError.message);
      return NextResponse.json({
        success: true,
        settings: updatedSettings,
        warning: 'Saved locally, database error: ' + generalError.message
      });
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (err: any) {
    console.error('Error in settings API:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings.' },
      { status: 500 }
    );
  }
}
