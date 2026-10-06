import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  collectCoverageFrom: [
    "src/features/**/*.{ts,tsx}",
    "!src/features/**/AssignmentCard.tsx",
  ],
  coverageThreshold: {
    "src/features/": {
      statements: 70,
    },
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "CommonJS",
          target: "ES2022",
          jsx: "react-jsx",
          esModuleInterop: true,
          allowJs: true,
          skipLibCheck: true,
          noEmit: false,
          declaration: false,
          composite: false,
          rootDir: ".",
          outDir: "./node_modules/.cache/jest-tsout",
        },
      },
    ],
  },
};

export default config;
