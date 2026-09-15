const ProgressSteps = ({ steps }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={`h-1 w-16 ${step.active ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;