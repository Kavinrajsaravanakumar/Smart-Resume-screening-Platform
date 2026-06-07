export default function StatusBadge({ score }) {
  const value = Number(score || 0);
  const tone = value >= 80 ? 'strong' : value >= 50 ? 'moderate' : 'low';
  return <span className={`score-badge ${tone}`}>{value}% match</span>;
}
