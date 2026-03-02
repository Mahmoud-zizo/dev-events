export default function Loading() {
  return (
    <div className="min-h-screen  flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-zinc-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <p className="text-sm font-mono tracking-widest text-zinc-400 uppercase animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
