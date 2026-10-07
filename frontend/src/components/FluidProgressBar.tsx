import "./FluidProgressBar.css";

type FluidProgressBarProps = {
  /** Progress from 0 to 100 */
  progress: number;
  label?: string;
};

export default function FluidProgressBar({
  progress,
  label = "Super resolution progress",
}: FluidProgressBarProps) {
  const value = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div
      className="fluid-progress"
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div className="fluid-progress__track">
        <div className="fluid-progress__fill" style={{ width: `${value}%` }}>
          <div className="fluid-progress__wave fluid-progress__wave--back" />
          <div className="fluid-progress__wave fluid-progress__wave--front" />
          <div className="fluid-progress__edge" />
        </div>
      </div>
      <span className="fluid-progress__value">{value}%</span>
    </div>
  );
}
