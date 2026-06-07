export default function StatCard({ title, value, detail, icon: Icon }) {
  return (
    <article className="stat-card">
      <div>
        <p>{title}</p>
        <strong>{value}</strong>
        {detail && <span>{detail}</span>}
      </div>
      {Icon && <Icon size={26} />}
    </article>
  );
}
