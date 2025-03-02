export default {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.test.json',
        }],
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        // if your using tsconfig.paths there's no harm in telling jest
        '@components/(.*)$': '<rootDir>/src/components/$1',
        '@/(.*)$': '<rootDir>/src/$1',
    },
    "automock": false,
    "resetMocks": false,
    testEnvironment: 'jsdom',
    collectCoverageFrom: ['src/**/*.{ts,tsx}'],
    moduleFileExtensions: ['ts', 'tsx', 'json', 'js'],
    modulePaths: ['<rootDir>'],
    setupFilesAfterEnv: ['./setupTests.ts'],
};