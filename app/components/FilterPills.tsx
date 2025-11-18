'use client';

interface FilterPillsProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  allLabel?: string;
}

export default function FilterPills({ options, value, onChange, allLabel = 'Todas' }: FilterPillsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
          value === 'all'
            ? 'bg-primary text-white'
            : 'border border-border text-primary-light hover:text-primary'
        }`}
      >
        {allLabel}
      </button>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-colors ${
            value === option.value
              ? 'bg-primary text-white'
              : 'border border-border text-primary-light hover:text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
