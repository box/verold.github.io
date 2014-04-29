function isMobile(){
  return /iphone|ipad|ipod|android|blackberry|bb10|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
};

function supportsWebGL() {

  var mobile = isMobile();
  var ua = navigator.userAgent;
  var browser = {
    chrome: ua.indexOf('Chrome') > -1,
    ie: ua.indexOf('MSIE') > -1,
    firefox: ua.indexOf('Firefox') > -1,
    safari: (ua.indexOf('Safari') > -1) && !this.chrome,
    opera: ua.indexOf('Presto') > -1
  };
  browser.firefox_mac = (ua.indexOf('Mac') > -1) && browser.firefox;

  //create a canvas and check
  var glContextAvailable = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();

  //run tests

    var passed = false;
    if(browser.ie || mobile) {
      //do specifics to mobile and ie
    } 
    else {
      //check for webgl, if all browsers pass!
      passed = glContextAvailable;
    }
    return passed;

};