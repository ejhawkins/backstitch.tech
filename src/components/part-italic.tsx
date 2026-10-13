/** Sets the final word of a display heading in the synthetic italic, which is
    where the roman-to-italic shift reads as deliberate rather than random.

    The span carries its own fill: display headings paint their glyphs with a
    gradient clipped to the text, so -webkit-text-fill-color is transparent and
    inherits. A child without a background of its own renders nothing. */
export function PartItalic({ children }: { children: string }) {
  const words = children.trim().split(" ");
  const last = words.pop();
  return (
    <>
      {words.join(" ")} <span className="display-italic">{last}</span>
    </>
  );
}
