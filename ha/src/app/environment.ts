declare const process: {
  env: {
    NODE_ENV?: string;
  };
};

export const isDevelopment = process.env.NODE_ENV !== "production";
