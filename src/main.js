/* eslint-disable quotes */
import Modal from "./modal"

const modal = new Modal('[data-modal="open"]', '[data-modal="close"]',
	'[data-modal="container"]')
modal.init()  

console.log('[data-modal="open"]')