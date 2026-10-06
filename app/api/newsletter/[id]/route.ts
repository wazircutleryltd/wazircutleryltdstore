import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'Subscriber ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting subscriber:', error);
      return NextResponse.json({ error: 'Failed to delete subscriber' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
