export const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
}) => (
  <label className="input-field">
    <span>{label}</span>
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
    />
  </label>
)
