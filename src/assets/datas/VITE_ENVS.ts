export const base = () => {
	if (import.meta.env.VITE_GITHUB_PAGES === 'true') return '/'
	if (import.meta.env.VITE_UNIAPP === 'true') return ''
	return '/';
}
