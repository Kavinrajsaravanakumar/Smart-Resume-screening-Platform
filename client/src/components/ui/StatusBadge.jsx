import { getStatusConfig } from '../../utils/formatters.js';

export default function StatusBadge({ status, size = 'sm' }) {
  const config = getStatusConfig(status);

  const sizeMap = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${config.color} ${sizeMap[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
