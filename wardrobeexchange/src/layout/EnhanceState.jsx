import React from "react";

const stats = [
  { value: "1,200+", label: "Items Listed", color: "text-purple-400" },
  { value: "560+", label: "Successful Swaps", color: "text-blue-400" },
  { value: "890+", label: "Active Members", color: "text-green-400" },
];

export default function EnhanceState() {
  return (
    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto md:grid-cols-3">
      {stats.map(({ value, label, color }) => (
        <div key={label} className="text-center hover-lift rounded-2xl p-6">
          <p className={`text-3xl font-semibold ${color}`}>{value}</p>
          <div className="text-gray-400 mt-2">{label}</div>
        </div>
      ))}
    </div>
  );
}
