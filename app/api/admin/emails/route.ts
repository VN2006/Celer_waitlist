import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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

    const emailsFile = path.join(process.cwd(), 'data', 'waitlist-emails.json');
    
    if (!existsSync(emailsFile)) {
      return NextResponse.json([]);
    }

    const fileContent = await readFile(emailsFile, 'utf8');
    const emails = JSON.parse(fileContent);

    // Sort by timestamp (newest first)
    emails.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(emails);
  } catch (error) {
    console.error('[Admin] Error fetching emails:', error);
    return NextResponse.json(
      { error: "Failed to fetch emails" },
      { status: 500 }
    );
  }
}
