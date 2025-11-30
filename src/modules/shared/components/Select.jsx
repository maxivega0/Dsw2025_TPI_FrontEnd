function Select({ label, error = '', ...restProps }) {
  return (
    <div
      className='
        flex
        flex-col
        h-20
        mb-4
      '
    >
      <label>{label}:</label>
      <select className={ error && 'border-red-400' } { ...restProps }>
      {error && <p className="text-red-500 text-base sm:text-xs">{error}</p>}
        {restProps.children}
      </select>
    </div>
  );
};

export default Select;
