module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({

        // This will load in our package.json file so we can have access
        // to the project name and version number.
        pkg: grunt.file.readJSON('package.json'),


        // Constants for the Gruntfile so we can easily change the path for our environments.
        BASE_PATH: '../../',
        DOCS_PATH: '<%= BASE_PATH %>' + 'docs/',
        JS_SOURCE_PATH: '<%= BASE_PATH %>' + 'assets/scripts/src/',
        JS_BUILD_PATH: '<%= BASE_PATH %>' + 'assets/scripts/build/',
        CSS_SOURCE_PATH: '<%= BASE_PATH %>' + 'assets/styles/',
        INCLUDES_PATH: '<%= BASE_PATH %>' + 'includes/',
        TEMPLATES_PATH: '<%= BASE_PATH %>' + 'templates/',


        // A code block that will be added to all our minified code files.
        // Gets the name and version from the above loaded 'package.json' file.
        // How to use: '<%= banner.join("\\n") %>'
        banner: [
            '/*',
            '* Project: <%= pkg.name %>',
            '* Version: <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>)',
            '* Development By: <%= pkg.developedBy %>',
            '* Copyright(c): <%= grunt.template.today("yyyy") %>',
            '*/'
        ],


        // YUIDoc plugin that will generate our JavaScript documentation.
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: '<%= JS_SOURCE_PATH %>',
                    outdir: '<%= DOCS_PATH %>js',
                    themedir: '../yuidoc/themes/nerdery-standard-theme',
                    exclude: ''
                }
            }
        },


        // RequireJS plugin that will use uglify2 to build and minify our
        // JavaScript, templates and any other data we include in the require files.
        requirejs: {
            compile: {
                options: {
                    baseUrl: '<%= JS_SOURCE_PATH %>',                         // Path of source scripts, relative to this build file
                    mainConfigFile: '<%= JS_SOURCE_PATH %>' + 'config.js',    // Path of shared configuration file, relative to this build file
                    name: 'main',                                               // Name of input script (.js extension inferred)
                    out: '<%= JS_BUILD_PATH %>' + 'main.js',                  // Path of built script output

                    fileExclusionRegExp: /.svn/,                                // Ignore all files matching this pattern
                    useStrict: true,
                    preserveLicenseComments: true,
                    pragmas: {
                        debugExclude: true
                    },

                    optimize: 'uglify2',                                        // 'none' If you do not want to uglify.
                    uglify2: {
                        output: {
                            beautify: false,
                            comments: false
                        },
                        compress: {
                            sequences: false,
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: false,
                        mangle: true
                    }
                }
            }
        },


        // Concat plugin takes the minified JavaScript file and adds the banner to the top.
        concat: {
            js: {
                options: {
                    banner: '<%= banner.join("\\n") %> \n'
                },
                src: ['<%= JS_BUILD_PATH %>' + 'main.js'],
                dest: '<%= JS_BUILD_PATH %>' + 'main.js'
            },
            css: {
                src: [
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'reset/' +                           'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'base/' +                            'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'utility/' +                         'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'headings/' +                        'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'text/' +                            'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'icon/' +                            'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'grid/' +                            'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'blocks/' +                          'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'layout/' +                          'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'button/' +                          'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'layoutSection/' +                   'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'media/' +                           'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'box/' +                             'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'feature/' +                         'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'description/' +                     'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'mainNav/' +                         'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'masthead/' +                        'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'modal/' +                           'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'particles/' +                       'base.css',
                    '<%= CSS_SOURCE_PATH %>' + 'src/' + 'percentage/' +                      'base.css'
                ],
                dest: '<%= CSS_SOURCE_PATH %>' + 'build/screen.css'
            }
        },

        // Scripts
        jshint: {
            options: {
                jshintrc: '<%= JS_SOURCE_PATH %>.jshintrc',
                force: true // Set to true to report JSHint errors but not fail the task.

            },
            all: [
                '<%= JS_SOURCE_PATH %>**/*.js',
                '!<%= JS_SOURCE_PATH %>lib-thirdparty/**/*.js',
                '!<%= JS_SOURCE_PATH %>polyfills/**/*.js'
            ]
        },

        watch: {
            js: {
                options: {
                    interrupt: true
                },
                files: [
                    '<%= JS_SOURCE_PATH %>**/*.js'
                ],
                tasks: ['concat', 'notify:boom']
            },
            css: {
                options: {
                    interrupt: true
                },
                files: [
                    '<%= CSS_SOURCE_PATH %>src/**/*.css'
                ],
                tasks: ['concat', 'notify:boom']
            },
            livereload: {
                options: {
                    livereload: true
                },
                files: [
                    '<%= CSS_SOURCE_PATH %>build/*.css'
                ]
            },
        },

        notify: {
            boom: {
              options: {
                  title: 'Boom!',
                  message: 'Loaded',
              }
            }
        }

    });

    // Loads the necessary tasks for this Grunt file.
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    // Custom task, executed via the command `grunt exec`
    // grunt.registerTask('concat', ['exec', 'watch']);
    grunt.registerTask('boom', ['concat', 'notify:boom', 'watch']);

    // Custom task, executed via the command `grunt dev`
    grunt.registerTask('dev', ['jshint']);

    // Custom task, executed via the command `grunt staging`
    grunt.registerTask('staging', ['concat' , 'clean', 'exec']);

    // Custom task, executed via the command `grunt prod`
    grunt.registerTask('prod', ['yuidoc', 'requirejs', 'concat', 'notify:boom', 'jshint']);

    // Default task, executed via the command `grunt`
    grunt.registerTask('default', ['boom']);
};



























