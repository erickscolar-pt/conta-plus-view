const MetricCard = ({ title, value }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 m-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
        <p className="text-4xl font-bold text-indigo-600 mt-2">{value}</p>
      </div>
    );
  };
  