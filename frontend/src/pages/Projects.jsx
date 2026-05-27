import { PageHeader } from '../components/PageHeader.jsx'
import { Button } from '../components/Button.jsx'

const projects = [
  {
    name: 'Cloud migration control plane',
    key: 'OPS',
    status: 'Active',
    owner: 'Platform Team',
  },
  {
    name: 'Zero trust posture rollout',
    key: 'SEC',
    status: 'Active',
    owner: 'Security Engineering',
  },
  {
    name: 'Release automation refactor',
    key: 'REL',
    status: 'Planning',
    owner: 'DevOps',
  },
]

const Projects = () => (
  <div className="page">
    <PageHeader
      title="Projects"
      subtitle="Track initiatives, delivery milestones, and ownership."
      action={<Button>Create project</Button>}
    />
    <div className="card-grid">
      {projects.map((project) => (
        <div key={project.key} className="card">
          <div className="card-header">
            <h3>{project.name}</h3>
            <span className="status-pill">{project.status}</span>
          </div>
          <p>Key: {project.key}</p>
          <p>Owner: {project.owner}</p>
          <div className="card-footer">
            <Button variant="ghost" size="sm">
              View details
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default Projects
