"use strict"

const CODE_CHECK_STATE = `document.getElementById ("copy-stack-shadow")`
const CODE_REMOVE_ELEM = `document.getElementById ("copy-stack-shadow").remove ()`

chrome.browserAction.onClicked.addListener ( tab => {
	if ( /^https?\:/.test ( tab.url ) ) {
		chrome.tabs.executeScript ( tab.id, { code: CODE_CHECK_STATE }, results => {
			const isOn = results.pop () !== null
			if ( isOn ) {
				chrome.browserAction.setBadgeText (
					{ tabId: tab.id, text: "" },
					() => chrome.tabs.executeScript ( tab.id, {
						code: CODE_REMOVE_ELEM,
					})
				)
			}
			else {
				chrome.browserAction.setBadgeText (
					{ tabId: tab.id, text: "On" },
					() => chrome.tabs.executeScript ( tab.id, {
						file: "stack.js",
					})
				)
			}
		})
	}
})
