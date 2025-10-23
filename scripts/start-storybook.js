const { spawn } = require("child_process");

// Set environment variable for Storybook
process.env.EXPO_PUBLIC_STORYBOOK = "true";

// Start Expo with Storybook mode
const expo = spawn("npx", ["expo", "start", "--port", "8082"], {
    stdio: "inherit",
    shell: true,
    env: {
        ...process.env,
        EXPO_PUBLIC_STORYBOOK: "true",
    },
});

expo.on("close", (code) => {
    process.exit(code);
});
