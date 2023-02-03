export const entries = <O extends {}>(o: O): [keyof O, O[keyof O]][] => {
  return Object.keys(o).map((k) => [k, o[k as keyof O]]) as [
    keyof O,
    O[keyof O]
  ][];
};

export const fromEntries = <O extends {}>(kvs: [keyof O, O[keyof O]][]) => {
  const partial = {} as Partial<O>;

  kvs.forEach(([k, v]) => {
    partial[k] = v;
  });
  return partial as O;
};
