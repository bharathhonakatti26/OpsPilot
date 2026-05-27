import { PageHeader } from '../components/PageHeader.jsx'
import { Button } from '../components/Button.jsx'

const columns = [
  {
    title: 'To do',
    items: [
      { title: 'Map staging cluster dependencies', owner: 'Ops Team' },
      { title: 'Draft security runbook update', owner: 'Security' },
    ],
  },
  {
    title: 'In progress',
    items: [
      { title: 'Release checklist automation', owner: 'DevOps' },
      { title: 'Audit log export pipeline', owner: 'Platform' },
    ],
  },
  {
    title: 'Blocked',
    items: [{ title: 'SLO baseline update', owner: 'SRE' }],
  },
  {
    title: 'Done',
    items: [
      { title: 'Secrets rotation cadence set', owner: 'Security' },
      { title: 'OpsPilot onboarding template', owner: 'Program' },
    ],
  },
]

const TaskBoard = () => (
  <div className="page">
    <PageHeader
      title="Task board"
      subtitle="Move delivery cards across execution lanes in real time."
      action={<Button>Create task</Button>}
    />
    <div className="board">
      {columns.map((column) => (
        <div key={column.title} className="board-column">
          <div className="board-header">
            <h3>{column.title}</h3>
            <span>{column.items.length}</span>
          </div>
          {column.items.map((item) => (
            <div key={item.title} className="board-card">
              <strong>{item.title}</strong>
              <p>{item.owner}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
)

export default TaskBoard
