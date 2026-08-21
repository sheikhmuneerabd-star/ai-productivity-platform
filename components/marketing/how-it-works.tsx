import { MessageSquare, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "1. Tell it what you need",
    description:
      "Type your request in plain language — write an email, fix grammar, build a resume, generate an image.",
  },
  {
    icon: Wand2,
    title: "2. Assistant picks the right tool",
    description:
      "Behind the scenes, your request is routed to the matching skill — no need to hunt through menus.",
  },
  {
    icon: Download,
    title: "3. Get your result",
    description:
      "Review, edit, and export — every result is saved to one shared history across all 18 tools.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-graphite-950 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-graphite-500">
            How it works
          </p>
          <h2 className="mt-2 font-display text-2xl font-medium text-graphite-100 lg:text-3xl">
            It feels like one assistant — because it is
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="rounded-lg border border-graphite-800 bg-graphite-900 p-6"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-500/10">
                <step.icon className="h-4 w-4 text-amber-500" strokeWidth={1.75} />
              </div>
              <p className="mt-4 text-sm font-medium text-graphite-100">{step.title}</p>
              <p className="mt-1.5 text-sm text-graphite-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}