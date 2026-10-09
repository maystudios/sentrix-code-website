import { Pictogram } from "@/components/brand/Pictogram";

// Temporary placeholder until the real home page is built.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 bg-sentrix-deep px-6 text-center text-white">
      <Pictogram chevronColor="var(--color-sentrix-accent)" xColor="#ffffff" className="w-32" />
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">Sentrix Code</h1>
        <p className="text-white/70">Website in Vorbereitung.</p>
      </div>
    </main>
  );
}
