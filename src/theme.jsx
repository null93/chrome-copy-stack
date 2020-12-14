import { createMuiTheme } from "@material-ui/core/styles"

const isDark = window.matchMedia && window.matchMedia ("(prefers-color-scheme: dark)").matches

module.exports = createMuiTheme ({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				"@global": {
					"::-webkit-scrollbar": {
						width: 8,
						height: 8,
					},
					"::-webkit-scrollbar-track": {
						background: "#FFFFFF00",
					},
					"::-webkit-scrollbar-thumb": {
						background: isDark ? "rgba( 0, 0, 0, 0.5 )" : "rgba( 255, 255, 255, 0.5 )",
					},
				},
			},
		},
		MuiSnackbar: {
			styleOverrides: {
				root: {
					position: "relative",
					marginTop: 8,
				},
				anchorOriginBottomLeft: {
					top: "initial !important",
					right: "initial !important",
					bottom: "initial !important",
					left: "initial !important",
					justifyContent: "flex-end",
				},
			},
		},
		MuiSnackbarContent: {
			styleOverrides: {
				root: {
					minWidth: "initial !important",
					maxWidth: 500,
					minHeight: 36,
					display: "flex",
					flexWrap: "nowrap",
					padding: "0px 12px",
					backgroundColor: isDark ? "#292A2D" : "#FFFFFF",
					color: isDark ? "#FFFFFF" : "#000000",
				},
				message: {
					whiteSpace: "pre",
					overflow: "hidden",
					textOverflow: "ellipsis",
					width: "100%",
				},
				action: {
					paddingLeft: 8,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					height: 30,
					width: 1,
					margin: "0px 4px",
					backgroundColor: isDark ? "#FFFFFF11" : "#00000011",
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: {
					"&$disabled": {
						color: isDark ? "#FFFFFF88" : "#00000088",
					},
					"&:hover": {
						backgroundColor: isDark ? "#00000044" : "#00000022",
					},
				},
			},
		},
		MuiToggleButtonGroup: {
			styleOverrides: {
				groupedHorizontal: {
					"&:not(:first-child)": {
						marginLeft: 0,
					},
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					color: isDark ? "#FFFFFF" : "#000000",
					backgroundColor: "transparent",
					border: "0px solid transparent",
					borderRadius: 0,
					marginLeft: 0,
					"&$selected": {
						color: "#FFFFFF",
						backgroundColor: "#1A73E8",
					},
					"&$selected:hover": {
						color: "#FFFFFF",
						backgroundColor: "#1A73E8 !important",
					},
					"&:hover": {
						color: isDark ? "#FFFFFF" : "#000000",
						backgroundColor: isDark ? "#00000044" : "#00000022",
					},
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				underline: {
					"&:before, &:after": {
						display: "none",
					},
				},
			},
		},
		MuiMenu: {
			styleOverrides: {
				paper: {
					borderRadius: 0,
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				icon: {
					color: isDark ? "#FFFFFF" : "#000000",
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {
					fontSize: 18,
				},
				fontSizeSmall: {
					fontSize: 18,
				},
			},
		},
	},
	props: {
		MuiButtonBase: {
			disableRipple: true,
		},
		MuiSelect: {
			margin: "dense",
			disableUnderline: true,
		},
		MuiMenuItem: {
			dense: true,
			disableGutters: true,
		},
		MuiIconButton: {
			color: "inherit",
		},
		MuiIcon: {
			color: "inherit",
		},
	},
	palette: {
		type: "dark",
		primary: {
			main: "#1A73E8",
		},
		background: {
			default: isDark ? "#202124" : "#EFEFEF",
			paper: isDark ? "#292A2D" : "#FFFFFF",
		},
		text: {
			primary: isDark ? "#FFFFFF" : "#000000",
			secondary: isDark ? "#FFFFFFBB" : "#000000BB",
		},
	},
	typography: {
		body1: { fontSize: 14 },
		body2: { fontSize: 14 },
		button: { fontSize: 14 },
		caption: { fontSize: 14 },
		h1: { fontSize: 14 },
		h2: { fontSize: 14 },
		h3: { fontSize: 14 },
		h4: { fontSize: 14 },
		h5: { fontSize: 14 },
		h6: { fontSize: 14 },
		inherit: { fontSize: 14 },
		overline: { fontSize: 14 },
		subtitle1: { fontSize: 14 },
		subtitle2: { fontSize: 14 },
	},
})
