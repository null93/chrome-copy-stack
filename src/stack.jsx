import "typeface-roboto"
import theme from "./theme"
import React from "react"
import ReactDOM from "react-dom"
import Application from "components/Application"
import CssBaseline from "@material-ui/core/CssBaseline"
import { MuiThemeProvider, StylesProvider, jssPreset } from "@material-ui/core/styles"
import { create } from "jss"

// Display theme only if not in production
if ( process.env.NODE_ENV !== "production" ) {
	console.log ( "MUI-Theme:", theme )
}

// Inject DOM element for shadow stack
const shadow = document.createElement ("div")
shadow.setAttribute ( "id", "copy-stack-shadow" )
document.body.appendChild ( shadow )

// Inject application wrapper into shadow DOM
const main = document.createElement ("div")
main.setAttribute ( "id", "copy-stack-main" )
document.body.appendChild ( main )

// Attach application wrapper to shadow DOM and get insertion point
const root = shadow.attachShadow ({ mode: "open" })
const insertionPoint = root.appendChild ( main )

ReactDOM.render (
	<StylesProvider jss={create ({ ...jssPreset (), insertionPoint })} >
		<MuiThemeProvider theme={theme} >
			<CssBaseline/>
			<Application/>
		</MuiThemeProvider>
	</StylesProvider>,
	main,
)
