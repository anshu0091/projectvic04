import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use anon key for client-side operations
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const vintage = searchParams.get('vintage');

    // Use the database function for better performance and consistency
    const { data, error } = await supabase.rpc('get_available_credits', {
      filter_category: category,
      filter_min_price: minPrice ? parseFloat(minPrice) : null,
      filter_max_price: maxPrice ? parseFloat(maxPrice) : null,
      filter_location: location,
      filter_vintage: vintage
    });

    if (error) {
      console.error('Error fetching carbon credits:', error);
      return NextResponse.json(
        { error: 'Failed to fetch carbon credits', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: data || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('carbon_credits')
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error('Error creating carbon credit:', error);
      return NextResponse.json(
        { error: 'Failed to create carbon credit', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}