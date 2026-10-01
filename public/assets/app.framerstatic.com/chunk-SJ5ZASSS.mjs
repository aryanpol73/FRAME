import{a as l}from"https://app.framerstatic.com/chunk-SWYZG2NI.mjs";import{c as a}from"https://app.framerstatic.com/chunk-WLHSDIGQ.mjs";var f=a(i=>{"use strict";var r=l();function S(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var v=typeof Object.is=="function"?Object.is:S,p=r.useState,E=r.useEffect,y=r.useLayoutEffect,h=r.useDebugValue;function m(e,t){var u=t(),o=p({inst:{value:u,getSnapshot:t}}),n=o[0].inst,s=o[1];return y(function(){n.value=u,n.getSnapshot=t,c(n)&&s({inst:n})},[e,u,t]),E(function(){return c(n)&&s({inst:n}),e(function(){c(n)&&s({inst:n})})},[e]),h(u),u}function c(e){var t=e.getSnapshot;e=e.value;try{var u=t();return!v(e,u)}catch{return!0}}function w(e,t){return t()}var j=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?w:m;i.useSyncExternalStore=r.useSyncExternalStore!==void 0?r.useSyncExternalStore:j});var x=a((g,d)=>{"use strict";d.exports=f()});export{x as a};
/*! Bundled license information:

use-sync-external-store/cjs/use-sync-external-store-shim.production.js:
  (**
   * @license React
   * use-sync-external-store-shim.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=https://app.framerstatic.com/chunk-SJ5ZASSS.mjs.map
