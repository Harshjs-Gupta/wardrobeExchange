import LightRays from "./BitsComponents/LightRays";

import React from "react";

export default function LightRaysUsage() {
  return (
    <div style={{ width: "100%", height: "600px", position: "absolute" }}>
      <LightRays
        raysOrigin="top-center"
        raysColor="#C47AFF"
        raysSpeed={1.5}
        lightSpread={0.8}
        rayLength={1.2}
        followMouse={true}
        mouseInfluence={0.3}
        noiseAmount={0.1}
        distortion={0.05}
        className="custom-rays"
      />
    </div>
  );
}
