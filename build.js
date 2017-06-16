({
    baseUrl: 'js/',
    out: 'js/main-built.js',

    /* DO NOT CHANGE THIS LINE (IT WILL BE USED BY GULP TASK TO GENERATE ALL MODULES FOR REQUREIJS) */
    include: ['main', 'requireLib'],
    /* DO NOT CHANGE ABOVE LINE */

    //optimizeAllPluginResources: true,
    fileExclusionRegExp: /^((r|build)\.js)$/,
    keepBuildDir: true,
    optimize: 'none', // <-- do not change this line, because it will be replaced by gulpfile for minify
    removeCombined: true,
    paths: {
        underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        backbonereactcomponent: 'libs/backbone/backbonereactcomponent',
        react: 'libs/react/react-with-addon-dev',
        JSXTransformer: 'JSXTransformer-modified-for-requirejxs',
        requireLib: 'require'
    },
    onBuildWrite: function (moduleName, path, singleContents) {
        return singleContents.replace(/jsx!/g, ''); //remove jsx! text in all js file to prevent using jsx compiler
    },
    onModuleBundleComplete: function (data) {
        var fs = nodeRequire("fs");

        for (var i = 0; i < data.included.length; i++) {
            var modulefile = data.included[i];
            //var fs = require('fs');
            fs.unlinkSync(modulefile);
        }

    },
    noBuildTxt: true,
    normalizeDirDefines: "skip"
})
