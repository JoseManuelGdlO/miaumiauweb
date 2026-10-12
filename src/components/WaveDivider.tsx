interface WaveDividerProps {
  color?: string;
  flip?: boolean;
}

const WaveDivider = ({ color = "hsl(var(--background))", flip = false }: WaveDividerProps) => (
  <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}>
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className="block h-[50px] w-full md:h-[70px]"
    >
      <path
        d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z"
        fill={color}
        stroke="none"
      />
    </svg>
  </div>
);

export default WaveDivider;
