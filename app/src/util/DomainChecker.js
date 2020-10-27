//http://www.danstools.com/javascript-obfuscate/index.php
// https://www.javascriptobfuscator.com/Javascript-Obfuscator.aspx
//http://javascript2img.com/obfuscating.php

setTimeout(function() {
  function check() {
    let hostname = window.location.hostname;
    let redirDomain = 'http://descargarmusica.me';
    let validHostnames = [
      'descargarmusica.me',
      'beta.setbeat.com',
      'www.setbeat.com',
      'setbeat.com'
    ];
    let isValid = validHostnames.indexOf(hostname) !== -1;

    if (!isValid) {
      window.location.href = redirDomain + '?ref=' + window.location.href;
    }
  }

  check();
}, 20000);
