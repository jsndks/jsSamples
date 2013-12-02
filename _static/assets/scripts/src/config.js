/**
 * Application configuration declaration.
 *
 * This configuration file is shared between the website and the build script so
 * that values don't have to be duplicated across environments. Any non-shared,
 * environment-specific configuration should placed in appropriate configuration files.
 */

require.config({
    // This is just to set a shorter alias for longer paths
    paths: {
        'jquery': 'lib-thirdparty/components/jquery/jquery',
        'text': 'lib-thirdparty/components/text/text',
        'handlebars': 'lib-thirdparty/components/handlebars/handlebars',
        'snap': 'lib-thirdparty/snap.svg'
    },

    // This allows us to set dependencies for third-party libraries that do not follow the RequireJS pattern
    shim: {
        'jquery': {
            exports: '$'
        },
        'handlebars': {
            exports: 'Handlebars'
        },
        'snap': {
            exports: 'Snap'
        }
    }
});