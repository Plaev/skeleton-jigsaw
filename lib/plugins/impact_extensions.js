ig.module('plugins.impact_extensions')
.requires('impact.impact')
.defines(function() {
    ig.ua.androidBrowser = ig.ua.android && /Version/i.test(navigator.userAgent);
    ig.ua.androidChrome = ig.ua.android && /Chrome/i.test(navigator.userAgent);
    ig.ua.nexus7 = ig.ua.android && /Nexus 7/i.test(navigator.userAgent);
});
