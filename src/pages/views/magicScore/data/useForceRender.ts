import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'

type forceRender = {
	num: number
	forceRender: () => void
}
const useForceRender = create<forceRender>()(immer(
	(set) => ({
			num: 0,
			forceRender: () => set(state => {
				state.num = state.num + 1
			}),

		}
	),
))

export default useForceRender