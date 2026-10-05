interface SkeletonProps {
  width?: string
  height?: number
  className?: string
}

function Skeleton({ width = '100%', height = 12, className = '' }: SkeletonProps) {
  return <span className={`skeleton ${className}`.trim()} style={{ width, height }} aria-hidden="true" />
}

export default Skeleton
