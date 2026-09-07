export function Section({
  kicker,
  title,
  sub,
  children,
  className = "",
  as = "h2",
}: {
  kicker?: string;
  title?: string;
  sub?: string;
  children?: React.ReactNode;
  className?: string;
  /** ใช้ "h1" เมื่อหัวเรื่องนี้คือหัวเรื่องหลักของหน้า (ทุกหน้าต้องมี h1 เดียว) */
  as?: "h1" | "h2";
}) {
  const Heading = as;
  return (
    <section className={`mx-auto max-w-[1240px] px-6 py-20 ${className}`}>
      {(kicker || title) && (
        <header className="mb-10">
          {kicker && <div className="kicker">{kicker}</div>}
          {title && (
            <Heading className={`mt-2.5 ${as === "h1" ? "t-h1" : "t-h2"}`}>
              {title}
            </Heading>
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
