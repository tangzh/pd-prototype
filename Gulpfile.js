var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')();

gulp.task('start', function() {
  nodemon({
    script: 'app.js',
    ext: 'js html less jade css',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('express', function() {
  var debug = require('debug')('pt');
  var app = require('./app');

  app.set('port', process.env.PORT || 3000);

  var server = app.listen(app.get('port'), function() {
    debug('Express server listening on port ' + server.address().port);
  });
});

gulp.task('less', function() {
  return gulp.src('./public/stylesheets/less/**/*.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('./public/stylesheets/css'));
});

// compile index.jade files to .html files in .tmp
gulp.task('views', function () {
  return gulp.src(['views/index.jade'])
      .pipe($.jade({pretty: true}))
      .pipe(gulp.dest('.tmp'));
});

gulp.task('templates', function() {
  return gulp.src([
    './views/**/*.jade'
  ])
  .pipe($.jade({pretty: true}).on('error', $.util.log))
  .pipe(gulp.dest('public/templates'));
});

gulp.task('js', function() {
  return gulp.src('./public/javascripts/**/*.js')
    .pipe(gulp.dest('dist'));
});

gulp.task('html', ['views', 'less', 'templates', 'js'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'public', 'bower_components']});
  console.log(assets);

  return gulp.src('.tmp/index.html')
    .pipe(assets)
    .pipe($.if('*.js', $.ngAnnotate()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'));
});


gulp.task('watch', function() {
  gulp.watch('./public/stylesheets/less/**/*.less', ['less']);
});

gulp.task('default', ['start', 'express', 'less', 'watch', 'html'], function() {

});
