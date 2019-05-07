const gulp = require('gulp'),
			pug = require('gulp-pug'),
			sass = require('gulp-sass')
gulp.task('pug', ()=> {
	return gulp.src('./src/pug/index.pug')
		.pipe(pug({
			pretty:true
		}))
		.pipe(gulp.dest(`src/pages`))
});
gulp.task('sass',()=> {
	return gulp.src('./src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest(`src/css`))
})

gulp.watch(`${__dirname}/src/pug/*.pug`,gulp.series('pug'))
gulp.watch(`${__dirname}/src/sass/*.scss`,gulp.series('sass'))
