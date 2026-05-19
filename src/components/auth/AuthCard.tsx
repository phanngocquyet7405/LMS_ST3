export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        w-full
        max-w-md
        rounded-2xl
        bg-surface-container-lowest
        border
        border-outline-variant
        p-8
        shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.05)]
        backdrop-blur-sm
      "
    >
      {children}
    </div>
  );
}
