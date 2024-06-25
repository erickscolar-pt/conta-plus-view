
export default function MetricCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 m-4 text-center">
      <Icon className="text-indigo-600 text-4xl mx-auto mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700">{title}</h2>
      <p className="text-4xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  );
};