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
    },
    watch: {
      browserify: {
        files: 'www/browserify/**',
        tasks: ['browserify'],
        options: {
          interrupt: true
        }
      },
      sass: {
        files: 'www/stylesheets/**/*.scss',
        tasks: ['sass'],
        options: {
          interrupt: true
        }
      }
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.registerTask('default', ['browserify', 'sass', 'watch'])
}

