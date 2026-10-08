'use client'

export default function App() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const secret = process.env.API_SECRET_KEY;

  return (
    <div className="font-sans flex gap-4 p-4 text-sm">
      <div className="flex-1">
        {/* Env-var panel */}
        <div className="border rounded-lg p-3 mb-3">
          <p className="text-xs text-gray-500">NEXT_PUBLIC_API_BASE_URL</p>
          <p className="font-mono text-green-700">{base ?? 'undefined'}</p>
          <p className="text-xs text-gray-500 mt-2">API_SECRET_KEY</p>
          <p className="font-mono text-red-700">{secret ?? 'undefined (server only)'}</p>
        </div>
      </div>
    </div>
  );
}