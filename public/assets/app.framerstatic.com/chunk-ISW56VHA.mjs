var s="--framer-fresco-";function i(e,n){return`${s}${e}-${n}`}function c(e,n,t,r){return`var(${i(e,n)}, ${t}${r||""})`}function u(e,n,t){let r={};for(let o in e){let a=e[o];a!==void 0&&(r[o]=c(o,n,a,t))}return r}function l(e){let n=[];for(let t of e)for(let r in t.tokens)n.push(`${i(r,t.scope)}: ${t.tokens[r]};`);return`
        ${n.join(`
`)}
    `}export{i as a,u as b,l as c};
//# sourceMappingURL=https://app.framerstatic.com/chunk-ISW56VHA.mjs.map
