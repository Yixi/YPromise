module.exports = function(grunt){
    grunt.initConfig({
        //Metadata.
        pkg:grunt.file.readJSON('package.json'),
        banner:'/*! YPromise <%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        //Task
        concat:{}

    });



    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    
}