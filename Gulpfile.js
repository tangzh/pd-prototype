var gulp = require('gulp'),
    less = require('gulp-less'),
    path = require('path'),
    nodemon = require('gulp-nodemon');

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

gulp.task('js', function() {

});

gulp.task('watch', function() {
  gulp.watch('./public/stylesheets/less/**/*.less', ['less']);
});

gulp.task('default', ['start', 'express', 'less', 'watch'], function() {

});
