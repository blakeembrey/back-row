declare module 'video.js' {
  interface VideoJsOptions {
    techOrder?: string[];
    html5?: Object;
    width?: string | number;
    height?: string | number;
    defaultVolume?: number;
    children?: Object;
  }

  interface VideoJsSource {
    type: string;
    src: string;
  }

  interface VideoJsPlayer {
    play(): VideoJsPlayer;
    pause(): VideoJsPlayer;
    paused(): boolean;
    src(newSource: string): VideoJsPlayer;
    src(newSource: VideoJsSource): VideoJsPlayer;
    src(newSource: VideoJsSource[]): VideoJsPlayer;
    currentTime(seconds: number): VideoJsPlayer;
    currentTime(): number;
    duration(): number;
    buffered(): TimeRanges;
    bufferedPercent(): number;
    volume(percentAsDecimal: number): TimeRanges;
    volume(): number;
    width(): number;
    width(pixels: number): VideoJsPlayer;
    height(): number;
    height(pixels: number): VideoJsPlayer;
    size(width: number, height: number): VideoJsPlayer;
    requestFullScreen(): VideoJsPlayer;
    cancelFullScreen(): VideoJsPlayer;
    ready(callback: () => void ): void;
    on(eventName: string, callback: () => void ): void;
    off(eventName: string, callback: () => void ): void;
    dispose(): void;
  }

  function videojs (id: any, options?: VideoJsOptions, ready?: () => any): VideoJsPlayer;

  module videojs {
    export function plugin (id: string, handler: (opts?: any) => any): void;
  }

  export = videojs;
}
