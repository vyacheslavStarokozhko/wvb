const {watch, src, dest, parallel, series} = require("gulp");
const sass = require("gulp-dart-sass");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const jsonToSass = require("gulp-json-data-to-sass");
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');


function fontsTofont(){
    return src("./src/static/img/*.{woff2,woff}")
        .pipe(dest("./src/static/img/fonts"))
}

function otfToTtf() {


    return src("./src/static/img/*.otf",{})
        .pipe(fonter({
            formats:['ttf']
        }))
        .pipe(dest("./src/static/img/"))





}

function ttfToWoff() {
    return src("./src/static/img/*.ttf",{})
        .pipe(ttf2woff2())
        .pipe(dest("./src/static/img/"))
}



function fontsStyles(){
    let fontsStyleFile = './src/scss/compile/_fonts.scss';





fs.readFile("./src/_data/upload_fonts.json", "utf8", (error, data) =>{
    if (error) {
        console.log(error);
        return;
    }
    var fontsFiles = JSON.parse(data)._fonts;
    // console.log(fontsFiles._fonts);

    var newFileOnly;
    for (var i = 0; i< fontsFiles.length; i++){
        // font_label
        // font_style
        // font_weight
        // font_url



        let currentFile = fontsFiles[i];
        let fontFileName = currentFile.font_url.split('/')[currentFile.font_url.split('/').length - 1].split('.')[0];

        // console.log('currentFile', currentFile);
        // console.log('fontFileName', fontFileName);


        if (newFileOnly !== fontFileName){

            let fontName = currentFile.font_label;
            let fontWeight = currentFile.font_weight;
            let fontStyle = currentFile.font_style;
            fs.writeFile(fontsStyleFile, '', () => {});

            fs.appendFile(fontsStyleFile,
                `@font-face { font-family: ${fontName}; font-weight: ${fontWeight}; font-style:${fontStyle};src: url("../img/fonts/${fontFileName}.woff2") format("woff2"),url("../img/fonts/${fontFileName}.woff") format("woff")}`,
                function (){}
            )
            newFileOnly = fontFileName
        }
    }
})
    return src('./src')
}

function jsonColorCss() {
    return src("./src/_data/styling/colors/colors.json").pipe(
        jsonToSass({
            sass: "./src/scss/vars/_color.scss",
            separator: "",
        })
    );
}


// breakpoints.json

function jsonSizingCss() {
    return src("./src/_data/styling/sizing/sizing.json").pipe(
        jsonToSass({
            sass: "./src/scss/vars/_sizing.scss",
            separator: "",
        })
    );
}


function jsonBreakpointsCss() {
    return src("./src/_data/styling/sizing/breakpoints.json").pipe(
        jsonToSass({
            sass: "./src/scss/vars/_breakpoints.scss",
            separator: "",
        })
    );
}

function jsonTypographyCss() {
    return src("./src/_data/styling/typography/*.json")
        .pipe(
            jsonToSass({
                sass: "./src/scss/vars/_typography.scss",
                prefix: '',
                suffix: '',
                separator: ''
            })
        )
}

function cssTask() {
    return src("./src/scss/*.scss", {allowEmpty: true})
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: "compressed"}))
        .on("error", sass.logError)
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./_site/static/css/"));
}

function jsTask() {
    return src('./src/static/js/*.js', {sourcemaps: true})
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write("."))
        .pipe(dest("./_site/static/js/"));
}
function fontsTask(){
    return src('./src/static/img/fonts/*.{woff,woff2}')
        .pipe(dest('./_site/static/img/fonts/'))
}

function watchFiles() {



    watch("./src/scss/**/*.scss", parallel(cssTask));
    // watch("./src/_data/styling/colors/upload_fonts.json", parallel(jsonFonts));
    watch("./src/_data/styling/colors/colors.json", parallel(jsonColorCss));
    watch("./src/_data/styling/sizing/sizing.json", parallel(jsonSizingCss));
    watch("./src/_data/styling/sizing/breakpoints.json", parallel(jsonBreakpointsCss));
    watch("./src/_data/styling/typography/*.json", parallel(jsonTypographyCss));
    watch("./src/static/js/*.js", parallel(jsTask));
}

exports.build = series(otfToTtf, ttfToWoff,fontsTofont,
    fontsStyles,
    jsonColorCss, jsonSizingCss,jsonBreakpointsCss, jsonTypographyCss, fontsTask,jsTask, cssTask);

exports.default = series(otfToTtf, ttfToWoff,fontsTofont,
    fontsStyles,
    jsonColorCss, jsonSizingCss,jsonBreakpointsCss, jsonTypographyCss, parallel( fontsTask, jsTask,cssTask, watchFiles));