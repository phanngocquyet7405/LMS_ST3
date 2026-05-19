import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function AuthButton({ children, loading, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={loading}
      className="
        w-full
        py-3
        rounded-xl
        bg-primary
        text-on-primary
        font-semibold
        transition-all
        hover:opacity-90
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
      "
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
