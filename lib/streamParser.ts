export function parseCoTStream(buffer: string) {
  let thinking = "";
  let finalAnswer = "";
  let isReasoningDone = false;

  const thinkingStart = buffer.indexOf("<thinking>");
  const thinkingEnd = buffer.indexOf("</thinking>");
  const finalStart = buffer.indexOf("<final_answer>");
  const finalEnd = buffer.indexOf("</final_answer>");

  if (thinkingStart !== -1) {
    if (thinkingEnd !== -1) {
      thinking = buffer.substring(thinkingStart + 10, thinkingEnd);
      isReasoningDone = true;
    } else {
      thinking = buffer.substring(thinkingStart + 10);
    }
  }

  if (finalStart !== -1) {
    isReasoningDone = true;
    if (finalEnd !== -1) {
      finalAnswer = buffer.substring(finalStart + 14, finalEnd);
    } else {
      finalAnswer = buffer.substring(finalStart + 14);
    }
  }

  return { thinking, finalAnswer, isReasoningDone };
}

export function parseStandardStream(buffer: string) {
    let result = "";
    const finalMatch = buffer.match(/<final_answer>([\s\S]*?)<\/final_answer>/);
    if (finalMatch) {
        result = finalMatch[1];
    } else if (buffer.includes("<final_answer>")) {
         const parts = buffer.split("<final_answer>");
         result = parts[1];
    }
    return result;
}
