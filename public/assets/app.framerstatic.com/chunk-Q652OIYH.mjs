var m={json:!0,escape:!0,raw:!0,unsafeRaw:!0};function s(e){return e in m}function p(e,a){let[i,...l]=e.split("|"),t=new Set;a&&t.add(a);for(let n of l){let r=n.trim();s(r)&&t.add(r)}return[i.trim(),t]}function u(){return/\{\{([^{}]+)\}\}/gu}function c(){return/\{\{([^\s}]+)\|?/gu}export{p as a,u as b,c};
//# sourceMappingURL=https://app.framerstatic.com/chunk-Q652OIYH.mjs.map
