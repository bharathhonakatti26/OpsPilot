export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="loading-state" role="status" aria-live="polite">
    <div className="loading-spinner" aria-hidden="true" />
    <p>{message}</p>
  </div>
)
