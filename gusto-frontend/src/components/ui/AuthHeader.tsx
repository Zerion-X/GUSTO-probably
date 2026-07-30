type AuthHeaderProps = {
  title: string;
  highlight: string;
  description: string;
};

export default function AuthHeader({title, highlight, description,}: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <span className="text-sm uppercase tracking-[0.6em] text-[#8B5A3C]">
        GUSTO
      </span>

      <h1
        className="mt-3 text-5xl tracking-tight text-[#3A2419]"
        style={{
          fontFamily: "Cormorant Garamond, serif",
        }}
      >
        {title} <span className="text-[#C47A2C]">{highlight}</span>
      </h1>

      <p className="mt-3 text-sm text-[#8B5A3C]">
        {description}
      </p>
    </div>
  );
}