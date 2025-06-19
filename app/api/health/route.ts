import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    console.log('Health check: Testing database connection...');
    
    // Test database connection with a simple query
    const { data, error } = await supabase
      .from('carbon_credits')
      .select('count')
      .limit(1);

    if (error) {
      console.error('Health check: Database error:', error);
      return NextResponse.json(
        { 
          status: 'unhealthy', 
          database: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }

    console.log('Health check: Database connection successful');
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Health check: Unexpected error:', error);
    return NextResponse.json(
      { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}