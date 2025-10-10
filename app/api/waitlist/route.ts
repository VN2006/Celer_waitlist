import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // Log to console
    console.log(`[Waitlist] New signup: ${email}`);

    // Get client IP
    const ipAddress = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Check if email already exists in Supabase
    const { data: existingEmail } = await supabase
      .from('waitlist')
      .select('email')
      .eq('email', email)
      .single();

    if (existingEmail) {
      console.log(`[Waitlist] Email already exists: ${email}`);
      return NextResponse.json(
        { success: true, message: "You're already on the waitlist!" },
        { status: 200 }
      );
    }

    // Insert new email into Supabase
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email: email,
          ip_address: ipAddress
        }
      ])
      .select();

    if (error) {
      console.error('[Waitlist] Supabase error:', error);
      return NextResponse.json(
        { error: "Failed to save email. Please try again." },
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
