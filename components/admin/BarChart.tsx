interface BarChartProps {
  data: { label: string; value: number }[];
  formatValue?: (v: number) => string;
}

export default function BarChart({ data, formatValue }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const showEveryNth = data.length > 10 ? Math.ceil(data.length / 8) : 1;

  return (
    <div className="w-full">
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
            <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-white/70 whitespace-nowrap">
              {formatValue ? formatValue(d.value) : d.value}
            </div>
            <div
              className="w-full rounded-t bg-fuchsia-500/70 group-hover:bg-fuchsia-400 transition-colors"
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-white/35 font-mono truncate">
            {i % showEveryNth === 0 ? d.label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
