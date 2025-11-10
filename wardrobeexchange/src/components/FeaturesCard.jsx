import React from "react";

export default function FeaturesCard({
  title,
  description,
  icon,
  cardShadow,
  iconContainerColor,
}) {
  return (
    <div
      className={`hover-lift bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 text-center ${cardShadow}`}
    >
      <div
        className={`w-20 h-20 bg-gradient-to-br ${iconContainerColor} rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg transition-transform duration-200`}
      >
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-6 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
