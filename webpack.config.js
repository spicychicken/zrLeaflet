module.exports = {
    mode: 'development',
    entry: __dirname + '/src/zrLeaflet.js',
    output: {
        path: __dirname + '/dist',
        filename: 'zrLeaflet.js',
        libraryTarget: 'var',
        library: 'ZL'
    }
};