import { PageHeader } from '../components/PageHeader.jsx'
import { Button } from '../components/Button.jsx'

const Settings = () => (
  <div className="page">
    <PageHeader
      title="Workspace settings"
      subtitle="Control retention, incident response, and security defaults."
    />
    <div className="panel-grid">
      <div className="panel">
        <h3>Retention policy</h3>
        <p>Align log storage with compliance requirements.</p>
        <div className="form-row">
          <label>
            <span>Audit retention window</span>
            <select defaultValue="90">
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
            </select>
          </label>
        </div>
      </div>
      <div className="panel">
        <h3>Access controls</h3>
        <p>Manage workspace roles and privileged operations.</p>
        <div className="form-row">
          <label>
            <span>Require security review for releases</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>
        <div className="form-row">
          <label>
            <span>Enable elevated access approvals</span>
            <input type="checkbox" />
          </label>
        </div>
      </div>
      <div className="panel">
        <h3>Notifications</h3>
        <p>Route critical alerts to on-call responders.</p>
        <div className="form-row">
          <label>
            <span>Pager escalation policy</span>
            <select defaultValue="high">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
        </div>
        <Button variant="secondary">Save changes</Button>
      </div>
    </div>
  </div>
)

export default Settings
