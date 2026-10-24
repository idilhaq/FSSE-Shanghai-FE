import type { Metadata } from "next";
import { getServerEnv, publicEnv } from "./env";

export const metadata: Metadata = {
  title: "Environment Demo | RevoBuild",
  description:
    "Demonstrates how local, test, and production environment variables resolve in Next.js.",
};

// With Cache Components enabled, this page is dynamic (rendered per request)
// by default since it reads runtime env via getServerEnv(), so values always
// reflect the active environment.
const ENV_STYLES: Record<string, string> = {
  local: "bg-emerald-500",
  test: "bg-amber-500",
  production: "bg-rose-500",
  default: "bg-zinc-500",
};

export default function EnvironmentPage() {
  const server = getServerEnv();
  const badge = ENV_STYLES[publicEnv.envName] ?? ENV_STYLES.default;

  const publicRows = [
    { key: "NEXT_PUBLIC_APP_NAME", value: publicEnv.appName },
    { key: "NEXT_PUBLIC_ENV_NAME", value: publicEnv.envName },
    { key: "NEXT_PUBLIC_API_URL", value: publicEnv.apiUrl },
  ];

  const serverRows = [
    { key: "NODE_ENV", value: server.nodeEnv },
    { key: "APP_SECRET (loaded?)", value: server.secretLoaded ? "yes" : "no" },
    { key: "APP_SECRET (masked)", value: server.secretPreview },
  ];

  return (
    <main className="flex flex-1 w-full items-center justify-center bg-zinc-50 p-6 font-sans dark:bg-black">
      <div className="w-full max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            {publicEnv.appName} environment
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium text-white ${badge}`}
          >
            {publicEnv.envName}
          </span>
        </div>

        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          The same page resolves to different values depending on which{" "}
          <code className="rounded bg-black/[.06] px-1.5 py-0.5 font-mono text-[0.9em] dark:bg-white/[.08]">
            .env
          </code>{" "}
          file Next.js loads for the active environment.
        </p>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-black dark:text-zinc-50">
            Public variables
            <span className="ml-2 text-sm font-normal text-zinc-500">
              (visible in the browser)
            </span>
          </h2>
          <EnvTable rows={publicRows} />
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-lg font-medium text-black dark:text-zinc-50">
            Server-only variables
            <span className="ml-2 text-sm font-normal text-zinc-500">
              (never sent to the browser)
            </span>
          </h2>
          <EnvTable rows={serverRows} />
        </section>

        <section className="rounded-lg border border-black/[.08] bg-white p-5 text-sm leading-6 text-zinc-600 dark:border-white/[.145] dark:bg-zinc-950 dark:text-zinc-400">
          <h2 className="mb-2 text-base font-medium text-black dark:text-zinc-50">
            How to switch environments
          </h2>
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong>Local:</strong> <code>npm run dev</code> — loads{" "}
              <code>.env.local</code> over <code>.env</code>.
            </li>
            <li>
              <strong>Test:</strong> <code>npm run dev:test</code> or{" "}
              <code>npm run build:test &amp;&amp; npm run start:test</code> —
              loads <code>.env.test</code>.
            </li>
            <li>
              <strong>Production:</strong> <code>npm run build</code> then{" "}
              <code>npm run start</code> — loads <code>.env.production</code>.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}

function EnvTable({ rows }: { rows: { key: string; value: string }[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/[.08] dark:border-white/[.145]">
      <table className="w-full text-left text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.key}
              className={
                i % 2 === 0
                  ? "bg-white dark:bg-zinc-950"
                  : "bg-zinc-50 dark:bg-zinc-900"
              }
            >
              <th className="w-1/2 px-4 py-3 font-mono font-normal text-zinc-500">
                {row.key}
              </th>
              <td className="px-4 py-3 font-mono text-black dark:text-zinc-50">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
