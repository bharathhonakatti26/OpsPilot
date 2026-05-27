export const EmptyState = ({ title, message, action }) => (
  <div className="empty-state">
    <h3>{title}</h3>
    <p>{message}</p>
    {action ? <div className="empty-action">{action}</div> : null}
  </div>
)
