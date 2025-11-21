import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

// Force dynamic rendering (API routes with request data should be dynamic)
export const dynamic = 'force-dynamic';

interface WaitlistPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  organizationName?: string;
  organizationSize?: string;
  teamChallenges?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistPayload = await request.json();
    const {
      email,
      firstName,
      lastName,
      phone,
      organizationName,
      organizationSize,
      teamChallenges,
    } = body;

    if (!email || !email.includes("@") || !firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json(
        { error: "Please provide a first name, last name, and valid email address" },
        { status: 400 }
      );
    }

    // Log to console
    console.log(`[Waitlist] New signup: ${email}`);

    // Use admin client (service role) to bypass RLS, or fall back to regular client
    // Service role key bypasses RLS which is appropriate for server-side API routes
    const client = supabaseAdmin || supabase;

    if (!client) {
      console.log(`[Waitlist] Supabase not configured, logging email: ${email}`);
      return NextResponse.json(
        { success: true, message: "Successfully joined the waitlist! (Supabase setup pending)" },
        { status: 200 }
      );
    }

    // Get client IP
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const payload = {
      email: email.toLowerCase().trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone?.trim() || null,
      organization_name: organizationName?.trim() || null,
      organization_size: organizationSize?.trim() || null,
      team_challenges: teamChallenges?.trim() || null,
      ip_address: ipAddress,
    };

    // Try to insert email into Supabase
    // The UNIQUE constraint on email will handle duplicates
    const { data, error } = await client
      .from('waitlist')
      .insert([payload])
      .select();

    if (error) {
      console.error('[Waitlist] Supabase error:', error);
      console.error('[Waitlist] Error code:', error.code);
      console.error('[Waitlist] Error message:', error.message);
      console.error('[Waitlist] Error details:', error.details);
      
      // Check if it's a duplicate email error
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return NextResponse.json(
          { success: true, message: "You're already on the waitlist!" },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to save email: ${error.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    console.log(`[Waitlist] Email saved to Supabase: ${email}`);
    return NextResponse.json(
      { success: true, message: "Successfully joined the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Waitlist] Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
