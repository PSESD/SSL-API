'use strict';
/**
 * Created by zaenal on 16/11/15.
 */
var crypto = require('crypto');
var uuid = function (len){

      var chars          = '+?*er*F+AY%vJ,tmwt$e[AzIy|(}(;W7]-Gw}Nazr}iD}--vA}+Jq%+$LCPsP#J#';
      /**
       *
       * @param howMany
       * @param chars
       * @returns {string}
       */
      var randomValueHex = function(howMany, chars){
            var rnd       = crypto.randomBytes(howMany)
                  , value = new Array(howMany)
                  , len   = chars.length;

            for(var i = 0; i < howMany; i++){
                  value[i] = chars[rnd[i] % len]
            }

            return new Buffer(value.join('')).toString('hex');

      };

      return randomValueHex(len, chars);
};
var tokens = [];
for(var i = 0; i < 110000; i++) {
      var ntoken = uuid(128);
      //console.log(ntoken);
      if(tokens.indexOf(ntoken) !== -1){
            console.log('Token duplicate');
      } else {
            tokens.push(ntoken);
      }
}