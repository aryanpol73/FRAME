import{a as x}from"https://app.framerstatic.com/chunk-SJ5ZASSS.mjs";import{a as h}from"https://app.framerstatic.com/chunk-SWYZG2NI.mjs";import{o as p}from"https://app.framerstatic.com/chunk-LA34HORX.mjs";import{c as a,e as c}from"https://app.framerstatic.com/chunk-WLHSDIGQ.mjs";var f=a(V=>{"use strict";var C=x();V.useSubscription=function(e){return C.useSyncExternalStore(e.subscribe,e.getCurrentValue)}});var S=a((F,g)=>{"use strict";g.exports=f()});var u=c(h(),1),b=c(S(),1);var n=new Map,s=new Set;window.addEventListener("storage",e=>{if(!(e.storageArea!==localStorage||e.key===null))try{if(e.newValue===null)n.set(e.key,null);else if(e.oldValue!==e.newValue){let t=JSON.parse(e.newValue);n.set(e.key,t)}for(let t of s)t(e.key)}catch{}});function L(e){if(n.has(e))return n.get(e)??null;let t=localStorage.getItem(e);if(t)try{let r=JSON.parse(t);return n.set(e,r),r}catch{}return null}function d(e,t){if(t===null)n.set(e,null),localStorage.removeItem(e);else{n.set(e,t);let r=JSON.stringify(t);localStorage.setItem(e,r)}for(let r of s)r(e)}function N(e,t){function r(i){i===e&&t()}return s.add(r),()=>{s.delete(r)}}function q(e,t){let r=(0,u.useMemo)(()=>{function o(l){return N(e,l)}return{getCurrentValue:()=>L(e),subscribe:o}},[e]),i=(0,b.useSubscription)(r)??t,m=(0,u.useCallback)(o=>{try{if(p(o)){let l=r.getCurrentValue()??t,w=o(l);d(e,w)}else d(e,o)}catch{}},[e,t,r]);return[i,m]}export{L as a,d as b,N as c,q as d};
/*! Bundled license information:

use-subscription/cjs/use-subscription.production.min.js:
  (**
   * @license React
   * use-subscription.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=https://app.framerstatic.com/chunk-3D27PQCY.mjs.map
