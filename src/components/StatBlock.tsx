interface StatBlockProps {
  number: string;
  label: string;
}

export function StatBlock({ number, label }: StatBlockProps) {
  return (
    <div className="surface-dark p-6 rounded-lg border border-[rgba(255,255,255,0.1)] flex flex-col justify-center items-center text-center">
      <span className="font-heading font-extrabold text-4xl mb-2 text-accent">
        {number}
      </span>
      <span className="text-sm font-medium text-[rgba(255,255,255,0.7)]">
        {label}
      </span>
    </div>
  );
}
