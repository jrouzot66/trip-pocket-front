module.exports = {
    stories: [
        "../app/components/**/*.stories.@(js|jsx|ts|tsx)",
        "../app/stories/**/*.stories.@(js|jsx|ts|tsx)",
    ],
    addons: [
        "@storybook/addon-ondevice-controls",
        "@storybook/addon-ondevice-actions",
        "@storybook/addon-ondevice-notes",
    ],
};
