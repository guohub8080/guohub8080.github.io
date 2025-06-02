import {create} from 'zustand'
import {immer} from 'zustand/middleware/immer'
import {createJSONStorage, persist} from 'zustand/middleware'

type examType = {

	resetStore: () => void,
	transcodeMode: string | undefined,
	setTranscodeMode: (transcodeMode: string) => void
	genRsaLength: number,
	setGenRsaLength: (genRsaLength: number) => void
	private_key: string,
	public_key: string,
	private_key_b64: string,
	public_key_b64: string
	setPrivateKey: (private_key: string) => void,
	setPublicKey: (public_key: string) => void,
	setPrivateKeyB64: (private_key_b64: string) => void,
	setPublicKeyB64: (public_key_b64: string) => void
	clearKeys: () => void,
	readyEncryptText: string
	setReadyEncryptText: (readyEncryptText: string) => void
	readyDecryptText: string
	setReadyDecryptText: (readyDecryptText: string) => void
	isBase64: boolean
	setIsBase64: (isBase64: boolean) => void
}
const storeKey = "transcodeConfig"
const defaultStore = {
	transcodeMode: "",
	genRsaLength: 2048,
	private_key: "",
	public_key: "",
	private_key_b64: "",
	public_key_b64: "",
	readyEncryptText: "",
	readyDecryptText: "",
	isBase64: false,
}
const useTranscodeConfig = create<examType>()(immer(persist(
	(set) => ({
		...defaultStore,
		setTranscodeMode: (transcodeMode: string) => {
			set((state) => {
				state.transcodeMode = transcodeMode
			})
		},
		setIsBase64: (isBase64: boolean) => {
			set((state) => {
				state.isBase64 = isBase64
			})
		},
		setReadyDecryptText: (readyDecryptText: string) => {
			set((state) => {
				state.readyDecryptText = readyDecryptText
			})
		},
		setReadyEncryptText: (readyEncryptText: string) => {
			set((state) => {
				state.readyEncryptText = readyEncryptText
			})
		},
		clearKeys: () => {
			set((state) => {
				state.private_key = ""
				state.public_key = ""
				state.private_key_b64 = ""
				state.public_key_b64 = ""
			})
		},
		setPrivateKey: (private_key: string) => {
			set((state) => {
				state.private_key = private_key
			})
		},
		setPublicKey: (public_key: string) => {
			set((state) => {
				state.public_key = public_key
			})
		},
		setPrivateKeyB64: (private_key_b64: string) => {
			set((state) => {
				state.private_key_b64 = private_key_b64
			})
		},
		setPublicKeyB64: (public_key_b64: string) => {
			set((state) => {
				state.public_key_b64 = public_key_b64
			})
		},
		setGenRsaLength: (genRsaLength: number) => {
			set((state) => {
				state.genRsaLength = genRsaLength
			})
		},
		resetStore: () => {
			set(defaultStore)
			localStorage.removeItem(storeKey)
		}

	}),
	{
		name: storeKey, // name of the item in the storage (must be unique)
		storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
	},
),))

export default useTranscodeConfig
