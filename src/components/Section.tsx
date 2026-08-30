export function Section({
  kicker,
  title,
  sub,
  children,
  className = "",
}: {
  kicker?: string;
  title?: string;
  sub?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-[1240px] px-6 py-20 ${className}`}>
      {(kicker || title) && (
        <header className="mb-10">
          {kicker && <div className="kicker">{kicker}</div>}
          {title && (
            <h2 className="display text-[38px] md:text-[46px] mt-2.5 th">
              {title}
            </h2>
          )}
          {sub && (
            <p className="th mt-3 text-[14px] text-muted max-w-[560px] leading-relaxed">
              {sub}
            </p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
