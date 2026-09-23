/** @type {import('jest').Config} */
module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': [ 'ts-jest', { tsconfig: { module: 'commonjs' } } ],
	},
	testMatch: [ '<rootDir>/test/**/*.test.ts' ],
	moduleNameMapper: {
		'\\.(scss|css)$': '<rootDir>/test/__mocks__/styleMock.cjs',
	},
};
