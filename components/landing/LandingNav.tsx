import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <span className="font-serif text-base font-medium text-ink">
          Tanzania Business OS
        </span>
        <Link href="/login">
          <Button variant="secondary" className="px-4 py-2 text-sm">
            Launch the app
          </Button>
        </Link>
      </div>
    </header>
  );
}
