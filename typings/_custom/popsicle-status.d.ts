declare module 'popsicle-status' {
  function status (min?: number, max?: number): (req: any) => void;

  export = status;
}
