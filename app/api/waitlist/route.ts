import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

interface EmailEntry {
  email: string;
  timestamp: string;
  ip: string;
}

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

    // Save to file
    const dataDir = path.join(process.cwd(), 'data');
    const emailsFile = path.join(dataDir, 'waitlist-emails.json');

    // Ensure data directory exists
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }

    // Read existing emails
    let emails: EmailEntry[] = [];
    try {
      if (existsSync(emailsFile)) {
        const fileContent = await readFile(emailsFile, 'utf8');
        emails = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error('Error reading emails file:', error);
    }

    // Add new email with timestamp
    const newEntry: EmailEntry = {
      email,
      timestamp: new Date().toISOString(),
      ip: request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    };

    // Check if email already exists
    const emailExists = emails.some(entry => entry.email === email);
    if (!emailExists) {
      emails.push(newEntry);
      
      // Save updated emails
      await writeFile(emailsFile, JSON.stringify(emails, null, 2));
      console.log(`[Waitlist] Email saved to file: ${email}`);
    } else {
      console.log(`[Waitlist] Email already exists: ${email}`);
    }

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
