module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'www/javascripts/app.js': ['www/browserify/**']
        },
        options: {
          transform: ['reactify']
        }
      }
    },
    sass: {
      dist: {
        files: {
          'www/stylesheets/main.css': 'www/stylesheets/main.scss'
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-sass')
}

