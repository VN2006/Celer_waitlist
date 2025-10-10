"use client";

import { useState, useEffect } from "react";

interface EmailEntry {
  email: string;
  timestamp: string;
  ip: string;
}

export default function AdminPage() {
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await fetch('/api/admin/emails');
      if (response.ok) {
        const data = await response.json();
        setEmails(data);
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
    const csvContent = [
      'Email,Timestamp,IP Address',
      ...emails.map(entry => `${entry.email},${entry.timestamp},${entry.ip}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `celer-waitlist-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-8">Loading emails...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-background text-textPrimary p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Celer Waitlist Admin</h1>
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Download CSV
          </button>
        </div>

        <div className="bg-primary/10 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          <p className="text-textMuted">Total signups: <span className="font-bold text-primary">{emails.length}</span></p>
        </div>

        <div className="bg-background/50 border border-primary/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-textMuted uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10">
                {emails.map((entry, index) => (
                  <tr key={index} className="hover:bg-primary/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
                      {entry.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-textMuted">
                      {entry.ip}
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
