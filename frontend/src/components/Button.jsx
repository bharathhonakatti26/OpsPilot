export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
  ...props
}) => (
  <button
    className={`btn btn-${variant} btn-${size} ${className}`.trim()}
    type={type}
    {...props}
  >
    {children}
  </button>
)
