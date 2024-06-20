
export default function MetricCard({ icon, title, value, additional }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="text-4xl text-primary mr-4">{icon}</div>
        <div>
          <h2 className="text-lg font-medium text-gray-600">{title}</h2>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {additional && <p className="text-sm text-gray-600">{additional}</p>}
        </div>
      </div>
    );
  }