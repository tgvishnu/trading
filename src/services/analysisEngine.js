export function analyzeMarket(rawData) {
  const data = normalizeInput(rawData);

  const basis = data.future - data.spot;
  const fiiRatio = data.fiiShorts > 0 ? data.fiiLongs / data.fiiShorts : 0;
  const futureWeakerThanSpot = data.futureChange < data.spotChange;

  let score = 50;
  const positives = [];
  const warnings = [];

  if (data.futureChange > 0 && data.oiChange > 0) {
    score += 25;
    positives.push("Fresh buyers are entering the futures market.");
  }

  if (data.futureChange < 0 && data.oiChange > 0) {
    score -= 30;
    warnings.push("Fresh sellers are entering the futures market.");
  }

  if (data.futureChange > 0 && data.oiChange < 0) {
    score += 5;
    warnings.push("The rise may be because sellers are exiting, not because new buyers are strong.");
  }

  if (data.futureChange < 0 && data.oiChange < 0) {
    score -= 10;
    warnings.push("Existing buyers may be exiting their positions.");
  }

  if (basis > 0) {
    score += 10;
    positives.push("Futures are still above the current market, which is a mild positive sign.");
  } else if (basis < 0) {
    score -= 15;
    warnings.push("Futures are below the current market, which shows weak sentiment.");
  }

  if (fiiRatio >= 1.2) {
    score += 20;
    positives.push("Foreign investors are leaning more bullish than bearish.");
  } else if (fiiRatio > 0 && fiiRatio < 0.8) {
    score -= 20;
    warnings.push("Foreign investors are leaning more bearish than bullish.");
  }

  if (futureWeakerThanSpot) {
    score -= 10;
    warnings.push("Futures are falling more than the actual index, which shows nervousness.");
  } else if (data.futureChange > data.spotChange) {
    score += 8;
    positives.push("Futures are stronger than the actual index, which shows better confidence.");
  }

  if (data.daysToExpiry <= 3 && data.daysToExpiry > 0) {
    warnings.push("Expiry is very close, so moves can be sharp and confusing.");
    score -= 5;
  }

  score = clamp(Math.round(score), 0, 100);

  const decision = getDecisionFromScore(score);
  const simpleStory = buildSimpleStory({
    spotChange: data.spotChange,
    futureChange: data.futureChange,
    oiChange: data.oiChange,
    basis,
    fiiRatio,
    mood: decision.mood,
  });

  return {
    ...decision,
    score,
    basis,
    fiiRatio,
    positives,
    warnings,
    simpleStory,
  };
}

function normalizeInput(rawData) {
  return {
    spot: Number(rawData.spot || 0),
    spotChange: Number(rawData.spotChange || 0),
    future: Number(rawData.future || 0),
    futureChange: Number(rawData.futureChange || 0),
    oiChange: Number(rawData.oiChange || 0),
    fiiLongs: Number(rawData.fiiLongs || 0),
    fiiShorts: Number(rawData.fiiShorts || 0),
    daysToExpiry: Number(rawData.daysToExpiry || 0),
  };
}

function getDecisionFromScore(score) {
  if (score >= 75) {
    return {
      mood: "Positive",
      entryLong: "Good, but enter slowly",
      entryShort: "Avoid",
      risk: "Medium",
      guidance: "Buying on dips is better than chasing a sudden jump. Enter in small parts.",
      holdingGuidance: "You can continue holding, but keep a stop loss below the recent support.",
    };
  }

  if (score >= 60) {
    return {
      mood: "Mildly Positive",
      entryLong: "Possible with small quantity",
      entryShort: "Avoid unless trend reverses",
      risk: "Medium",
      guidance: "A small entry is acceptable, but avoid using full capital at once.",
      holdingGuidance: "Hold with a stop loss. Do not average aggressively.",
    };
  }

  if (score >= 40) {
    return {
      mood: "Sideways / Unclear",
      entryLong: "Wait",
      entryShort: "Wait",
      risk: "Medium to High",
      guidance: "This is not a clean entry zone. Let the market show direction first.",
      holdingGuidance: "Reduce unnecessary risk. Hold only if your stop loss is clearly defined.",
    };
  }

  if (score >= 25) {
    return {
      mood: "Negative",
      entryLong: "Not ideal",
      entryShort: "Possible on rise",
      risk: "High",
      guidance: "Avoid fresh buying. If trading, wait for a bounce and only then consider short-side setups.",
      holdingGuidance: "Be careful. Consider reducing exposure if price breaks your stop loss.",
    };
  }

  return {
    mood: "Strongly Negative",
    entryLong: "Avoid",
    entryShort: "Only for experienced traders",
    risk: "Very High",
    guidance: "Fresh long entry is risky. Do not catch a falling knife. Wait for stability.",
    holdingGuidance: "Protect capital first. Avoid averaging down without a clear reversal.",
  };
}

function buildSimpleStory({ spotChange, futureChange, oiChange, basis, fiiRatio, mood }) {
  const lines = [];

  if (futureChange < spotChange) {
    lines.push("The futures market is more nervous than the actual Nifty index.");
  } else if (futureChange > spotChange) {
    lines.push("The futures market is showing better confidence than the actual Nifty index.");
  } else {
    lines.push("Futures and the actual Nifty index are moving almost similarly.");
  }

  if (futureChange < 0 && oiChange > 0) {
    lines.push("New sellers are entering, so the pressure is not just because old buyers are exiting.");
  } else if (futureChange > 0 && oiChange > 0) {
    lines.push("New buyers are entering, which supports the upward move.");
  } else if (futureChange > 0 && oiChange < 0) {
    lines.push("The rise may be temporary because it looks like sellers are closing positions.");
  } else if (futureChange < 0 && oiChange < 0) {
    lines.push("Weakness is visible, but it may be due to buyers exiting rather than aggressive new selling.");
  }

  if (basis < 0) lines.push("Traders are not willing to pay extra for future exposure, which is a weak sign.");
  if (basis > 0) lines.push("Traders are still paying extra for future exposure, which is mildly supportive.");

  if (fiiRatio > 0 && fiiRatio < 0.8) lines.push("Foreign investors are currently more on the selling side.");
  if (fiiRatio >= 1.2) lines.push("Foreign investors are currently more on the buying side.");

  lines.push(`Overall, the market mood is ${mood.toLowerCase()}.`);
  return lines.join(" ");
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
