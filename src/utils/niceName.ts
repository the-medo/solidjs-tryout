export const niceName = (text: string) =>
  text
    .split(/(?=[A-Z])/)
    .map((w, i) => (i === 0 ? w[0].toUpperCase() + w.substring(1) : w.toLowerCase()))
    .join(' ');
