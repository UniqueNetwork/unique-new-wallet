const webpack = require('webpack');
const path = require('path');

// https://github.com/polkadot-js/ui/issues/592
// Required to load avatar static images
module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": false,
    })
    config.resolve.fallback = fallback;
    config.resolve.alias = {
        ...config.resolve.alias,
        process: 'process/',
        '@unique-nft/utils/index': '@unique-nft/utils/index.js',
        '@app': path.resolve(__dirname, './src/'),
    };
    config.ignoreWarnings = [/Failed to parse source map/];
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer']
        })
    ])
    return config;
}