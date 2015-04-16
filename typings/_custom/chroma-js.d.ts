declare module 'chroma-js' {
  class Color {
    rgb(): number[];
    rgba(): number[];
    hsl(): number[];
    hsv(): number[];
    lab(): number[];
    lch(): number[];
    hsi(): number[];
    gl(): number[];
    num(): number;
    hex(): string;
    css(): string;
    luminance(): number;
    luminance(amount: number): Color;
    name(): string;
    alpha(): number;
    alpha(amount: number): Color;
    darken(amount?: number): Color;
    brighter(amount?: number): Color;
    brighten(amount?: number): Color;
    saturate(amount?: number): Color;
    desaturate(amount?: number): Color;
  }

  interface Scale {
    (amount: number): string;
    out(color: string[]): Scale;
    mode(mode: string): Scale;
    domain(range: number[], stops?: number, mode?: string): Scale;
    range(colors: string[]): Scale;
    correctLightness(correct?: boolean): Scale;
    colors(): string[];
  }

  function Chroma (...args: any[]): Color;

  // interface Chroma {
  //   (color: string): Color;
  //   (color: number[], mode: string): Color;
  //   (a: number, b: number, c: number, mode: string): Color;
  //   (number: number, mode: string): Color;
  // }

  module Chroma {
    export function hex (color: string): Color;
    export function css (color: string): Color;
    export function rgb (r: number, g: number, b: number): Color;
    export function hsl (h: number, s: number, l: number): Color;
    export function hsv (h: number, s: number, v: number): Color;
    export function lab (l: number, a: number, b: number): Color;
    export function lch (l: number, c: number, h: number): Color;
    export function gl (a: number, b: number, c: number): Color;
    export function num (num: number): Color;
    export interface interpolate {
      (a: string, b: string, amount: number, mode?: string): Color;
      bezier(colors: string[]): (amount: number) => Color;
    }
    export function scale (colors: string | string[]): Scale;
    export function luminance (color: string): number;
    export function contrast (a: string, b: string): number;
  }

  export = Chroma;
}
