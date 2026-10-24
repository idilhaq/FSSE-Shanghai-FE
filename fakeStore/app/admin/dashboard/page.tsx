export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // reads per-request data must be dynamic
    return <main className="p-8"><h1>My Dashboard</h1></main>;
}