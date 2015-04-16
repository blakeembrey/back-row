declare module 'popsicle-resolve' {
  function resolve (baseUrl: string): (req: any) => void;

  export = resolve;
}
