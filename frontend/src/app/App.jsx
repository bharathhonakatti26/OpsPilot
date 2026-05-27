import { ErrorBoundary } from './ErrorBoundary.jsx'
import AppRoutes from '../routes/AppRoutes.jsx'

const App = () => (
  <ErrorBoundary>
    <AppRoutes />
  </ErrorBoundary>
)

export default App
