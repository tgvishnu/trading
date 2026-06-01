export function parseMarketCsv(text) {
  const lines = String(text).trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());

  return lines.slice(1).map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const obj = {};
    header.forEach((h, i) => {
      obj[h] = cells[i] || "";
    });

    return {
      date: obj.date || "Uploaded",
      spot: obj.spot || obj.niftyspot || "",
      spotChange: obj.spotchange || obj.niftychange || "",
      future: obj.future || obj.niftyfuture || "",
      futureChange: obj.futurechange || obj.change || "",
      oiChange: obj.oichange || obj.oi || "",
      fiiLongs: obj.fiilongs || "",
      fiiShorts: obj.fiishorts || "",
      daysToExpiry: obj.daystoexpiry || "",
    };
  });
}
