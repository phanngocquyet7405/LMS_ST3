export default function AuthContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-background
        p-4
        relative
        overflow-hidden
      "
    >
      {/* Background pattern */}
      <div
        className="
          absolute
          inset-0
          opacity-[0.03]
          bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]
        "
      />

      {/* Gradient blur */}
      <div
        className="
          absolute
          w-150
          h-150
          bg-primary/10
          rounded-full
          blur-3xl
          -top-20
          -left-20
        "
      />

      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}
