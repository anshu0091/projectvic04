import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        carbon_credits (
          name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch transactions', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
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
    const { userId, creditId, type, quantity, price } = body;

    if (!userId || !creditId || !type || !quantity || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const totalAmount = quantity * price;

    // Start a transaction
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        credit_id: creditId,
        type,
        quantity,
        price,
        total_amount: totalAmount,
        status: 'completed'
      }])
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction', details: transactionError.message },
        { status: 500 }
      );
    }

    // Update user credits based on transaction type
    if (type === 'buy') {
      // Add or update user credits
      const { error: upsertError } = await supabase
        .from('user_carbon_credits')
        .upsert({
          user_id: userId,
          credit_id: creditId,
          quantity,
          purchase_price: price
        }, {
          onConflict: 'user_id,credit_id'
        });

      if (upsertError) {
        console.error('Error updating user credits:', upsertError);
        return NextResponse.json(
          { error: 'Failed to update user credits', details: upsertError.message },
          { status: 500 }
        );
      }

      // Reduce available quantity in carbon_credits table
      const { error: updateError } = await supabase
        .rpc('decrement_credit_quantity', {
          credit_id: creditId,
          decrement_amount: quantity
        });

      if (updateError) {
        console.error('Error updating carbon credit quantity:', updateError);
      }
    }

    return NextResponse.json({ data: transaction }, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}