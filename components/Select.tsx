type SelectProps = {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
};

function Select(props: SelectProps) {
  const { options, value, label, className = "", onChange } = props;

  return (
    <select
      className={`rounded-lg ring-black/40 ${className} mx-1`}
      value={value}
      onChange={onChange}
      aria-label={label}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;
