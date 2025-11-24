
import { parseCoTStream, parseStandardStream } from "../lib/streamParser";
import { describe, it, expect } from '@jest/globals';

describe("Stream Parser", () => {
  it("should parse standard stream correctly", () => {
    const input = "<final_answer>The answer is 42.</final_answer>";
    const result = parseStandardStream(input);
    expect(result).toBe("The answer is 42.");
  });

  it("should parse partial standard stream", () => {
    const input = "<final_answer>The answer is";
    const result = parseStandardStream(input);
    expect(result).toBe("The answer is");
  });

  it("should parse CoT stream with both parts", () => {
    const input = "<thinking>Step 1...</thinking><final_answer>42</final_answer>";
    const { thinking, finalAnswer, isReasoningDone } = parseCoTStream(input);
    expect(thinking).toBe("Step 1...");
    expect(finalAnswer).toBe("42");
    expect(isReasoningDone).toBe(true);
  });

  it("should parse CoT stream with only thinking", () => {
    const input = "<thinking>Step 1...";
    const { thinking, finalAnswer, isReasoningDone } = parseCoTStream(input);
    expect(thinking).toBe("Step 1...");
    expect(finalAnswer).toBe("");
    expect(isReasoningDone).toBe(false);
  });

  it("should parse CoT stream with thinking done but no answer yet", () => {
    const input = "<thinking>Step 1...</thinking>";
    const { thinking, finalAnswer, isReasoningDone } = parseCoTStream(input);
    expect(thinking).toBe("Step 1...");
    expect(finalAnswer).toBe("");
    expect(isReasoningDone).toBe(true);
  });
});
