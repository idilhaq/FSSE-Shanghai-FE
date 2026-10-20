import Link from "next/link";

export default function Page() {
  return (
    <div>
      <p data-testid="home-page-title">Home</p>
      <Link href="/about">About</Link>
    </div>
  );
}
