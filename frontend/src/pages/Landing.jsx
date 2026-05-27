import { Link } from 'react-router-dom'
import { Button } from '../components/Button.jsx'
import { StatCard } from '../components/StatCard.jsx'
import { env } from '../utils/env.js'

const metrics = [
  { label: 'Active workspaces', value: '48', trend: '+12% MoM' },
  { label: 'Deployment pipelines', value: '216', trend: '+29% QoQ' },
  { label: 'Security signals triaged', value: '1.4k', trend: '-18% risk' },
]

const features = [
  {
    title: 'Unified control plane',
    description:
      'Bring projects, runbooks, alerts, and compliance checklists into one collaborative workspace built for distributed teams.',
  },
  {
    title: 'Operational intelligence',
    description:
      'Correlate service health, deployment velocity, and audit events to prioritize work with full context.',
  },
  {
    title: 'Security-first delivery',
    description:
      'Design for secure supply chain integration with placeholders for SonarQube, Trivy, ZAP, and secrets scanning.',
  },
  {
    title: 'Future-ready automation',
    description:
      'Architected for microservices and Kubernetes so workflows scale as your org grows.',
  },
]

const integrations = [
  'Jenkins',
  'Kubernetes',
  'SonarQube',
  'Trivy',
  'Prometheus',
  'Grafana',
]

const Landing = () => (
  <div className="landing">
    <header className="landing-hero">
      <div className="hero-content">
        <span className="eyebrow">{env.appName} Platform</span>
        <h1>Ops, security, and delivery in one orchestration hub.</h1>
        <p>
          {env.appName} is a cloud-native workspace for engineering, DevOps, and
          security teams who need clarity across projects, infrastructure, and
          operational risk.
        </p>
        <div className="hero-actions">
          <Link to="/register">
            <Button size="lg">Launch your workspace</Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
        <div className="hero-metrics">
          {metrics.map((item) => (
            <StatCard key={item.label} {...item} />
          ))}
        </div>
      </div>
      <div className="hero-panel">
        <div className="status-card">
          <p className="status-title">Live control surface</p>
          <div className="status-grid">
            <div>
              <span className="status-label">Workstreams</span>
              <strong>9 active</strong>
            </div>
            <div>
              <span className="status-label">Security posture</span>
              <strong>Stable</strong>
            </div>
            <div>
              <span className="status-label">Release readiness</span>
              <strong>Green</strong>
            </div>
            <div>
              <span className="status-label">Incident queue</span>
              <strong>2 open</strong>
            </div>
          </div>
        </div>
        <div className="signal-strip">
          <span>Pipeline coverage</span>
          <div className="signal-bar">
            <span style={{ width: '78%' }}></span>
          </div>
          <span className="signal-meta">78% automated checks mapped</span>
        </div>
      </div>
    </header>

    <section className="feature-grid">
      {features.map((feature) => (
        <article key={feature.title}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </article>
      ))}
    </section>

    <section className="integration-strip">
      <div>
        <h2>DevSecOps integrations lined up</h2>
        <p>
          Ready to plug into enterprise tooling without refactoring. Each
          integration is modeled as a future-ready adapter.
        </p>
      </div>
      <div className="integration-tags">
        {integrations.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>

    <section className="cta-banner">
      <div>
        <h2>Design the control room your teams deserve.</h2>
        <p>
          Launch a secure workspace, map delivery pipelines, and track
          compliance posture with a platform built for real-world operations.
        </p>
      </div>
      <Link to="/register">
        <Button size="lg">Start a secure workspace</Button>
      </Link>
    </section>
  </div>
)

export default Landing
