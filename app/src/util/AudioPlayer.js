import { Config } from '../Config';
import { SEOUtil } from './Util';
import { soundManager } from 'soundmanager2';
import 'soundmanager2/swf/soundmanager2.swf';

export class AudioPlayer {
  static init() {
    if (!SEOUtil.isSEORequest()) {
      soundManager.setup({
        url: '/swf/',
        forceUseGlobalHTML5Audio: true,
        debugMode: Config.app.debug,
        debugFlash: Config.app.debug,
        consoleOnly: Config.app.debug,
        useFlashBlock: false,
        flashVersion: 8, // optional: shiny features (default = 8)
        // optional: ignore Flash where possible, use 100% HTML5 mode
        preferFlash: false,
        useHTML5Audio: true,
        noSWFCache: true,
        allowScriptAccess: 'sameDomain',
        ignoreMobileRestrictions: false,
        html5Test: /^(probably|maybe)$/i,
        onready: function() {
          // Ready to use; soundManager.createSound() etc. can now be called.
        },
        ontimeout: function() {
          console.log('SM2 init failed!');
        },
        defaultOptions: {
          // set global default volume for all sound objects
          volume: 100
        }
      });
    }
  }
}
