var eslint = require('gulp-eslint'),
    gulp = require('gulp'),
    request = require('request'),
    //argv = require('yargs').argv,
    fs = require('fs'),
    //sass = require('gulp-sass'),
    ftp = require('vinyl-ftp'),
    xml2js = require('xml2js'),
    paths = {
        "buildsDir": "./js/builds",
        "distributions": [
            './js/highcharts.src.js', 
            './js/highmaps.src.js', 
            './js/highstock.src.js',
            './js/highcharts-3d.src.js', 
            './js/highcharts-more.src.js'
        ],
        
        "assemblies": [
            './js/highcharts.src.js', 
            './js/highstock.src.js',
            './js/highcharts-3d.src.js', 
            './js/highcharts-more.src.js', 
            './js/highmaps.src.js', 
            './js/modules/map.src.js',
            './js/modules/heatmap.src.js'
        ],
        "modules": ['./js/modules/*.js'],
        "parts": ['./js/parts/*.js'],
        "parts3D": ['./js/parts-3d/*.js'],
        "partsMap": ['./js/parts-map/*.js'],
        "partsMore": ['./js/parts-more/*.js'],
        "themes": ['./js/themes/*.js']
    };

/**
 * Look up in build.xml and concatenate the parts files
 */
function assemble(assemblies) {

    var xml = fs.readFileSync('./build.xml', 'utf8'),
        ret = [];

    xml2js.parseString(xml, function (err, result) {
        xml = result;
    });

    assemblies.forEach(function (assembly) {
        xml.project.target.forEach(function (target) {
            if (target.$.name === 'set.properties') {
                target.filelist.forEach(function (list) {
                    var partsDir = '',
                        tpl = '';
                    if (list.$.id === assembly + '.files') {
                        if (assembly == 'highchartsmore') {
                            partsDir = 'parts-more/';

                        } else if (assembly == 'highmaps') {
                            partsDir = '';
                        } else if (assembly == 'highstock') {
                            partsDir = '';
                        }

                        if (assembly == 'highcharts3d') {
                            partsDir = 'parts-3d/';
                        }

                        list.file.forEach(function (item) {
                            var file = fs.readFileSync('./js/' + partsDir + item.$.name, 'utf8');

                            file = file.replace(/\t/g, '    ');

                            // Indent all files so we can use jsLints whitespace
                            if (item.$.name.indexOf('Intro') === -1 && item.$.name.indexOf('Outro') === -1) {
                                file = file.replace(/\n/g, '\n    ');
                            }
                            tpl += file;
                        });

                        tpl = tpl.replace(/    [\r]?\n/g, '\n');

                        tpl = tpl.replace(
                            'http://code.highcharts.com@product.cdnpath@/@product.version@/modules/canvas-tools.js',
                            "http://code.highcharts.com/modules/canvas-tools.js"
                        );

                        ret.push(tpl);
                    }
                });
            };
        });
    });
    
    return ret;
}

    /*
    optimizeHighcharts = function (fs, path) {
        var wrapFile = './js/parts/Intro.js',
            WS = '\\s*',
            CM = ',',
            captureQuoted = "'([^']+)'",
            captureArray = "\\[(.*?)\\]",
            captureFunc = "(function[\\s\\S]*?\\})\\);((?=\\s*define)|\\s*$)",
            defineStatements = new RegExp('define\\(' + WS + captureQuoted + WS + CM + WS + captureArray + WS + CM + WS + captureFunc, 'g');
        fs.readFile(path, 'utf8', function (err, data) {
            var lines = data.split("\n"),
                wrap = fs.readFileSync(wrapFile, 'utf8');
            lines.forEach(function (line, i) {
                if (line.indexOf("define") !== -1) {
                    lines[i] = lines[i].replace(/\.\//g, ''); // Remove all beginnings of relative paths
                    lines[i] = lines[i].replace(/\//g, '_'); // Replace all forward slashes with underscore
                    lines[i] = lines[i].replace(/"/g, ''); // Remove all double quotes
                }
            });
            data = lines.join('\n'); // Concatenate lines
            data = data.replace(defineStatements, 'var $1 = ($3($2));'); // Replace define statement with a variable declaration
            wrap = wrap.replace(/.*@code.* /, data); // Insert code into UMD wrap
            fs.writeFile(path, wrap, 'utf8');
        });

    },
    bundleHighcharts = function (file) {
        var requirejs = require('requirejs'),
            fileName = file.slice(0, -3), // Remove file extension (.js) from name
            config = {
                baseUrl: './js/',
                name: 'builds/' + fileName,
                optimize: 'none',
                out: './js/' + file,
                onModuleBundleComplete: function (info) {
                    optimizeHighcharts(fs, info.path);
                }
            };

        requirejs.optimize(config, function (buildResponse) {
            console.log("Successfully build " + fileName);
        }, function(err) {
            console.log(err.originalError);
        });
    };

gulp.task('build', function () {
    var buildFiles = fs.readdirSync(paths.buildsDir);
    buildFiles.forEach(bundleHighcharts);
});

function doLint(paths) {
    return gulp.src(paths)
        .pipe(eslint(config))
        .pipe(eslint.formatEach())
        .pipe(eslint.failOnError());
}

gulp.task('lint', function () {
    var p = paths,
        files = argv.path ? p[argv.path] : p.distributions.concat(p.modules, p.parts, p.parts3D, p.partsMap, p.partsMore, p.themes);
    if (files) {
        doLint(files);
    } else {
        console.log(argv.path + " is not defined in paths.");
    }
});

gulp.task('styles', function () {
    var dir = './js/css/';

    gulp.src(dir + '*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(dir));
});
*/
gulp.task('lint', ['scripts'], function () {
    return gulp.src(paths.assemblies.concat(paths.modules))

        .pipe(eslint({
            envs: ['browser'],

            globals: {
                'Highcharts': true,
                'HighchartsAdapter': true
            },

            // List of rules at http://eslint.org/docs/rules/
            rules: {
                'camelcase': [2, {"properties": "always"}],
                'comma-dangle': [2, 'never'],
                'consistent-return': 0,
                'func-style': 0,
                'guard-for-in': 0, // @todo: Make the each function handle objects, then run a guarded for-in there.
                'indent': 0, // @todo: Before release HC5, do a pure whitespace commit
                'new-cap': 0, // The ill-named Color object. Rewrite for HC5?
                'no-alert': 2,
                'no-console': 2,
                'no-debugger': 2,
                'no-empty': 0, // The noop function
                'no-func-assign': 0, // Setting local functions to null on Label.destoy
                'no-invalid-this': 0,
                'no-multi-spaces': 0,
                'no-nested-ternary': 0,
                'no-new': 0,
                'no-shadow': 0, // Same variable names in nested scopes. @todo: Fix this, it is useful
                'no-trailing-spaces': 0,
                'no-undefined': 0,
                'no-underscore-dangle': 0,
                'space-before-function-paren': [2, {"anonymous": "always", "named": "never"}], // JSLint style
                'quotes': [2, 'single'],
                'spaced-comment': 0,
                'require-jsdoc': 0,
                'strict': 0,
                'valid-jsdoc': 0
                //"one-var": [1, "always"] // @todo: Before launch HC5
            }
        }))
        .pipe(eslint.failOnError())
        .pipe(eslint.formatEach());
        
});

// Watch changes to CSS files
gulp.task('default',function () {
    //gulp.watch('./js/css/*.scss',['styles']);
    gulp.watch('./js/*/*.js', ['scripts']);
});


gulp.task('ftp', function () {
    fs.readFile('./git-ignore-me.properties', 'utf8', function (err, lines) {
        var config = {};
        lines.split('\n').forEach(function (line) {
            line = line.split('=');
            if (line[0]) {
                config[line[0]] = line[1];
            }
        });
        
        var conn = ftp.create({
            host: config['ftp.host'],
            user: config['ftp.user'],
            password: config['ftp.password']
        });

        var globs = paths.distributions.concat(paths.modules);

        return gulp.src(globs, { base: './js', buffer: false })
            .pipe(conn.newer(config['ftp.dest']))
            .pipe(conn.dest(config['ftp.dest']));
    });
});

gulp.task('ftp-watch', function () {
    gulp.watch('./js/*/*.js', ['scripts', 'ftp']);
});

/**
 * Proof of concept to parse super code. Move this logic into the standard build when ready.
 */
gulp.task('scripts', function () {
    var codes = [],
        prods = [],
        assemblies;


    /**
     * Micro-optimize code based on the build object.
     */
    function preprocess(tpl, build) {
        // Windows newlines
        tpl = tpl.replace(/\r\n/g, '\n');

        /*
        // Escape double quotes and backslashes, to be reinserted after parsing
        tpl = tpl.replace(/"/g, '___doublequote___');
        tpl = tpl.replace(/\\/g, '\\\\');


        // Prepare newlines
        tpl = tpl.replace(/\n/g, '\\n');

        // Start supercode output, start first output string
        tpl = tpl.replace(/^/, 'var s = "');
        // Start supercode block, closes output string
        tpl = tpl.replace(/\/\*=\s?/g, '";\n');
        // End of supercode block, starts output string
        tpl = tpl.replace(/=\*\//g, '\ns += "');
        // End supercode output, end last output string
        tpl = tpl.replace(/$/, '";\nreturn s;');

        // Uncomment to preview generated supercode
        // fs.writeFile('temp.js', tpl, 'utf8');

        // The evaluation function for the ready built supercode
        func = new Function('build', tpl);

        tpl = func(build);
        tpl = tpl.replace(/___doublequote___/g, '"');

        // Collect trailing commas left when the tamplate engine has removed
        // object literal properties or array items
        tpl = tpl.replace(/,(\s*(\]|\}))/g, '$1');
        */

        return tpl;
    }

    function addVersion(tpl, product) {
        return tpl
            .replace(/@product\.name@/g, product.name)
            .replace(/@product\.version@/g, product.version)
            .replace(/@product\.date@/g, product.date)
            .replace(/@product\.cdnpath@/g, product.cdnpath);
    }


    // Parse the build properties files into a structure
    function getProducts() {
        var lines = fs.readFileSync('./build.properties', 'utf8'),
            products = {};
            
        lines.split('\n').forEach(function (line) {
            var prod, key;
            line = line.replace(/\r/, '');
            if (line.indexOf('#') !== 0 && line.indexOf('=') !== -1) {
                line = line.split('=');
                key = line[0].split('.');
                prod = key[0];
                key = key[2];
                if (!products[prod]) {
                    products[prod] = {};
                }
                products[prod][key] = line[1];
            }
        });
        return products;
    }

    var products = getProducts();

    // Avoid gulping files in old branch after checkout
    /*
    if (products.highcharts.version.indexOf('4') === 0) {
        return;
    }
    */
    paths.assemblies.forEach(function (path) {

        var prod,
            inpath = path
            .replace('./js/', '')
            .replace('.src.js', '')
            .replace('-', '');

        // highcharts, highmaps or highstock
        if (inpath === 'highmaps' || inpath === 'highstock') {
            prod = inpath;
        } else {
            prod = 'highcharts';
        }

        if (inpath === 'modules/heatmap') {
            inpath = 'heatmap';
        } else if (inpath === 'modules/map') {
            inpath = 'maps';
            prod = 'highmaps';
        }

        // Load through the local debug.php (todo on HC5: require)
        codes.push(inpath);
        prods.push(prod);
    });


    assemblies = assemble(codes);

    
    // Loop over the source files
    assemblies.forEach(function (tpl, i) {
        var prod = prods[i],
            path = paths.assemblies[i],
            file;
        
        // Unspecified date, use current
        if (!products[prod].date) {
            products[prod].date = (new Date()).toISOString().substr(0, 10);
        }
        tpl = addVersion(tpl, products[prod]);

        file = fs.readFileSync(path, 'utf8');

        // To avoid noisy commits, change dates if there are actual changes in the contents of the file
        if (file.replace(/\([0-9]{4}-[0-9]{2}-[0-9]{2}\)/g, '()') !== tpl.replace(/\([0-9]{4}-[0-9]{2}-[0-9]{2}\)/g, '()')) {

            // Create the classic file
            fs.writeFileSync(
                path,
                preprocess(tpl, {
                    classic: true
                }), 
                'utf8'
            );

            // Create the unstyled file
            /*
            fs.writeFileSync(
                path.replace('.src.js', '.unstyled.src.js'), 
                preprocess(tpl, {
                    classic: false
                }), 
                'utf8'
            );
            */
        }
    });

    // Special case
    var files = ['./lib/canvg-1.1/rgbcolor.js', './lib/canvg-1.1/canvg.js', './js/modules/canvgrenderer-extended.src.js'],
        js = '';

    function addFile(i, callback) {
        var file = fs.readFileSync(files[i], 'utf8');

        js += file;
        if (i + 1 < files.length) {
            addFile(i + 1, callback);
        } else if (callback) {
            callback();
        }
    }

    addFile(0, function () {
        js = addVersion(js, products.highcharts);
        fs.writeFileSync('./build/canvas-tools.src.js', js, 'utf8');
    });
});