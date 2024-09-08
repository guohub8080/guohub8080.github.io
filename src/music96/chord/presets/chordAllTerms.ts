import chord3Terms from "./chord3Terms.ts";
import chord7Terms from "./chord7Terms.ts";
import chordHighTerms from "./chordHighTerms.ts";

const chordAllTerms = {
  "maj6": "maj6",
  "maj69": "maj69",
  "min6": "min6",
  "min69": "min69",
  ...chord3Terms,
  ...chord7Terms,
  ...chordHighTerms
}

export default chordAllTerms