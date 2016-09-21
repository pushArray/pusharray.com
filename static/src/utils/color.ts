export function sliceBits(value: number , lower: number, upper: number): number {
  return ((value) >> (lower)) & ((1 << (upper - lower)) - 1);
}

export function rgbToHsl(red: number, green: number, blue: number): number[] {
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;
  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [(h * 360) >> 0, (s * 100) >> 0, (l * 100) >> 0];
}

export function hexToRgb(hex: number): number[] {
  let r = sliceBits(hex, 16, 24);
  let g = sliceBits(hex, 8, 16);
  let b = sliceBits(hex, 0, 8);
  return [r, g, b];
}

export function fromHexString(hex: string): number {
  let str = hex.replace(/^#/, '');
  if (str.length === 3) {
    let s = '';
    for (let i = 0; i < 3; i++) {
      let c = str[i];
      s += `${c}${c}`;
    }
    str = s;
  }
  return parseInt(str, 16);
}
