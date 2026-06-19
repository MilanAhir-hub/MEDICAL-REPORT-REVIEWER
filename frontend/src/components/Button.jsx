const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  const base =
    "py-2.5 px-5 rounded-lg text-sm font-medium active:scale-[0.97] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-[0_0_20px_rgba(94,106,210,0.15)] hover:shadow-[0_0_28px_rgba(94,106,210,0.25)]",
    outlined:
      "border border-hairline-strong bg-transparent text-ink hover:bg-surface-1 hover:border-ink-tertiary",
    secondary:
      "bg-surface-1 text-ink border border-hairline hover:bg-surface-2 hover:border-hairline-strong",
    ghost:
      "bg-transparent text-ink-subtle hover:text-ink hover:bg-surface-1",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
