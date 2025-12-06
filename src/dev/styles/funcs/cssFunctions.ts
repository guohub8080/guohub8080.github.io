// noinspection ES6PreferShortImport
export default {
	px: (i: number) => {
		return {
			paddingLeft: i,
			paddingRight: i,
		}
	},
	py: (i: number) => {
		return {
			paddingTop: i,
			paddingBottom: i,
		}
	},
	pxy: (i: number) => {
		return {
			paddingLeft: i,
			paddingRight: i,
			paddingTop: i,
			paddingBottom: i,
		}
	},
	mx: (i: number) => {
		return {
			marginLeft: i,
			marginRight: i,
		}
	},
	my: (i: number) => {
		return {
			marginTop: i,
			marginBottom: i,
		}
	},
	mxy: (i: number) => {
		return {
			marginLeft: i,
			marginRight: i,
			marginTop: i,
			marginBottom: i,
		}
	},
}
