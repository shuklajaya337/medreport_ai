async function getHealthData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/health`, { cache: "no-store" });
  return res.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-black text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">System Health Check</h1>
      <div className="w-full max-w-md rounded-2xl border border-neutral-300 dark:border-neutral-700 p-6 space-y-3">
        <div className="flex justify-between">
          <span className="text-neutral-500">Status</span>
          <span className={`font-semibold ${data.status === "ok" ? "text-green-500" : "text-red-500"}`}>
            {data.status.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">App</span>
          <span>{data.app}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Gemini API Key Configured</span>
          <span>{data.geminiConfigured ? "✅ Yes" : "❌ No"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Checked At</span>
          <span className="text-sm">{new Date(data.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}