import { TypedText } from "./TypedText";

/** The hero headline, typed once on load (CSS only, see TypedText). */
export function TypedHeadline({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={className} aria-label={text}>
      <TypedText text={text} start={250} step={36} />
    </h1>
  );
}
