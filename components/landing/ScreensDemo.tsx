import { Reveal } from "@/components/landing/Reveal";
import { BrowserFrame, PhoneFrame } from "@/components/landing/DeviceFrame";
import { MockDashboard } from "@/components/landing/MockDashboard";
import { MockLedger } from "@/components/landing/MockLedger";

export function ScreensDemo() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Screens
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium text-ink">
          The dashboard, and the ledger on a phone.
        </h2>
        <p className="mt-4 max-w-xl text-ink-soft">
          Built mobile-first: a shop owner runs this from behind the counter, on
          whatever phone they already have.
        </p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:grid-cols-5 lg:gap-8">
        <Reveal className="lg:col-span-3">
          <BrowserFrame url="tanzaniabusinessos.app/app/dashboard">
            <MockDashboard />
          </BrowserFrame>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <PhoneFrame>
            <MockLedger />
          </PhoneFrame>
        </Reveal>
      </div>
    </section>
  );
}
