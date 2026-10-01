function o(i,n){if(i)return;if(typeof n=="function")try{n=n()}catch{n="(assert message threw)"}typeof n=="string"&&n.length>2048&&(n=n.slice(0,2048)+"\u2026");let r=Error(n?"Assertion Error: "+n:"Assertion Error");if(r.stack)try{let t=r.stack.split(`
`);t[1]?.includes("assert")?(t.splice(1,1),r.stack=t.join(`
`)):t[0]?.includes("assert")&&(t.splice(0,1),r.stack=t.join(`
`))}catch{}throw r}function e(i,n){throw n instanceof Error?n:n!==void 0?new Error(String(n)):new Error(i?`Unexpected value: ${i}`:"Application entered invalid state")}export{o as a,e as b};
//# sourceMappingURL=https://app.framerstatic.com/chunk-XD24P57D.mjs.map
