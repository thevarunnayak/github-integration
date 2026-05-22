import { Bell, Search } from "lucide-react";

export function TopNavbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 px-6">
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2">
        <Search className="h-4 w-4 text-zinc-500" />

        <input
          placeholder="Search repositories..."
          className="bg-transparent text-sm outline-none placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl border border-white/10 bg-white/5 p-2 text-zinc-400 transition hover:text-white">
          <Bell className="h-4 w-4" />
        </button>

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-semibold text-black">
          VN
        </div>
      </div>
    </header>
  );
}