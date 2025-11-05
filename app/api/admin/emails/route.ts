import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// Force dynamic rendering (API routes with headers/request should be dynamic)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you should improve this)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_TOKEN || 'celer-admin-2024';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Use admin client if available (bypasses RLS), otherwise fall back to regular client
    const adminClient = supabaseAdmin || supabase;

    // Check if Supabase is configured
    if (!adminClient) {
      console.log('[Admin] Supabase not configured, returning empty array');
      return NextResponse.json([]);
    }

    // Fetch emails from Supabase
    const { data: emails, error } = await adminClient
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin] Supabase error:', error);
      return NextResponse.json(
        { error: "Failed to fetch emails" },
        { status: 500 }
      );
    }

    // Transform data to match expected format
    const formattedEmails = emails?.map(email => ({
      email: email.email,
      timestamp: email.created_at,
      ip: email.ip_address
    })) || [];

    return NextResponse.json(formattedEmails);
  } catch (error) {
    console.error('[Admin] Error fetching emails:', error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
