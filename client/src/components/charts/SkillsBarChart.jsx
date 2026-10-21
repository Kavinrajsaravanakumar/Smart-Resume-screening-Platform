import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-xl px-3 py-2 shadow-soft-lg">
        <p className="text-sm font-semibold text-surface-900 dark:text-white mb-1">{label}</p>
        <p className="text-xs text-surface-500 dark:text-surface-400">{payload[0].value} candidates</p>
      </div>
    );
  }
  return null;
};

export default function SkillsBarChart({ data, color = '#14b8a6' }) {
  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#64748b' }}
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || color} fillOpacity={0.8 + (index * 0.02)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
