'use client'

import React, { useEffect, useState } from 'react'

interface LoadingProgressCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  animate?: boolean
  duration?: number // milliseconds
}

const LoadingProgressCircle: React.FC<LoadingProgressCircleProps> = ({
  percentage,
  size = 120,
  strokeWidth = 12,
  animate = true,
  duration = 1000
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const [progressValue, setProgressValue] = useState(0)

  useEffect(() => {
    if (animate) {
      let start = 0
      const startTime = performance.now()

      const animateStep = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const currentValue = Math.floor(progress * percentage)
        setProgressValue(currentValue)

        if (progress < 1) {
          requestAnimationFrame(animateStep)
        }
      }

      requestAnimationFrame(animateStep)
    } else {
      setProgressValue(percentage)
    }
  }, [percentage, animate, duration])

  const strokeDashoffset =
    circumference - (progressValue / 100) * circumference

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Vòng nền */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFF8E7"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Vòng tiến độ */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#FFA726"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            transition: animate ? `stroke-dashoffset ${duration}ms ease-out` : 'none'
          }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-gray-800">
        {progressValue}%
      </div>
    </div>
  )
}

export default LoadingProgressCircle
