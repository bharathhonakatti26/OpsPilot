import { useQuery } from '@tanstack/react-query'
import { PageHeader } from '../components/PageHeader.jsx'
import { Button } from '../components/Button.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { EmptyState } from '../components/EmptyState.jsx'
import { listWorkspaces } from '../services/workspaceService.js'

const Workspaces = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () => listWorkspaces({ limit: 6 }),
  })

  const workspaces = data?.workspaces || []

  return (
    <div className="page">
      <PageHeader
        title="Workspaces"
        subtitle="Segment teams, environments, and compliance boundaries."
        action={<Button>Create workspace</Button>}
      />
      {isLoading ? <LoadingState message="Loading workspaces..." /> : null}
      {isError ? (
        <EmptyState
          title="Unable to load workspaces"
          message="Check your API connection or refresh after configuration."
        />
      ) : null}
      {!isLoading && !isError && workspaces.length === 0 ? (
        <EmptyState
          title="No workspaces yet"
          message="Create your first workspace to start collaborating."
          action={<Button>Create workspace</Button>}
        />
      ) : null}
      <div className="card-grid">
        {workspaces.map((workspace) => (
          <div key={workspace._id} className="card">
            <h3>{workspace.name}</h3>
            <p>{workspace.slug}</p>
            <div className="card-footer">
              <span>{workspace.members?.length || 0} members</span>
              <Button variant="ghost" size="sm">
                Open
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Workspaces
