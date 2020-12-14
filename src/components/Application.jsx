import _ from "lodash"
import copy from "copy-to-clipboard"
import React from "react"
import PropTypes from "prop-types"
import Snackbar from "@material-ui/core/Snackbar"
import IconButton from "@material-ui/core/IconButton"
import Slide from "@material-ui/core/Slide"
import ToggleButtonGroup from "@material-ui/core/ToggleButtonGroup"
import ToggleButton from "@material-ui/core/ToggleButton"
import Divider from "@material-ui/core/Divider"
import CloseIcon from "@material-ui/icons/Close"
import CopyIcon from "@material-ui/icons/FlipToFront"
import CopiedIcon from "@material-ui/icons/Done"
import ClearIcon from "@material-ui/icons/ClearAll"
import SumIcon from "@material-ui/icons/Functions"
import DifferenceIcon from "@material-ui/icons/Remove"
import NewLineIcon from "@material-ui/icons/Reorder"
import CommaIcon from "icons/Comma"
import { withStyles } from "@material-ui/core/styles"

const styles = theme => ({
	root: {
		position: "fixed",
		bottom: 0,
		right: 0,
		zIndex: 1E10,
	},
	toolbar: {
		minWidth: 300,
		padding: theme.spacing ( 0, 2, 2, 2 ),
		marginTop: 0,
	},
	stack: {
		padding: theme.spacing ( 2 ),
		maxHeight: "calc( 100vh - 58px )",
		overflowX: "hidden",
		overflowY: "auto",
	},
	stackContainer: {
		display: "flex",
		alignItems: "flex-end",
		justifyContent: "flex-end",
		flexDirection: "column-reverse",
	},
})

class Application extends React.Component {

	constructor ( props ) {
		super ( props )
		this.timeout = null
		this.onCopy = null
		this.onPaste = null
		this.state = {
			stack: [],
			reducer: "new-line",
			copied: false,
			helper: "",
		}
	}

	componentDidMount () {
		this.load ()
		chrome.storage.onChanged.addListener ( () => this.load () )
		if ( this.onCopy === null ) {
			this.onCopy = this.copyListener.bind ( this )
			document.addEventListener ( "copy", this.onCopy )
		}
		if ( this.onPaste === null ) {
			this.onPaste = this.pasteListener.bind ( this )
			document.addEventListener ( "paste", this.onPaste )
		}
		document.getElementById ("copy-stack-shadow").addEventListener ( "DOMNodeRemoved", e => {
			document.removeEventListener ( "copy", this.onCopy )
			document.removeEventListener ( "paste", this.onPaste )
		})
	}

	componentWillUnmount () {
		if ( this.timeout ) clearTimeout ( this.timeout )
		if ( this.onCopy ) document.removeEventListener ( "copy", this.onCopy )
		chrome.storage.onChanged.removeListener ( () => this.load () )
	}

	save () {
		const { stack, reducer } = this.state
		chrome.storage.local.set ({ stack, reducer })
	}

	load () {
		chrome.storage.local.get (
			[ "stack", "reducer" ],
			result => this.setState ({
				stack: _.get ( result, "stack", [] ),
				reducer: _.get ( result, "reducer", "new-line" ),
			})
		)
	}

	copyListener ( event ) {
		const { reducer, stack } = this.state
		const data = document.getSelection ().toString ().trim ()
		if ( process.env.NODE_ENV !== "production" ) {
			console.log ( "Copy Listener:", data )
		}
		if ( [ "sum", "difference" ].includes ( reducer ) ) {
			const parsed = parseFloat ( data )
			if ( Boolean ( parsed ) || parsed === 0.0 ) {
				this.setState ( () => ({
					stack: [ ...stack, parsed ]
				}), () => this.save () )
			}
		}
		else if ( data.length > 0 ) {
			this.setState ( () => ({
				stack: [ ...stack, data ]
			}), () => this.save () )
		}
	}

	pasteListener ( event ) {
		const { stack } = this.state
		const data = document.getSelection ().toString ().trim ()
		if ( process.env.NODE_ENV !== "production" ) {
			console.log ( "Paste Listener:", data )
		}
		if ( stack.length > 0 ) {
			const current = stack.pop ()
			copy ( current )
			this.setState ( { stack }, () => this.save () )
		}
	}

	handleClearStack () {
		this.setState (
			{ stack: [] },
			() => this.save ()
		)
	}

	handleDelete ( index ) {
		this.setState ( state => {
			state.stack.splice ( index, 1 )
			return state
		}, () => this.save () )
	}

	handleCopy () {
		this.setState ({ copied: true }, () => {
			copy ( this.reduce () )
			this.timeout = setTimeout ( () => this.setState ({ copied: false }), 1000 )
		})
	}

	handleChangeReducer ( value ) {
		var { stack } = this.state
		if ( [ "sum", "difference" ].includes ( value ) ) {
			stack = stack
				.map ( i => parseFloat ( i ) )
				.filter ( i => Boolean ( i ) )
		}
		else {
			stack = stack.map ( i => `${i}` )
		}
		this.setState ({
			stack,
			reducer: value
		}, () => this.save () )
	}

	reduce () {
		const { stack, reducer } = this.state
		switch ( reducer ) {
			case "sum":
				return stack.reduce ( ( a, e ) => a + parseFloat ( e ), 0 )
			case "difference":
				const initial = stack.slice ( 0, 1 ).pop () || 0
				const rest = stack.slice ( 1 )
				return rest.reduce ( ( a, e ) => a - parseFloat ( e ), initial )
			case "new-line":
				return stack.join ("\n")
			case "comma":
				return stack.join (", ")
		}
	}

	reducePreview () {
		const { stack, reducer } = this.state
		switch ( reducer ) {
			case "sum":
			case "difference":
				return `≈ ${this.reduce ().toFixed ( 2 )}`
			default:
				return `${stack.length} Clip${stack.length === 1 ? "" : "s"}`
		}
	}

	render () {
		const { classes } = this.props
		const { stack, copied, reducer, helper } = this.state
		return <div className={classes.root} >
			<div className={classes.stack} >
				<div className={classes.stackContainer} >
				{
					stack.map ( ( item, index ) =>
						<Snackbar
							key={index}
							open={true}
							TransitionComponent={Slide}
							TransitionProps={{ direction: "left" }}
							message={`${item}`.replace (/[\t\n\r ]+/g, " ").trim ()}
							action={
								<IconButton
									size="small"
									color="inherit"
									disabled={copied}
									onClick={() => this.handleDelete ( index )} >
									<CloseIcon fontSize="small" />
								</IconButton>
							}
						/>
					)
				}
				</div>
			</div>
			<Snackbar
				className={classes.toolbar}
				open={true}
				TransitionComponent={Slide}
				TransitionProps={{ direction: "up" }}
				message={helper !== "" ? helper : this.reducePreview ()}
				action={
					<React.Fragment>
						<Divider/>
						<ToggleButtonGroup
							size="small"
							exclusive={true}
							value={[ reducer ]}
							onChange={( e, value ) => {
								this.handleChangeReducer ( value )
							}} >
							<ToggleButton
								onMouseOver={() => this.setState ({ helper: "Sum" })}
								onMouseOut={() => this.setState ({ helper: "" })}
								value="sum" >
								<SumIcon/>
							</ToggleButton>
							<ToggleButton
								onMouseOver={() => this.setState ({ helper: "Difference" })}
								onMouseOut={() => this.setState ({ helper: "" })}
								value="difference" >
								<DifferenceIcon/>
							</ToggleButton>
							<ToggleButton
								onMouseOver={() => this.setState ({ helper: "New-Line" })}
								onMouseOut={() => this.setState ({ helper: "" })}
								value="new-line" >
								<NewLineIcon/>
							</ToggleButton>
							<ToggleButton
								onMouseOver={() => this.setState ({ helper: "Comma" })}
								onMouseOut={() => this.setState ({ helper: "" })}
								value="comma" >
								<CommaIcon/>
							</ToggleButton>
						</ToggleButtonGroup>
						<Divider/>
						<IconButton
							onMouseOver={() => this.setState ({ helper: "Copy" })}
							onMouseOut={() => this.setState ({ helper: "" })}
							size="medium"
							color="inherit"
							disabled={copied || stack.length < 1}
							onClick={() => this.handleCopy ()} >
							{
								copied
								? <CopiedIcon fontSize="small" />
								: <CopyIcon fontSize="small" />
							}
						</IconButton>
						<Divider/>
						<IconButton
							onMouseOver={() => this.setState ({ helper: "Clear" })}
							onMouseOut={() => this.setState ({ helper: "" })}
							size="medium"
							color="inherit"
							disabled={stack.length < 1}
							onClick={() => this.handleClearStack ()} >
							<ClearIcon fontSize="small" />
						</IconButton>
					</React.Fragment>
				}
			/>
		</div>
	}

}

Application.propTypes = {
	classes: PropTypes.object.isRequired,
}

export default withStyles ( styles ) ( Application )
