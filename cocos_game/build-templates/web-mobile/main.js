

window.URL_GET = '';
window.getUrl = function() {

    return window.URL_GET;
}

window.boot = function () {
    var settings = window._CCSettings;
    window._CCSettings = undefined;
    var onProgress = null;
    
    var RESOURCES = cc.AssetManager.BuiltinBundleName.RESOURCES;
    var INTERNAL = cc.AssetManager.BuiltinBundleName.INTERNAL;
    var MAIN = cc.AssetManager.BuiltinBundleName.MAIN;
    function setLoadingDisplay () {
        // Loading splash scene
        var splash = document.getElementById('splash');
        var progressBar = splash.querySelector('.progress-bar span');
        onProgress = function (finish, total) {
            var percent = 100 * finish / total;
            if (progressBar) {
                progressBar.style.width = percent.toFixed(2) + '%';
            }
        };
        splash.style.display = 'block';
        progressBar.style.width = '0%';

        cc.director.once(cc.Director.EVENT_AFTER_SCENE_LAUNCH, function () {
            splash.style.display = 'none';
        });
    }

    var onStart = function () {

        cc.view.enableRetina(true);
        cc.view.resizeWithBrowserSize(true);

        if (cc.sys.isBrowser) {
            setLoadingDisplay();
        }

        if (cc.sys.isMobile) {
            if (settings.orientation === 'landscape') {
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            }
            else if (settings.orientation === 'portrait') {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
            }
            cc.view.enableAutoFullScreen([
                cc.sys.BROWSER_TYPE_BAIDU,
                cc.sys.BROWSER_TYPE_BAIDU_APP,
                cc.sys.BROWSER_TYPE_WECHAT,
                cc.sys.BROWSER_TYPE_MOBILE_QQ,
                cc.sys.BROWSER_TYPE_MIUI,
                cc.sys.BROWSER_TYPE_HUAWEI,
                cc.sys.BROWSER_TYPE_UC,
            ].indexOf(cc.sys.browserType) < 0);
        }

        // Limit downloading max concurrent task to 2,
        // more tasks simultaneously may cause performance draw back on some android system / browsers.
        // You can adjust the number based on your own test result, you have to set it before any loading process to take effect.
        if (cc.sys.isBrowser && cc.sys.os === cc.sys.OS_ANDROID) {
            cc.assetManager.downloader.maxConcurrency = 2;
            cc.assetManager.downloader.maxRequestsPerFrame = 2;
        }

        var launchScene = settings.launchScene;
        var bundle = cc.assetManager.bundles.find(function (b) {
            return b.getSceneInfo(launchScene);
        });
        
        bundle.loadScene(launchScene, null, onProgress,
            function (err, scene) {
                if (!err) {
                    cc.director.runSceneImmediate(scene);
                    if (cc.sys.isBrowser) {
                        // show canvas
                        var canvas = document.getElementById('GameCanvas');
                        canvas.style.visibility = '';
                        var div = document.getElementById('GameDiv');
                        if (div) {
                            div.style.backgroundImage = '';
                        }
                        console.log('Success to load scene: ' + launchScene);
                    }
                }
            }
        );

    };

    var option = {
        id: 'GameCanvas',
        debugMode: settings.debug ? cc.debug.DebugMode.INFO : cc.debug.DebugMode.ERROR,
        showFPS: settings.debug,
        frameRate: 60,
        groupList: settings.groupList,
        collisionMatrix: settings.collisionMatrix,
    };

    cc.assetManager.init({ 
        bundleVers: settings.bundleVers,
        remoteBundles: settings.remoteBundles,
        server: settings.server
    });
    
    var bundleRoot = [INTERNAL];
    settings.hasResourcesBundle && bundleRoot.push(RESOURCES);

    var count = 0;
    function cb (err) {
        if (err) return console.error(err.message, err.stack);
        count++;
        if (count === bundleRoot.length + 1) {
            cc.assetManager.loadBundle(MAIN, function (err) {
                if (!err) cc.game.run(option, onStart);
            });
        }
    }

    cc.assetManager.loadScript(settings.jsList.map(function (x) { return 'src/' + x;}), cb);

    for (var i = 0; i < bundleRoot.length; i++) {
        cc.assetManager.loadBundle(bundleRoot[i], cb);
    }

    fetch('config.json').then(response => response.json()).then(jsonResponse => { console.log('res: ', jsonResponse); window.URL_GET = jsonResponse }) 
};

if (window.jsb) {
    var isRuntime = (typeof loadRuntime === 'function');
    if (isRuntime) {
        require('src/settings.js');
        require('src/cocos2d-runtime.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/engine/index.js');
    }
    else {
        require('src/settings.js');
        require('src/cocos2d-jsb.js');
        if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
            require('src/physics.js');
        }
        require('jsb-adapter/jsb-engine.js');
    }

    cc.macro.CLEANUP_IMAGE_CACHE = true;
    window.boot();
}

!function(exports){"use strict";var IS_BOT_REGEXP=new RegExp("^.*("+["\\+https:\\/\\/developers.google.com\\/\\+\\/web\\/snippet\\/","googlebot","baiduspider","gurujibot","yandexbot","slurp","msnbot","bingbot","facebookexternalhit","linkedinbot","twitterbot","slackbot","telegrambot","applebot","pingdom","tumblr ","Embedly","spbot"].join("|")+").*$"),DeviceUUID=function(options){options=options||{};var defOptions={version:!1,language:!1,platform:!0,os:!0,pixelDepth:!0,colorDepth:!0,resolution:!1,isAuthoritative:!0,silkAccelerated:!0,isKindleFire:!0,isDesktop:!0,isMobile:!0,isTablet:!0,isWindows:!0,isLinux:!0,isLinux64:!0,isChromeOS:!0,isMac:!0,isiPad:!0,isiPhone:!0,isiPod:!0,isAndroid:!0,isSamsung:!0,isSmartTV:!0,isRaspberry:!0,isBlackberry:!0,isTouchScreen:!0,isOpera:!1,isIE:!1,isEdge:!1,isIECompatibilityMode:!1,isSafari:!1,isFirefox:!1,isWebkit:!1,isChrome:!1,isKonqueror:!1,isOmniWeb:!1,isSeaMonkey:!1,isFlock:!1,isAmaya:!1,isPhantomJS:!1,isEpiphany:!1,source:!1,cpuCores:!1};for(var key in options)options.hasOwnProperty(key)&&void 0!==defOptions[key]&&(defOptions[key]=options[key]);return this.options=defOptions,this.version="1.0.0",this._Versions={Edge:/Edge\/([\d\w\.\-]+)/i,Firefox:/firefox\/([\d\w\.\-]+)/i,IE:/msie\s([\d\.]+[\d])|trident\/\d+\.\d+;.*[rv:]+(\d+\.\d)/i,Chrome:/chrome\/([\d\w\.\-]+)/i,Chromium:/(?:chromium|crios)\/([\d\w\.\-]+)/i,Safari:/version\/([\d\w\.\-]+)/i,Opera:/version\/([\d\w\.\-]+)|OPR\/([\d\w\.\-]+)/i,Ps3:/([\d\w\.\-]+)\)\s*$/i,Psp:/([\d\w\.\-]+)\)?\s*$/i,Amaya:/amaya\/([\d\w\.\-]+)/i,SeaMonkey:/seamonkey\/([\d\w\.\-]+)/i,OmniWeb:/omniweb\/v([\d\w\.\-]+)/i,Flock:/flock\/([\d\w\.\-]+)/i,Epiphany:/epiphany\/([\d\w\.\-]+)/i,WinJs:/msapphost\/([\d\w\.\-]+)/i,PhantomJS:/phantomjs\/([\d\w\.\-]+)/i,UC:/UCBrowser\/([\d\w\.]+)/i},this._Browsers={Edge:/edge/i,Amaya:/amaya/i,Konqueror:/konqueror/i,Epiphany:/epiphany/i,SeaMonkey:/seamonkey/i,Flock:/flock/i,OmniWeb:/omniweb/i,Chromium:/chromium|crios/i,Chrome:/chrome/i,Safari:/safari/i,IE:/msie|trident/i,Opera:/opera|OPR/i,PS3:/playstation 3/i,PSP:/playstation portable/i,Firefox:/firefox/i,WinJs:/msapphost/i,PhantomJS:/phantomjs/i,UC:/UCBrowser/i},this._OS={Windows10:/windows nt 10\.0/i,Windows81:/windows nt 6\.3/i,Windows8:/windows nt 6\.2/i,Windows7:/windows nt 6\.1/i,UnknownWindows:/windows nt 6\.\d+/i,WindowsVista:/windows nt 6\.0/i,Windows2003:/windows nt 5\.2/i,WindowsXP:/windows nt 5\.1/i,Windows2000:/windows nt 5\.0/i,WindowsPhone8:/windows phone 8\./,OSXCheetah:/os x 10[._]0/i,OSXPuma:/os x 10[._]1(\D|$)/i,OSXJaguar:/os x 10[._]2/i,OSXPanther:/os x 10[._]3/i,OSXTiger:/os x 10[._]4/i,OSXLeopard:/os x 10[._]5/i,OSXSnowLeopard:/os x 10[._]6/i,OSXLion:/os x 10[._]7/i,OSXMountainLion:/os x 10[._]8/i,OSXMavericks:/os x 10[._]9/i,OSXYosemite:/os x 10[._]10/i,OSXElCapitan:/os x 10[._]11/i,OSXSierra:/os x 10[._]12/i,Mac:/os x/i,Linux:/linux/i,Linux64:/linux x86_64/i,ChromeOS:/cros/i,Wii:/wii/i,PS3:/playstation 3/i,PSP:/playstation portable/i,iPad:/\(iPad.*os (\d+)[._](\d+)/i,iPhone:/\(iPhone.*os (\d+)[._](\d+)/i,Bada:/Bada\/(\d+)\.(\d+)/i,Curl:/curl\/(\d+)\.(\d+)\.(\d+)/i},this._Platform={Windows:/windows nt/i,WindowsPhone:/windows phone/i,Mac:/macintosh/i,Linux:/linux/i,Wii:/wii/i,Playstation:/playstation/i,iPad:/ipad/i,iPod:/ipod/i,iPhone:/iphone/i,Android:/android/i,Blackberry:/blackberry/i,Samsung:/samsung/i,Curl:/curl/i},this.DefaultAgent={isAuthoritative:!0,isMobile:!1,isTablet:!1,isiPad:!1,isiPod:!1,isiPhone:!1,isAndroid:!1,isBlackberry:!1,isOpera:!1,isIE:!1,isEdge:!1,isIECompatibilityMode:!1,isSafari:!1,isFirefox:!1,isWebkit:!1,isChrome:!1,isKonqueror:!1,isOmniWeb:!1,isSeaMonkey:!1,isFlock:!1,isAmaya:!1,isPhantomJS:!1,isEpiphany:!1,isDesktop:!1,isWindows:!1,isLinux:!1,isLinux64:!1,isMac:!1,isChromeOS:!1,isBada:!1,isSamsung:!1,isRaspberry:!1,isBot:!1,isCurl:!1,isAndroidTablet:!1,isWinJs:!1,isKindleFire:!1,isSilk:!1,isCaptive:!1,isSmartTV:!1,isUC:!1,isTouchScreen:!1,silkAccelerated:!1,colorDepth:-1,pixelDepth:-1,resolution:[],cpuCores:-1,language:"unknown",browser:"unknown",version:"unknown",os:"unknown",platform:"unknown",geoIp:{},source:"",hashInt:function(string){var i,len,hash=0;if(0===string.length)return hash;for(i=0,len=string.length;i<len;i++)hash=(hash<<5)-hash+string.charCodeAt(i),hash|=0;return hash},hashMD5:function(string){function rotateLeft(lValue,iShiftBits){return lValue<<iShiftBits|lValue>>>32-iShiftBits}function addUnsigned(lX,lY){var lX4,lY4,lX8,lY8,lResult;return lX8=2147483648&lX,lY8=2147483648&lY,lResult=(1073741823&lX)+(1073741823&lY),(lX4=1073741824&lX)&(lY4=1073741824&lY)?2147483648^lResult^lX8^lY8:lX4|lY4?1073741824&lResult?3221225472^lResult^lX8^lY8:1073741824^lResult^lX8^lY8:lResult^lX8^lY8}function gFF(a,b,c,d,x,s,ac){return addUnsigned(rotateLeft(a=addUnsigned(a,addUnsigned(addUnsigned(function(x,y,z){return x&y|~x&z}(b,c,d),x),ac)),s),b)}function gGG(a,b,c,d,x,s,ac){return addUnsigned(rotateLeft(a=addUnsigned(a,addUnsigned(addUnsigned(function(x,y,z){return x&z|y&~z}(b,c,d),x),ac)),s),b)}function gHH(a,b,c,d,x,s,ac){return addUnsigned(rotateLeft(a=addUnsigned(a,addUnsigned(addUnsigned(function(x,y,z){return x^y^z}(b,c,d),x),ac)),s),b)}function gII(a,b,c,d,x,s,ac){return addUnsigned(rotateLeft(a=addUnsigned(a,addUnsigned(addUnsigned(function(x,y,z){return y^(x|~z)}(b,c,d),x),ac)),s),b)}function wordToHex(lValue){var lCount,wordToHexValue="",wordToHexValueTemp="";for(lCount=0;lCount<=3;lCount++)wordToHexValue+=(wordToHexValueTemp="0"+(lValue>>>8*lCount&255).toString(16)).substr(wordToHexValueTemp.length-2,2);return wordToHexValue}var x,k,AA,BB,CC,DD,a,b,c,d;for(x=function(string){for(var lWordCount,lMessageLength=string.length,lNumberOfWordsTemp1=lMessageLength+8,lNumberOfWords=16*((lNumberOfWordsTemp1-lNumberOfWordsTemp1%64)/64+1),lWordArray=new Array(lNumberOfWords-1),lBytePosition=0,lByteCount=0;lByteCount<lMessageLength;)lBytePosition=lByteCount%4*8,lWordArray[lWordCount=(lByteCount-lByteCount%4)/4]=lWordArray[lWordCount]|string.charCodeAt(lByteCount)<<lBytePosition,lByteCount++;return lBytePosition=lByteCount%4*8,lWordArray[lWordCount=(lByteCount-lByteCount%4)/4]=lWordArray[lWordCount]|128<<lBytePosition,lWordArray[lNumberOfWords-2]=lMessageLength<<3,lWordArray[lNumberOfWords-1]=lMessageLength>>>29,lWordArray}(string=function(string){string=string.replace(/\r\n/g,"\n");for(var utftext="",n=0;n<string.length;n++){var c=string.charCodeAt(n);c<128?utftext+=String.fromCharCode(c):(127<c&&c<2048?utftext+=String.fromCharCode(c>>6|192):(utftext+=String.fromCharCode(c>>12|224),utftext+=String.fromCharCode(c>>6&63|128)),utftext+=String.fromCharCode(63&c|128))}return utftext}(string)),a=1732584193,b=4023233417,c=2562383102,d=271733878,k=0;k<x.length;k+=16)b=gII(b=gII(b=gII(b=gII(b=gHH(b=gHH(b=gHH(b=gHH(b=gGG(b=gGG(b=gGG(b=gGG(b=gFF(b=gFF(b=gFF(b=gFF(BB=b,c=gFF(CC=c,d=gFF(DD=d,a=gFF(AA=a,b,c,d,x[k+0],7,3614090360),b,c,x[k+1],12,3905402710),a,b,x[k+2],17,606105819),d,a,x[k+3],22,3250441966),c=gFF(c,d=gFF(d,a=gFF(a,b,c,d,x[k+4],7,4118548399),b,c,x[k+5],12,1200080426),a,b,x[k+6],17,2821735955),d,a,x[k+7],22,4249261313),c=gFF(c,d=gFF(d,a=gFF(a,b,c,d,x[k+8],7,1770035416),b,c,x[k+9],12,2336552879),a,b,x[k+10],17,4294925233),d,a,x[k+11],22,2304563134),c=gFF(c,d=gFF(d,a=gFF(a,b,c,d,x[k+12],7,1804603682),b,c,x[k+13],12,4254626195),a,b,x[k+14],17,2792965006),d,a,x[k+15],22,1236535329),c=gGG(c,d=gGG(d,a=gGG(a,b,c,d,x[k+1],5,4129170786),b,c,x[k+6],9,3225465664),a,b,x[k+11],14,643717713),d,a,x[k+0],20,3921069994),c=gGG(c,d=gGG(d,a=gGG(a,b,c,d,x[k+5],5,3593408605),b,c,x[k+10],9,38016083),a,b,x[k+15],14,3634488961),d,a,x[k+4],20,3889429448),c=gGG(c,d=gGG(d,a=gGG(a,b,c,d,x[k+9],5,568446438),b,c,x[k+14],9,3275163606),a,b,x[k+3],14,4107603335),d,a,x[k+8],20,1163531501),c=gGG(c,d=gGG(d,a=gGG(a,b,c,d,x[k+13],5,2850285829),b,c,x[k+2],9,4243563512),a,b,x[k+7],14,1735328473),d,a,x[k+12],20,2368359562),c=gHH(c,d=gHH(d,a=gHH(a,b,c,d,x[k+5],4,4294588738),b,c,x[k+8],11,2272392833),a,b,x[k+11],16,1839030562),d,a,x[k+14],23,4259657740),c=gHH(c,d=gHH(d,a=gHH(a,b,c,d,x[k+1],4,2763975236),b,c,x[k+4],11,1272893353),a,b,x[k+7],16,4139469664),d,a,x[k+10],23,3200236656),c=gHH(c,d=gHH(d,a=gHH(a,b,c,d,x[k+13],4,681279174),b,c,x[k+0],11,3936430074),a,b,x[k+3],16,3572445317),d,a,x[k+6],23,76029189),c=gHH(c,d=gHH(d,a=gHH(a,b,c,d,x[k+9],4,3654602809),b,c,x[k+12],11,3873151461),a,b,x[k+15],16,530742520),d,a,x[k+2],23,3299628645),c=gII(c,d=gII(d,a=gII(a,b,c,d,x[k+0],6,4096336452),b,c,x[k+7],10,1126891415),a,b,x[k+14],15,2878612391),d,a,x[k+5],21,4237533241),c=gII(c,d=gII(d,a=gII(a,b,c,d,x[k+12],6,1700485571),b,c,x[k+3],10,2399980690),a,b,x[k+10],15,4293915773),d,a,x[k+1],21,2240044497),c=gII(c,d=gII(d,a=gII(a,b,c,d,x[k+8],6,1873313359),b,c,x[k+15],10,4264355552),a,b,x[k+6],15,2734768916),d,a,x[k+13],21,1309151649),c=gII(c,d=gII(d,a=gII(a,b,c,d,x[k+4],6,4149444226),b,c,x[k+11],10,3174756917),a,b,x[k+2],15,718787259),d,a,x[k+9],21,3951481745),a=addUnsigned(a,AA),b=addUnsigned(b,BB),c=addUnsigned(c,CC),d=addUnsigned(d,DD);return(wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase()}},this.Agent={},this.getBrowser=function(string){switch(!0){case this._Browsers.Edge.test(string):return this.Agent.isEdge=!0,"Edge";case this._Browsers.PhantomJS.test(string):return this.Agent.isPhantomJS=!0,"PhantomJS";case this._Browsers.Konqueror.test(string):return this.Agent.isKonqueror=!0,"Konqueror";case this._Browsers.Amaya.test(string):return this.Agent.isAmaya=!0,"Amaya";case this._Browsers.Epiphany.test(string):return this.Agent.isEpiphany=!0,"Epiphany";case this._Browsers.SeaMonkey.test(string):return this.Agent.isSeaMonkey=!0,"SeaMonkey";case this._Browsers.Flock.test(string):return this.Agent.isFlock=!0,"Flock";case this._Browsers.OmniWeb.test(string):return this.Agent.isOmniWeb=!0,"OmniWeb";case this._Browsers.Opera.test(string):return this.Agent.isOpera=!0,"Opera";case this._Browsers.Chromium.test(string):return this.Agent.isChrome=!0,"Chromium";case this._Browsers.Chrome.test(string):return this.Agent.isChrome=!0,"Chrome";case this._Browsers.Safari.test(string):return this.Agent.isSafari=!0,"Safari";case this._Browsers.WinJs.test(string):return this.Agent.isWinJs=!0,"WinJs";case this._Browsers.IE.test(string):return this.Agent.isIE=!0,"IE";case this._Browsers.PS3.test(string):return"ps3";case this._Browsers.PSP.test(string):return"psp";case this._Browsers.Firefox.test(string):return this.Agent.isFirefox=!0,"Firefox";case this._Browsers.UC.test(string):return this.Agent.isUC=!0,"UCBrowser";default:return 0!==string.indexOf("Mozilla")&&/^([\d\w\-\.]+)\/[\d\w\.\-]+/i.test(string)?(this.Agent.isAuthoritative=!1,RegExp.$1):"unknown"}},this.getBrowserVersion=function(string){switch(this.Agent.browser){case"Edge":if(this._Versions.Edge.test(string))return RegExp.$1;break;case"PhantomJS":if(this._Versions.PhantomJS.test(string))return RegExp.$1;break;case"Chrome":if(this._Versions.Chrome.test(string))return RegExp.$1;break;case"Chromium":if(this._Versions.Chromium.test(string))return RegExp.$1;break;case"Safari":if(this._Versions.Safari.test(string))return RegExp.$1;break;case"Opera":if(this._Versions.Opera.test(string))return RegExp.$1?RegExp.$1:RegExp.$2;break;case"Firefox":if(this._Versions.Firefox.test(string))return RegExp.$1;break;case"WinJs":if(this._Versions.WinJs.test(string))return RegExp.$1;break;case"IE":if(this._Versions.IE.test(string))return RegExp.$2?RegExp.$2:RegExp.$1;break;case"ps3":if(this._Versions.Ps3.test(string))return RegExp.$1;break;case"psp":if(this._Versions.Psp.test(string))return RegExp.$1;break;case"Amaya":if(this._Versions.Amaya.test(string))return RegExp.$1;break;case"Epiphany":if(this._Versions.Epiphany.test(string))return RegExp.$1;break;case"SeaMonkey":if(this._Versions.SeaMonkey.test(string))return RegExp.$1;break;case"Flock":if(this._Versions.Flock.test(string))return RegExp.$1;break;case"OmniWeb":if(this._Versions.OmniWeb.test(string))return RegExp.$1;break;case"UCBrowser":if(this._Versions.UC.test(string))return RegExp.$1;break;default:if("unknown"!==this.Agent.browser&&new RegExp(this.Agent.browser+"[\\/ ]([\\d\\w\\.\\-]+)","i").test(string))return RegExp.$1}},this.getOS=function(string){switch(!0){case this._OS.WindowsVista.test(string):return this.Agent.isWindows=!0,"Windows Vista";case this._OS.Windows7.test(string):return this.Agent.isWindows=!0,"Windows 7";case this._OS.Windows8.test(string):return this.Agent.isWindows=!0,"Windows 8";case this._OS.Windows81.test(string):return this.Agent.isWindows=!0,"Windows 8.1";case this._OS.Windows10.test(string):return this.Agent.isWindows=!0,"Windows 10.0";case this._OS.Windows2003.test(string):return this.Agent.isWindows=!0,"Windows 2003";case this._OS.WindowsXP.test(string):return this.Agent.isWindows=!0,"Windows XP";case this._OS.Windows2000.test(string):return this.Agent.isWindows=!0,"Windows 2000";case this._OS.WindowsPhone8.test(string):return"Windows Phone 8";case this._OS.Linux64.test(string):return this.Agent.isLinux=!0,this.Agent.isLinux64=!0,"Linux 64";case this._OS.Linux.test(string):return this.Agent.isLinux=!0,"Linux";case this._OS.ChromeOS.test(string):return this.Agent.isChromeOS=!0,"Chrome OS";case this._OS.Wii.test(string):return"Wii";case this._OS.PS3.test(string):case this._OS.PSP.test(string):return"Playstation";case this._OS.OSXCheetah.test(string):return this.Agent.isMac=!0,"OS X Cheetah";case this._OS.OSXPuma.test(string):return this.Agent.isMac=!0,"OS X Puma";case this._OS.OSXJaguar.test(string):return this.Agent.isMac=!0,"OS X Jaguar";case this._OS.OSXPanther.test(string):return this.Agent.isMac=!0,"OS X Panther";case this._OS.OSXTiger.test(string):return this.Agent.isMac=!0,"OS X Tiger";case this._OS.OSXLeopard.test(string):return this.Agent.isMac=!0,"OS X Leopard";case this._OS.OSXSnowLeopard.test(string):return this.Agent.isMac=!0,"OS X Snow Leopard";case this._OS.OSXLion.test(string):return this.Agent.isMac=!0,"OS X Lion";case this._OS.OSXMountainLion.test(string):return this.Agent.isMac=!0,"OS X Mountain Lion";case this._OS.OSXMavericks.test(string):return this.Agent.isMac=!0,"OS X Mavericks";case this._OS.OSXYosemite.test(string):return this.Agent.isMac=!0,"OS X Yosemite";case this._OS.OSXElCapitan.test(string):return this.Agent.isMac=!0,"OS X El Capitan";case this._OS.OSXSierra.test(string):return this.Agent.isMac=!0,"macOS Sierra";case this._OS.Mac.test(string):return this.Agent.isMac=!0,"OS X";case this._OS.iPad.test(string):return this.Agent.isiPad=!0,string.match(this._OS.iPad)[0].replace("_",".");case this._OS.iPhone.test(string):return this.Agent.isiPhone=!0,string.match(this._OS.iPhone)[0].replace("_",".");case this._OS.Bada.test(string):return this.Agent.isBada=!0,"Bada";case this._OS.Curl.test(string):return this.Agent.isCurl=!0,"Curl";default:return"unknown"}},this.getPlatform=function(string){switch(!0){case this._Platform.Windows.test(string):return"Microsoft Windows";case this._Platform.WindowsPhone.test(string):return this.Agent.isWindowsPhone=!0,"Microsoft Windows Phone";case this._Platform.Mac.test(string):return"Apple Mac";case this._Platform.Curl.test(string):return"Curl";case this._Platform.Android.test(string):return this.Agent.isAndroid=!0,"Android";case this._Platform.Blackberry.test(string):return this.Agent.isBlackberry=!0,"Blackberry";case this._Platform.Linux.test(string):return"Linux";case this._Platform.Wii.test(string):return"Wii";case this._Platform.Playstation.test(string):return"Playstation";case this._Platform.iPad.test(string):return this.Agent.isiPad=!0,"iPad";case this._Platform.iPod.test(string):return this.Agent.isiPod=!0,"iPod";case this._Platform.iPhone.test(string):return this.Agent.isiPhone=!0,"iPhone";case this._Platform.Samsung.test(string):return this.Agent.isiSamsung=!0,"Samsung";default:return"unknown"}},this.testCompatibilityMode=function(){var ua=this;if(this.Agent.isIE&&/Trident\/(\d)\.0/i.test(ua.Agent.source)){var tridentVersion=parseInt(RegExp.$1,10),version=parseInt(ua.Agent.version,10);7===version&&7===tridentVersion&&(ua.Agent.isIECompatibilityMode=!0,ua.Agent.version=11),7===version&&6===tridentVersion&&(ua.Agent.isIECompatibilityMode=!0,ua.Agent.version=10),7===version&&5===tridentVersion&&(ua.Agent.isIECompatibilityMode=!0,ua.Agent.version=9),7===version&&4===tridentVersion&&(ua.Agent.isIECompatibilityMode=!0,ua.Agent.version=8)}},this.testSilk=function(){switch(!0){case new RegExp("silk","gi").test(this.Agent.source):this.Agent.isSilk=!0}return/Silk-Accelerated=true/gi.test(this.Agent.source)&&(this.Agent.SilkAccelerated=!0),!!this.Agent.isSilk&&"Silk"},this.testKindleFire=function(){var ua=this;switch(!0){case/KFOT/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire";case/KFTT/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HD";case/KFJWI/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HD 8.9";case/KFJWA/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HD 8.9 4G";case/KFSOWI/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HD 7";case/KFTHWI/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HDX 7";case/KFTHWA/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HDX 7 4G";case/KFAPWI/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HDX 8.9";case/KFAPWA/gi.test(ua.Agent.source):return this.Agent.isKindleFire=!0,"Kindle Fire HDX 8.9 4G";default:return!1}},this.testCaptiveNetwork=function(){switch(!0){case/CaptiveNetwork/gi.test(this.Agent.source):return this.Agent.isCaptive=!0,this.Agent.isMac=!0,this.Agent.platform="Apple Mac","CaptiveNetwork";default:return!1}},this.testMobile=function(){var ua=this;switch(!0){case ua.Agent.isWindows:case ua.Agent.isLinux:case ua.Agent.isMac:case ua.Agent.isChromeOS:ua.Agent.isDesktop=!0;break;case ua.Agent.isAndroid:case ua.Agent.isSamsung:ua.Agent.isMobile=!0,ua.Agent.isDesktop=!1}switch(!0){case ua.Agent.isiPad:case ua.Agent.isiPod:case ua.Agent.isiPhone:case ua.Agent.isBada:case ua.Agent.isBlackberry:case ua.Agent.isAndroid:case ua.Agent.isWindowsPhone:ua.Agent.isMobile=!0,ua.Agent.isDesktop=!1}/mobile/i.test(ua.Agent.source)&&(ua.Agent.isMobile=!0,ua.Agent.isDesktop=!1)},this.testTablet=function(){var ua=this;switch(!0){case ua.Agent.isiPad:case ua.Agent.isAndroidTablet:case ua.Agent.isKindleFire:ua.Agent.isTablet=!0}/tablet/i.test(ua.Agent.source)&&(ua.Agent.isTablet=!0)},this.testNginxGeoIP=function(headers){var ua=this;Object.keys(headers).forEach(function(key){/^GEOIP/i.test(key)&&(ua.Agent.geoIp[key]=headers[key])})},this.testBot=function(){var ua=this,isBot=IS_BOT_REGEXP.exec(ua.Agent.source.toLowerCase());isBot?ua.Agent.isBot=isBot[1]:ua.Agent.isAuthoritative||(ua.Agent.isBot=/bot/i.test(ua.Agent.source))},this.testSmartTV=function(){var isSmartTV=new RegExp("smart-tv|smarttv|googletv|appletv|hbbtv|pov_tv|netcast.tv","gi").exec(this.Agent.source.toLowerCase());isSmartTV&&(this.Agent.isSmartTV=isSmartTV[1])},this.testAndroidTablet=function(){this.Agent.isAndroid&&!/mobile/i.test(this.Agent.source)&&(this.Agent.isAndroidTablet=!0)},this.testTouchSupport=function(){this.Agent.isTouchScreen="ontouchstart"in window||0<navigator.maxTouchPoints||0<navigator.msMaxTouchPoints},this.getLaguage=function(){this.Agent.language=(navigator.language||navigator.userLanguage||navigator.browserLanguage||navigator.systemLanguage||"").toLowerCase()},this.getColorDepth=function(){this.Agent.colorDepth=screen.colorDepth||-1},this.getScreenResolution=function(){this.Agent.resolution=[screen.availWidth,screen.availHeight]},this.getPixelDepth=function(){this.Agent.pixelDepth=screen.pixelDepth||-1},this.getCPU=function(){this.Agent.cpuCores=navigator.hardwareConcurrency||-1},this.reset=function(){var ua=this;for(var key in ua.DefaultAgent)ua.DefaultAgent.hasOwnProperty(key)&&(ua.Agent[key]=ua.DefaultAgent[key]);return ua},this.parse=function(source){source=source||navigator.userAgent;var ua=new DeviceUUID;return ua.Agent.source=source.replace(/^\s*/,"").replace(/\s*$/,""),ua.Agent.os=ua.getOS(ua.Agent.source),ua.Agent.platform=ua.getPlatform(ua.Agent.source),ua.Agent.browser=ua.getBrowser(ua.Agent.source),ua.Agent.version=ua.getBrowserVersion(ua.Agent.source),ua.testBot(),ua.testSmartTV(),ua.testMobile(),ua.testAndroidTablet(),ua.testTablet(),ua.testCompatibilityMode(),ua.testSilk(),ua.testKindleFire(),ua.testCaptiveNetwork(),ua.testTouchSupport(),ua.getLaguage(),ua.getColorDepth(),ua.getPixelDepth(),ua.getScreenResolution(),ua.getCPU(),ua.Agent},this.get=function(customData){var du=this.parse(),dua=[];for(var key in this.options)dua.push(du[key]);customData&&dua.push(customData),!this.options.resolution&&du.isMobile&&dua.push(du.resolution);var tmpUuid=du.hashMD5(dua.join(":"));return[tmpUuid.slice(0,8),tmpUuid.slice(8,12),"4"+tmpUuid.slice(12,15),"b"+tmpUuid.slice(15,18),tmpUuid.slice(20)].join("-")},this.Agent=this.DefaultAgent,this};new(exports.DeviceUUID=DeviceUUID)(navigator.userAgent)}(this);