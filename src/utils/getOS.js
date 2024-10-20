export function getOS() {
    try {
        let userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'MacOS'
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS'
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows'
        } else if (/Android/.test(userAgent)) {
            os = 'Android'
        } else if (/Linux/.test(platform)) {
            os = 'Linux'
        }

        return os
    } catch (e) {
        return null;
    }

}