/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 966:
/***/ ((module) => {

const handler = async ({ payload }) => {
    const { item, attributes, itemType, action } = payload;

    if (action === 'createItem') {
        const myItem = {};

        myItem.contry = openkbs.clientHeaders['cloudfront-viewer-country-name']
        myItem.ip = openkbs.clientHeaders['x-forwarded-for']

        for (const attribute of attributes) {
            const { attrName, encrypted } = attribute;
            if (encrypted && item[attrName] !== undefined) {
                myItem[attrName] = await openkbs.encrypt(item[attrName]);
            } else {
                myItem[attrName] = item[attrName];
            }
        }

        return await openkbs.items({ action, itemType, attributes, item: myItem });
    }
}

module.exports = { handler }

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(966);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;