"use strict"

function hasShadow () {
	return document.getElementById ("copy-stack-shadow")
}

function removeShadow () {
	return document.getElementById ("copy-stack-shadow")?.remove ()
}

chrome.action.onClicked.addListener ( async tab => {
	if ( /^https?\:/.test ( tab.url ) ) {
		const hasShadowResponse = await chrome.scripting.executeScript ({
			target: { tabId: tab.id },
			func: hasShadow,
		})
		if ( hasShadowResponse?.pop ()?.result ) {
			await chrome.action.setBadgeText ({ tabId: tab.id, text: "" })
			await chrome.scripting.executeScript ({
				target: { tabId: tab.id },
				func: removeShadow,
			})
		}
		else {
			await chrome.action.setBadgeText ({ tabId: tab.id, text: "On" })
			await chrome.scripting.executeScript ({
				target: { tabId: tab.id },
				files: [ "stack.js" ],
			})
		}
	}
})
