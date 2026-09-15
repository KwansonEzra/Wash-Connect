
const Loader = ({ small = false }) => {
  if (small) {
    return (
      <div className="flex justify-center items-center py-2">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
};

export default Loader;