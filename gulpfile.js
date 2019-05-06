const gulp = require('gulp'),
			gulpSass = require('gulp-sass')
console.log(`${__dirname}/src/sass/*.scss`)
gulp.task('sass',()=>{
	return gulp.src(`${__dirname}/src/sass/main.scss`)
					.pipe(gulpSass({outputStyle: 'compressed'}).on('error', gulpSass.logError))
					.pipe(gulp.dest(`${__dirname}/src/css`))
})

gulp.watch(`${__dirname}/src/sass/*.scss`,gulp.series('sass'))
