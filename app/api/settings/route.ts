import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { DEFAULT_STORE_SETTINGS, type StoreSettings } from '@/stores/settingsStore';
import fs from 'fs';
import path from 'path';

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'data', 'store_settings.json');

async function readLocalSettings(): Promise<StoreSettings> {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const content = await fs.promises.readFile(SETTINGS_FILE_PATH, 'utf-8');
      return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(content) };
    }
  } catch (err) {
    console.warn('Could not read local settings file:', err);
  }
  return DEFAULT_STORE_SETTINGS;
}

async function writeLocalSettings(settings: StoreSettings): Promise<void> {
  try {
    const dir = path.dirname(SETTINGS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not write local settings file:', err);
  }
}

export async function GET() {
  try {
    // 1. Attempt to query Supabase
    const { data, error } = await supabase
      .from('store_settings')
      .select('key, value')
      .eq('key', 'general')
      .single();

    if (!error && data?.value) {
      const value = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;
      const merged: StoreSettings = {
        ...DEFAULT_STORE_SETTINGS,
        ...value,
        usdToPkrRate: Number(value.usdToPkrRate || value.usd_to_pkr_rate || DEFAULT_STORE_SETTINGS.usdToPkrRate),
        freeShippingThreshold: Number(value.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold),
        standardShippingFee: Number(value.standardShippingFee ?? DEFAULT_STORE_SETTINGS.standardShippingFee),
      };

      // Also ensure local backup is updated
      writeLocalSettings(merged).catch(() => {});

      return NextResponse.json({
        success: true,
        settings: {
          ...merged,
          usd_to_pkr_rate: merged.usdToPkrRate,
        },
        source: 'database'
      });
    }

    // 2. Read from persisted server file
    const local = await readLocalSettings();
    return NextResponse.json({
      success: true,
      settings: {
        ...local,
        usd_to_pkr_rate: local.usdToPkrRate,
      },
      source: 'server_file'
    });
  } catch (err: any) {
    console.warn('Could not read store_settings, falling back to local file:', err?.message || err);
    const local = await readLocalSettings();
    return NextResponse.json({
      success: true,
      settings: {
        ...local,
        usd_to_pkr_rate: local.usdToPkrRate,
      },
      source: 'server_file'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Normalize and sanitize all fields
    const updatedSettings: StoreSettings = {
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

    // 1. Immediately persist to server-side JSON file
    await writeLocalSettings(updatedSettings);

    // 2. Also attempt Supabase upsert
    try {
      await supabase
        .from('store_settings')
        .upsert({
          key: 'general',
          value: updatedSettings,
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

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
    } catch (dbErr: any) {
      console.warn('Supabase store_settings sync notice (using persistent server storage):', dbErr?.message || dbErr);
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...updatedSettings,
        usd_to_pkr_rate: updatedSettings.usdToPkrRate,
      }
    });
  } catch (err: any) {
    console.error('Error in settings API:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save settings.' },
      { status: 500 }
    );
  }
}
