module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  uglify: {
    options: {
      mangle: false
    },
    build: {
      files: {
        'build/app.min.js': ['js/application.js', 'js/controllers.js', 'js/models.js', 'js/routes.js', 'js/views.js']
      }
    }
  }
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['uglify']);

};
