import{b as R,c as V,d as W}from"https://app.framerstatic.com/chunk-F7KM6T6H.mjs";import{a as o}from"https://app.framerstatic.com/chunk-BVYM57FP.mjs";import{a as T}from"https://app.framerstatic.com/chunk-APKLBANX.mjs";import{a as n}from"https://app.framerstatic.com/chunk-XNIFBQQE.mjs";import{a as c,b as r,c as e}from"https://app.framerstatic.com/chunk-3B75TH5U.mjs";import{a as S,b as L,c as f}from"https://app.framerstatic.com/chunk-ISW56VHA.mjs";import{a as O}from"https://app.framerstatic.com/chunk-QFU6OGL3.mjs";import{a as M}from"https://app.framerstatic.com/chunk-2FCXHKEL.mjs";import{a as lr}from"https://app.framerstatic.com/chunk-SWYZG2NI.mjs";import{b as F}from"https://app.framerstatic.com/chunk-4JY5UMT2.mjs";import{e as C}from"https://app.framerstatic.com/chunk-WLHSDIGQ.mjs";var i=C(lr());var s="shadow";var nr=t=>t==="light"?e:o,sr=t=>Object.entries(t).map(([m,l])=>`${m}: ${l};`).join(`
`);function a(t,m,l={}){let B=nr(t),k={};return Object.entries(B).forEach(([p,x])=>{if(p in l){let d=l[p];if(!d)return;k[S(p,n)]=d;return}if(x in m){let d=m[x];if(!d)return;k[S(p,n)]=d}}),sr(k)}var E={[e.tint]:e.componentTint,[e.tintDark]:r.purple140,[e.tintDimmed]:e.componentTintDimmed,[r.blue75]:r.purple150,[c(r.blue60,.4)]:c(r.purple100,.4),[c(r.blue60,.8)]:c(r.purple100,.8),[c(e.tint,.05)]:c(e.componentTint,.05),[c(e.tint,.08)]:c(e.componentTint,.08),[c(e.tint,.1)]:c(e.componentTint,.1),[c(e.tint,.15)]:c(e.componentTint,.15),[c(e.tint,.5)]:c(e.componentTint,.5)},G={[o.tint]:o.componentTint,[o.tintDark]:r.purple95,[o.tintDimmed]:o.componentTintDimmed,[r.blue75]:r.purple150,[c(r.blue60,.4)]:c(r.purple90,.4),[c(r.blue60,.8)]:c(r.purple90,.8),[c(o.tint,.05)]:c(o.componentTint,.05),[c(o.tint,.08)]:c(o.componentTint,.08),[c(o.tint,.1)]:c(o.componentTint,.1),[c(o.tint,.15)]:c(o.componentTint,.15),[c(o.tint,.5)]:c(o.componentTint,.5)},$={assetVectorBadgeBackground:e.assetVectorBadgeBackground,buttonBackgroundPrimaryActive:r.purple150,buttonWithDepthPrimaryShadow:e.buttonWithDepthPrimaryComponentShadow,buttonWithDepthPrimaryShadowHover:"0px 1px 2px 0px rgba(119, 51, 255, 0.15), 0px 2px 4px 0px rgba(119, 51, 255, 0.3)",layerItemIconDimmed:e.layerItemIconComponentDimmed,selectionBackground:"color(display-p3 0.52 0.357 0.965 / 0.15)",breadcrumbItemBackgroundTinted:e.componentTintDimmed},j={assetVectorBadgeBackground:o.assetVectorBadgeBackground,buttonBackgroundPrimaryActive:r.purple150,layerItemIconDimmed:o.layerItemIconComponentDimmed,selectionBackground:"color(display-p3 0.52 0.357 0.965 / 0.15)",breadcrumbItemBackgroundTinted:o.componentTintDimmed},mr={avatarTinted:`inset 0 0 0 1px ${c(e.componentTint,.15)}`,distributionSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${e.componentTint}, 0 0 0 1px ${e.componentTint}`,gradientSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${e.componentTint}, 0 0 0 1px ${e.componentTint}`},ir={tokens:mr,scope:s},dr={avatarTinted:`inset 0 0 0 1px ${c(o.componentTint,.15)}`,distributionSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${o.componentTint}, 0 0 0 1px ${o.componentTint}`,gradientSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 0 1px ${o.panelBackground}, 0 0 0 2px ${o.componentTint}`},gr={tokens:dr,scope:s},y={light:`
	${a("light",E,$)}
	${f([ir])}
`,dark:`
	${a("dark",G,j)}
	${f([gr])}
`},I={light:a("light",E,{...$,canvasBackground:e.canvasComponentOverlayEditModeBackground,rulerBackground:"#DFCEFF",rulerBorderColor:e.rulerComponentOverlayEditModeBorderColor,rulerTextColor:e.rulerComponentOverlayEditModeTextColor,rulerTickColor:e.rulerComponentOverlayEditModeTickColor,rulerFadeOut:"rgba(136, 85, 255, 0)"}),dark:a("dark",G,{...j,canvasBackground:o.canvasComponentOverlayEditModeBackground,rulerBackground:"#332455",rulerBorderColor:o.rulerComponentOverlayEditModeBorderColor,rulerTextColor:o.rulerComponentOverlayEditModeTextColor,rulerTickColor:o.rulerComponentOverlayEditModeTickColor,rulerFadeOut:"rgba(136, 85, 255, 0)"})};var K={tint:r.white100,buttonBackgroundPrimary:r.white100,buttonBackgroundPrimaryHover:c(r.white100,.98),buttonBackgroundPrimaryActive:c(r.white100,.96),buttonTextPrimary:r.dark90,inputBorderActive:r.white100,comboBoxHighlightedRowTint:c(r.white100,.2),comboBoxHighlightedRowText:r.white100,swatchBackgroundPlaceholderForLink:r.dark50},z=a("light",{},K),U=a("dark",{},K);var g="0px 3px 6px 0px rgba(0, 0, 0, 0.08)",h=`${g}, 0px 0px 0px 1px rgba(0, 0, 0, 0.05)`,b=`inset 0px 0px 0px 1px ${c(r.white100,.07)}`;var pr={popoverInset:b},ur={tokens:pr,scope:s},q=f([ur]);var Br={panelBackground:o.popoverBackground,panelDivider:o.popoverDivider,inputBackground:r.dark83,buttonBackground:r.dark82,buttonBackgroundHover:r.dark80,popupButtonBackground:r.dark71,radioButtonBackground:r.dark71,segmentedControlDivider:r.dark60,segmentedControlItemBackgroundSelected:r.dark63,checkboxLabel:r.light80,menuBackground:r.dark81,menuSeparator:c(r.white100,.07),menuBackgroundActive:r.dark74,menuText:r.white100,menuTextActive:r.white100,tabsBackgroundSelected:r.dark83},kr={menu:`${g}, 0px 0px 0px 1px ${r.dark72}`},br={menuBackgroundActive:r.light59,menuText:r.dark80,menuTextActive:r.dark90,inputBackground:r.light55,inputText:r.dark90},xr={tokens:br,scope:n},N=f([xr]),Tr={tokens:Br,scope:n},hr={tokens:kr,scope:s},Q=f([Tr,hr]);var vr={tooltipBackground:r.dark81},Cr={tokens:vr,scope:n},J=f([Cr]);var P={light:a("light",{[e.tint]:e.warningTint,[e.inputBorder]:e.warningTint,[e.tintDimmed]:e.warningTintDimmed},{inputBorderActive:e.warningTint,selectionBackground:"color(display-p3 1 0.733 0 / 0.15)"}),dark:a("dark",{[o.tint]:o.warningTint,[o.inputBorder]:o.warningTint,[o.tintDimmed]:o.warningTintDimmed},{inputBorderActive:o.warningTint,selectionBackground:"color(display-p3 1 0.733 0 / 0.15)"})},D={light:a("light",{[e.tint]:e.tint,[e.inputBorder]:e.inputBorder,[e.tintDimmed]:e.tintDimmed},{inputBorderActive:e.inputBorderActive}),dark:a("dark",{[o.tint]:o.tint,[o.inputBorder]:o.inputBorder,[o.tintDimmed]:o.tintDimmed},{inputBorderActive:o.inputBorderActive})};var X={avatar:`inset 0 0 0 1px ${c(r.white100,.1)}`,avatarOverlap:`0px 0px 0px 1.5px ${T.panelBackground}, inset 0 0 0 1px ${c(r.white100,.05)}`,avatarTinted:`inset 0 0 0 1px ${c(o.tint,.15)}`,buttonSelected:"0px 2px 4px 0px rgba(0, 0, 0, 0.3), 0px 1px 0px 0px rgba(0, 0, 0, 0.05)",canvasTooltip:"0px 3px 6px 0px rgba(0, 0, 0, 0.08), inset 0px 0px 0px 1px rgba(255, 255, 255, 0.07)",card:"0 5px 20px rgba(0, 0, 0, 0.3)",checkbox:"inset 0 0 0 1px rgba(255, 255, 255, 0.1)",checkboxDarker:"inset 0 0 0 1px rgba(255, 255, 255, 0.1)",checkboxChecked:"inset 0 0 0 1px rgba(255, 255, 255, 0.2)",checkboxDarkerChecked:"inset 0 0 0 1px rgba(255, 255, 255, 0.2)",distributionSliderBar:"inset 0 0 0 1px var(--framer-fresco-gradientStopSliderBorder-color, rgba(0, 0, 0, 0.05))",distributionSliderKnob:"inset 0 0 0 3px white, inset 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",distributionSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${o.tint}, 0 0 0 1px ${o.tint}`,gradientSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 0 1px ${o.panelBackground}, 0 0 0 2px ${o.tint}`,insertImage:"0px 4px 8px 0px rgba(0, 0, 0, 0.2)",menu:`${g}, 0px 0px 0px 1px ${r.dark80}`,modal:g,modalInset:b,popover:g,popoverInset:b,popoverDropShadow:"drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.08)) drop-shadow(0px 2px 10px rgba(0, 0, 0, 0.2))",projectMenuButton:"none",radioButton:"inset 0 0 0 1px rgba(0, 0, 0, 0.05)",radioButtonChecked:"inset 0 0 0 1px rgba(255, 255, 255, 0.2)",settingsCard:"0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.05)",sideOverlay:"0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0, 0, 0, 0.05), inset 1px 0 0 0 #222222",segmentedControlItemSelected:"inset 0 0 0 1px rgba(255, 255, 255, 0.03)",multiComboBoxToken:"none",sliderKnob:"none",toggleTack:"0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.05)",settingsImageClearButton:"0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1)"};var w={avatar:"inset 0 0 0 1px rgba(0, 0, 0, 0.1)",avatarOverlap:`0px 0px 0px 1.5px ${T.panelBackground}, inset 0 0 0 1px ${c(r.white100,.05)}`,avatarTinted:`inset 0 0 0 1px ${c(e.tint,.15)}`,buttonSelected:"0px 2px 4px 0px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgba(0, 0, 0, 0.05)",canvasTooltip:"0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",card:"0 5px 20px rgba(0, 0, 0, 0.15)",checkbox:"inset 0 0 0 1px rgba(0, 0, 0, 0.1)",checkboxDarker:"inset 0 0 0 1px rgba(0, 0, 0, 0.1)",checkboxChecked:"none",checkboxDarkerChecked:"none",distributionSliderBar:"inset 0 0 0 1px var(--framer-fresco-gradientStopSliderBorder-color, rgba(0, 0, 0, 0.05))",distributionSliderKnob:"inset 0 0 0 3px white, inset 0 0 0 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.1)",distributionSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${e.tint}, 0 0 0 1px ${e.tint}`,gradientSliderKnobSelected:`inset 0 0 0 3px white, inset 0 0 0 4px ${e.tint}, 0 0 0 1px ${e.tint}`,insertImage:"0px 4px 8px 0px rgba(0, 0, 0, 0.1)",menu:h,modal:h,modalInset:"none",popover:h,popoverInset:"none",popoverDropShadow:"drop-shadow(0px 1px 8px rgba(0, 0, 0, 0.08)) drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.1))",projectMenuButton:"0px 0px 0px 1px rgba(0, 0, 0, 0.02), 0px 1px 0px 0px rgba(0, 0, 0, 0.05), 0px 2px 4px 0px rgba(0, 0, 0, 0.1)",radioButton:"inset 0 0 0 1px rgba(0, 0, 0, 0.08)",radioButtonChecked:"none",settingsCard:"0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.05)",sideOverlay:"0px 3px 6px 0px rgba(0, 0, 0, 0.08), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",segmentedControlItemSelected:"0px 0px 0px 1px rgba(0, 0, 0, 0.04), 0px 1px 0px 0px rgba(0, 0, 0, 0.04), 0px 2px 4px 0px rgba(0, 0, 0, 0.08)",multiComboBoxToken:"0px 0px 0px 1px rgba(0, 0, 0, 0.03)",sliderKnob:"0px 2px 4px 0px rgba(0, 0, 0, 0.1), 0px 1px 0px 0px rgba(0, 0, 0, 0.05), 0px 0px 0px 1px rgba(0, 0, 0, 0.03)",toggleTack:"0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.05)",settingsImageClearButton:"0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 0.5px 0px 0px rgba(0, 0, 0, 0.1)"};var Mo=L(w,s),Y={tokens:w,scope:s},Z={tokens:X,scope:s};var Sr={tokens:e,scope:n},yr={tokens:o,scope:n},_=f([Sr,Y]),rr=f([yr,Z]);var Xo={component:`
		body[data-framer-theme="light"] & {
			${y.light}
		}
		body[data-framer-theme="dark"] & {
			${y.dark}
		}
`,componentOverlayEditMode:`
		body[data-framer-theme="light"] & {
			${I.light}
		}
		body[data-framer-theme="dark"] & {
			${I.dark}
		}
`,popover:`
		body[data-framer-theme="dark"] & {
			${Q}
		}
		body[data-framer-theme="light"] & {
			${N}
		}
`,darkOnDarkPopoutWindow:`
		body[data-framer-theme="dark"] & {
			${q}
		}
`,tooltipVariantLighter:`
		body[data-framer-theme="dark"] & {
			${J}
		}
`,darkOnDarkModal:`
		body[data-framer-theme="dark"] & {
			${R}
		}
`,modalVariantDefault:`
		body[data-framer-theme="dark"] & {
			${V}
		}
`,modalVariantDarker:`
		body[data-framer-theme="dark"] & {
			${W}
		}
`,inverted:`
		body[data-framer-theme="light"] & {
			${rr}
		}
		body[data-framer-theme="dark"] & {
			${_}
		}
`,warning:`
		body[data-framer-theme="light"] & {
			${P.light}
		}
		body[data-framer-theme="dark"] & {
			${P.dark}
		}
`,warningReset:`
		body[data-framer-theme="light"] & {
			${D.light}
		}
		body[data-framer-theme="dark"] & {
			${D.dark}
		}
`,onPageEditing:`
		body[data-framer-theme="light"] & {
			${z}
		}
		body[data-framer-theme="dark"] & {
			${U}
		}
`},or={component:"c1umhcny",componentOverlayEditMode:"c12c8kmr",popover:"p752w4z",darkOnDarkPopoutWindow:"d1ng92sv",tooltipVariantLighter:"t1cyscb0",darkOnDarkModal:"d1f7bw7u",modalVariantDefault:"m1ysjty9",modalVariantDarker:"m1js5p3h",inverted:"i7h4j38",warning:"w800e5d",warningReset:"wpnx597",onPageEditing:"oedhysz"},er="wek7k3x";var u=C(M());function Ir(t){return t!==!1&&t!==void 0}var A=i.default.createContext(void 0);A.displayName="BaseThemeContext";var H=i.default.createContext(void 0);H.displayName="ThemeOverrideModeContext";function cr(){return i.default.useContext(A)}function fr(){return i.default.useContext(H)}var ar=i.default.forwardRef(function({mode:m,children:l,className:B,...k},p){let x=fr(),d=cr(),v=m||x||d,tr=Ir(v)?or[v]:void 0;return(0,u.jsx)(H.Provider,{value:v,children:(0,u.jsx)("div",{ref:p,className:O(er,tr,B),...k,children:l})})}),oe=i.default.memo(function({mode:m,children:l}){let B=cr();return F(B===void 0,"Nested BaseTheme components are not allowed. BaseTheme should only be used once per application root."),(0,u.jsx)(A.Provider,{value:m,children:(0,u.jsx)(ar,{children:l})})}),ee=i.default.memo(function({children:m}){let l=fr();return(0,u.jsx)(ar,{mode:l==="warning"?"warningReset":l,children:m})});export{Mo as a,cr as b,fr as c,ar as d,oe as e,ee as f};
//# sourceMappingURL=https://app.framerstatic.com/chunk-Y4T2MZY3.mjs.map
