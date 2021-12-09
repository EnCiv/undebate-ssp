module.exports = {
  "stories": ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials"],
  "framework": "@storybook/react",
  core: {
    builder: "webpack5"
  },
  webpackFinal: async (config) => (console.info("main",JSON.stringify(config,null,2)),{ resolve: { fallbacks: {fs: false} }, ...config })
};