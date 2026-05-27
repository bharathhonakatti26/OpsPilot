import { PageHeader } from '../components/PageHeader.jsx'
import { formatDateTime } from '../utils/format.js'

const logs = [
  {
    action: 'Workspace settings updated',
    actor: 'Avery Jones',
    time: '2026-05-26T18:12:00.000Z',
  },
  {
    action: 'Security scan policy approved',
    actor: 'Security Automation',
    time: '2026-05-26T16:48:00.000Z',
  },
  {
    action: 'Project release gate reopened',
    actor: 'Release Manager',
    time: '2026-05-26T14:05:00.000Z',
  },
]

const ActivityLog = () => (
  <div className="page">
    <PageHeader
      title="Activity log"
      subtitle="Every action is tracked for audit and security review."
    />
    <div className="panel">
      <div className="activity-list">
        {logs.map((log) => (
          <div key={log.action} className="activity-item">
            <div>
              <strong>{log.action}</strong>
              <p>{log.actor}</p>
            </div>
            <span>{formatDateTime(log.time)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export default ActivityLog
