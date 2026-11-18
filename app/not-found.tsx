import Link from "next/link";
export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center pt-24">
      <p className="eyebrow text-accent">404</p>
      <h1 className="display mt-4 text-6xl md:text-8xl">Out of bounds.</h1>
      <Link href="/" className="eyebrow mt-8 border-b border-current pb-1 self-start hover:text-accent">Back to the first tee</Link>
    </section>
  );
}
