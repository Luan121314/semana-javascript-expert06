const defaultConfig = {
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporter: [
    "text",
    "lcov"
  ],
  coverageThreshold: {
    global: {
      branch: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  maxWorkers: "50%",
  watchPathIgnorePatterns: [
    "node_modules"
  ],
  transformIgnorePatterns:[
    "node_modules"
  ]
}

export default {
  projects: [
   {
     ...defaultConfig,
     testEnvironment: "node",
     displayName: "backend",
     collectCoverageFrom: [
       "server/",
       "!server/index.js"
     ],
     watchPathIgnorePatterns: [
      ...defaultConfig.watchPathIgnorePatterns,
      "public"
    ],
    testMatch:[
      "**/tests/**/server/**/*.test.js"
    ]
   },
   {
    ...defaultConfig,
    testEnvironment: "jsdom",
    displayName: "frontend",
    collectCoverageFrom: [
      "public/",
    ],
    watchPathIgnorePatterns: [
     ...defaultConfig.watchPathIgnorePatterns,
     "server"
   ],
   testMatch:[
     "**/tests/**/public/**/*.test.js"
   ]
  }
  ]
}