import { Button } from '../components/Button.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { StatCard } from '../components/StatCard.jsx'

const alerts = [
  {
    title: 'High latency detected on core API',
    summary: 'Investigate p95 overage across three regions.',
  },
  {
    title: 'Security scan requires approval',
    summary: 'Pending review for storage bucket policy changes.',
  },
  {
    title: 'Pipeline drift detected',
    summary: 'Deployment pipeline not aligned with release policy.',
  },
]

const Dashboard = () => (
  <div className="page">
    <PageHeader
      title="Command dashboard"
      subtitle="Monitor delivery velocity, incidents, and risk posture in one view."
      action={<Button>Launch incident review</Button>}
    />

    <section className="grid-three">
      <StatCard label="Active programs" value="12" trend="+2 this week" />
      <StatCard label="Change requests" value="84" trend="-7%" />
      <StatCard label="Critical findings" value="3" trend="-1" />
    </section>

    <section className="panel-grid">
      <div className="panel">
        <h3>Operational focus</h3>
        <p>
          Align projects and incidents across teams. See what needs attention
          before the next release window.
        </p>
        <Button variant="secondary">Review weekly brief</Button>
      </div>
      <div className="panel">
        <h3>Risk coverage</h3>
        <ul className="list">
          <li>Policy checks mapped to deployment pipelines</li>
          <li>Secrets scanning integrated into CI templates</li>
          <li>Audit trail retention aligned to compliance needs</li>
        </ul>
      </div>
      <div className="panel">
        <h3>Action queue</h3>
        <div className="alert-list">
          {alerts.map((alert) => (
            <div key={alert.title} className="alert-card">
              <strong>{alert.title}</strong>
              <p>{alert.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
)

export default Dashboard
