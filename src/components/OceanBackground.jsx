import React from 'react';

/**
 * OceanBackground - Renders a full-screen fixed background with 4 animated SVG wave layers
 * simulating a dark sea at night.
 */
export default function OceanBackground() {
  const width = 2000;
  const height = 1000;

  // Generates a closed sinusoidal wave path filled to the bottom
  const generateWavePath = (yBase, amplitude, wavelength) => {
    let path = `M 0,${yBase.toFixed(1)}`;
    const doubleWidth = width * 2;
    for (let x = 10; x <= doubleWidth; x += 10) {
      const y = yBase + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y.toFixed(1)}`;
    }
    path += ` L ${doubleWidth},${height} L 0,${height} Z`;
    return path;
  };

  // Generates an open sinusoidal stroke path for highlights
  const generateStrokePath = (yBase, amplitude, wavelength) => {
    let path = `M 0,${yBase.toFixed(1)}`;
    const doubleWidth = width * 2;
    for (let x = 10; x <= doubleWidth; x += 10) {
      const y = yBase + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
      path += ` L ${x},${y.toFixed(1)}`;
    }
    return path;
  };

  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: '#060e1a',
      }}
    >
      <svg
        className="w-full h-full"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* WAVE LAYER 1 (deepest, slowest): base 60% height */}
        <path
          className="animate-ocean-wave-1"
          d={generateWavePath(height * 0.60, 40, 400)}
          fill="rgba(188, 203, 226, 0.4)"
        />

        {/* WAVE LAYER 2 (middle): base 70% height */}
        <path
          className="animate-ocean-wave-2"
          d={generateWavePath(height * 0.70, 30, 350)}
          fill="rgba(75, 133, 225, 0.3)"
        />

        {/* WAVE LAYER 3 (surface, fastest): base 80% height */}
        <path
          className="animate-ocean-wave-3"
          d={generateWavePath(height * 0.80, 20, 300)}
          fill="rgba(231, 208, 133, 0.04)"
        />

        {/* WAVE LAYER 4 (highlight shimmer): base 75% height */}
        <path
          className="animate-ocean-wave-4"
          d={generateStrokePath(height * 0.75, 30, 350)}
          fill="none"
          stroke="rgba(255, 211, 67, 0.06)"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}
