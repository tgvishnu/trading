# Nifty Futures Entry Helper

A simple React app that converts Nifty futures data into layman-friendly market guidance.

## What it shows

- Market Mood
- Can I Buy Now?
- Can I Short?
- Risk Level
- Market Score out of 100
- Simple explanation
- Positive signs and warning signs

## CSV format

```csv
date,spot,spotChange,future,futureChange,oiChange,fiiLongs,fiiShorts,daysToExpiry
Today,25000,-12,24831,-169,6,70000,110000,18
```

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Important note

This is an educational decision-support tool, not financial advice. Always use proper risk management.
