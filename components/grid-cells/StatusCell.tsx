// This is a simple React component that receives the cell's value as a prop
const StatusCell = (props: { value: string }) => {
  const { value } = props;

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-yellow-100 text-yellow-800";
      case "closed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(value)}`}>
      {value}
    </span>
  );
};

export default StatusCell;