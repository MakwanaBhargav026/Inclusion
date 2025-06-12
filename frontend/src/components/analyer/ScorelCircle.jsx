"use client"

import { useEffect, useState } from "react"

export function ScoreCircle({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime

      if (elapsed < duration) {
        const nextScore = Math.min(Math.floor((elapsed / duration) * score), score)
        setAnimatedScore(nextScore)
        requestAnimationFrame(animate)
      } else {
        setAnimatedScore(score)
      }
    }

    requestAnimationFrame(animate)
  }, [score])

  // Calculate circle properties
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference

  // Determine color based on score
  const getColor = () => {
    if (animatedScore >= 90) return "text-emerald-500"
    if (animatedScore >= 70) return "text-green-500"
    if (animatedScore >= 50) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${getColor()} transform -rotate-90 origin-center transition-all duration-300`}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>{animatedScore}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">/ 100</span>
        </div>
      </div>
      <h3 className="mt-2 font-medium text-center">Accessibility Score</h3>
    </div>
  )
}
