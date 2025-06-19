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

    console.log('API: Fetching carbon credits with params:', {
      category,
      minPrice,
      maxPrice,
      location,
      vintage
    });

    // Build query with filters
    let query = supabase
      .from('carbon_credits')
      .select('*')
      .eq('status', 'available')
      .gt('quantity', 0);

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (location) {
      query = query.eq('location', location);
    }
    if (vintage) {
      query = query.eq('vintage', vintage);
    }

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database error', details: error.message },
        { status: 500 }
      );
    }

    console.log('API: Successfully fetched', data?.length || 0, 'carbon credits');
    return NextResponse.json({ data: data || [] });

  } catch (error) {
    console.error('API: Unexpected error:', error);
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