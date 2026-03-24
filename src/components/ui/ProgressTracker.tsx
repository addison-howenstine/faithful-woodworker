interface ProgressTrackerProps {
  label: string
  percentage: number
}

export default function ProgressTracker({ label, percentage }: ProgressTrackerProps) {
  const clampedPercent = Math.min(100, Math.max(0, percentage))

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-walnut">{label}</span>
        <span className="text-sm font-semibold text-accent">{clampedPercent}%</span>
      </div>
      <div className="w-full h-3 bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  )
}
