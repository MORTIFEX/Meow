export const COMPANY = {
  name: "BENOTEK-BAU Kft.",
  email: "info.benotekbau@gmail.com",
  phone: "+36 30 088 1236",
  phoneRaw: "+36300881236",
  pricePerSqm: 3500,
  currency: "Ft",
};

export const formatFt = (n) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "0 Ft";
  return `${Math.round(n).toLocaleString("hu-HU").replace(/,/g, " ")} Ft`;
};
