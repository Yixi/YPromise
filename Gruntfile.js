'use strict';
module.exports = function (grunt) {
    grunt.initConfig({
        //Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! YPromise <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n @Author Yixi \n https://github.com/Yixi/YPromise */\n',
        //Task
        concat: {

        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/{,*}*.js']
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                sourceMap: 'dist/YPromise-<%=pkg.version%>.min.map',
                sourceMappingURL: 'YPromise-<%=pkg.version%>.min.map'
            },
            dist: {
                src: ['src/YPromise.js'],
                dest: 'dist/YPromise-<%=pkg.version%>.min.js'
            }
        }

    });


    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'uglify'
    ]);
    grunt.registerTask('default', [
        'jshint',
        'build'
    ]);
};