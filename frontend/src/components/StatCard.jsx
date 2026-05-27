export const StatCard = ({ label, value, trend }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <div className="stat-row">
      <h3>{value}</h3>
      {trend ? <span className="stat-trend">{trend}</span> : null}
    </div>
  </div>
)
