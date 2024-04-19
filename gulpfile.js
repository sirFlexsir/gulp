
import gulp from "gulp";
import * as build from "./gulp/build.js";
import * as prodaction from "./gulp/prod.js";

// SVG
import svgsprite from "gulp-svg-sprite";

const spriteSettings = {
  mode: {
    symbol: {
      sprite: "../sprite.symbol.svg",
    },
  },
  shape: {
    transform: [
      {
        svgo: {
          js2svg: { indent: 4, pretty: true },
          plugins: [
            {
              name: "removeAttrs",
              params: {
                attrs: "(fill|stroke)",
              },
            },
          ],
        },
      },
    ],
  },
};

// **************************************************************

export function sprite() {
  return gulp
    .src("./src/img/svgicons/**/*.svg")
    .pipe(svgsprite(spriteSettings))
    .pipe(gulp.dest("./src/img/svgsprite/"));
}

export const prod = gulp.series(
  gulp.parallel(
    prodaction.html,
    prodaction.scss,
    prodaction.js,
    prodaction.img,
    prodaction.files,
    prodaction.fonts
  ),
  gulp.parallel(prodaction.serv)
);

export default gulp.series(
  build.cleanDist,
  gulp.parallel(
    build.html,
    build.scss,
    build.js,
    build.img,
    build.files,
    build.fonts
  ),
  gulp.parallel(build.serv, build.watch)
);
