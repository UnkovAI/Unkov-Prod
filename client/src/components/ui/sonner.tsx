import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#1c1917",
          "--normal-border": "#e5ddd5",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
