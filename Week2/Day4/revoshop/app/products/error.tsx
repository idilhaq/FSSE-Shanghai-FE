'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
            <p className="font-semibold text-red-700">{error.message}</p>
            <p className="text-sm text-red-600 mt-1">Unable to load products. Please try again.</p>
            <button onClick={() => reset()} className="mt-3 px-4 py-2 bg-gray-800 text-white rounded">
                Try again
            </button>
        </div>
    );
}