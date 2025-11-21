"use client";

import { useState, useEffect } from "react";

interface EmailEntry {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  organizationName?: string | null;
  organizationSize?: string | null;
  teamChallenges?: string | null;
  timestamp: string;
  ip: string;
}

export default function AdminPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    // Check if token is stored in localStorage
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchEmails(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput) {
      localStorage.setItem('admin_token', tokenInput);
      setToken(tokenInput);
      setIsAuthenticated(true);
      fetchEmails(tokenInput);
    }
  };

  const fetchEmails = async (authToken?: string) => {
    const authTokenToUse = authToken || token;
    if (!authTokenToUse) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/emails', {
        headers: {
          'Authorization': `Bearer ${authTokenToUse}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
        setError("");
      } else if (response.status === 401) {
        setError('Invalid token. Please check your admin token.');
        setIsAuthenticated(false);
        localStorage.removeItem('admin_token');
      } else {
        setError('Failed to fetch emails');
      }
    } catch (err) {
      setError('Error fetching emails');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const headers = [
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Organization Name",
      "Organization Size",
      "Team Challenges",
      "Timestamp",
      "IP Address",
    ];

    const csvContent = [
      headers.join(","),
      ...emails.map((entry) =>
        [
          entry.firstName || "",
          entry.lastName || "",
          entry.email,
          entry.phone || "",
          entry.organizationName || "",
          entry.organizationSize || "",
          entry.teamChallenges?.replace(/(\r\n|\n|\r)/gm, " ") || "",
          entry.timestamp,
          entry.ip || "",
        ]
          .map((value) => `"${value.replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `celer-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-textPrimary flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Celer Waitlist Admin</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="token" className="block text-sm font-medium text-textMuted mb-2">
                  Admin Token
                </label>
                <input
                  id="token"
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Enter your admin token"
                  required
                  className="w-full px-4 py-3 bg-background/50 border border-primary/30 rounded-lg text-textPrimary placeholder-textMuted/50 focus:outline-none focus:border-primary transition-colors"
                />
                <p className="mt-2 text-xs text-textMuted">
                  Check your .env.local file for ADMIN_TOKEN
                </p>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all"
              >
                Login
              </button>
            </form>
            {error && (
              <p className="mt-4 text-sm text-red-400 text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-8">Loading emails...</div>;

  return (
    <div className="min-h-screen bg-background text-textPrimary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Celer Waitlist Admin</h1>
          <div className="flex gap-4">
            <button
              onClick={() => fetchEmails()}
              className="px-4 py-2 bg-primary/20 text-textPrimary rounded-lg hover:bg-primary/30 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={downloadCSV}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Download CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="bg-primary/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-textMuted">
            Total signups: <span className="font-bold text-primary">{emails.length}</span>
          </p>
        </div>

        <div className="bg-background/50 border border-primary/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-primary/10">
                <tr>
                  {["Name", "Email", "Phone", "Organization", "Org Size", "Team Challenges", "Date & Time", "IP Address"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-6 py-3 text-xs font-medium text-textMuted uppercase tracking-wider"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {emails.map((entry, index) => (
                  <tr key={index} className="hover:bg-primary/5 align-top">
                    <td className="px-6 py-4 text-sm text-textPrimary">
                      <p className="font-semibold">{`${entry.firstName} ${entry.lastName}`.trim()}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      <p>{entry.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      {entry.phone || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      {entry.organizationName || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted">
                      {entry.organizationSize || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted max-w-xs">
                      {entry.teamChallenges ? (
                        <p className="whitespace-pre-line">{entry.teamChallenges}</p>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-textMuted whitespace-nowrap">
                      {entry.ip || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {emails.length === 0 && (
          <div className="text-center py-12">
            <p className="text-textMuted text-lg">No emails collected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
