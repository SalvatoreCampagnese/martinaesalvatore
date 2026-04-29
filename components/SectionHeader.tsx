"use client";

export default function SectionHeader({
  eyebrow,
  title,
  serif = false
}: {
  eyebrow?: string;
  title: string;
  serif?: boolean;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      {eyebrow && (
        <span className="font-sans text-[11px] uppercase tracking-[0.45em] text-bordeaux/70">
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 ${
          serif ? "font-serif" : "font-script"
        } text-5xl text-bordeaux sm:text-6xl`}
      >
        {title}
      </h2>
      <div className="ornament mt-6" />
    </div>
  );
}
