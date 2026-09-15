
const Message = ({ variant, children }) => {
  const colorClasses = {
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
  };

  const colorClass = colorClasses[variant] || colorClasses.info;

  return (
    <div className={`p-4 rounded-md ${colorClass}`}>
      <p className="text-sm">{children}</p>
    </div>
  );
};

export default Message;