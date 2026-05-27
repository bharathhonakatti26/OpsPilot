import { Link } from 'react-router-dom'
import { Button } from '../components/Button.jsx'

const NotFound = () => (
  <div className="not-found">
    <h1>Page not found</h1>
    <p>The route you requested does not exist in OpsPilot.</p>
    <Link to="/">
      <Button variant="secondary">Return home</Button>
    </Link>
  </div>
)

export default NotFound
