const formater = new Intl.NumberFormat("no-no", {
  style: "unit",
  unit: "kilometer",
});

export function formatMeter(meter: number): string {
  return formater.format(parseFloat((meter / 1000).toFixed(2)));
}
