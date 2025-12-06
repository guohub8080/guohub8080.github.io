import { create } from "zustand";

export type TranscodeMode = "base64" | "gen_rsa" | "encode_rsa" | "decode_rsa";

type TranscodeState = {
  transcodeMode: TranscodeMode;
  setTranscodeMode: (mode: TranscodeMode) => void;

  // Base64/RSA shared flags
  isBase64: boolean;
  setIsBase64: (v: boolean) => void;

  // RSA lengths
  genRsaLength: 512 | 1024 | 2048 | 4096;
  setGenRsaLength: (v: 512 | 1024 | 2048 | 4096) => void;

  // RSA text inputs
  readyEncryptText: string;
  setReadyEncryptText: (v: string) => void;
  readyDecryptText: string;
  setReadyDecryptText: (v: string) => void;

  // RSA keys
  public_key: string;
  private_key: string;
  public_key_b64: string;
  private_key_b64: string;
  setPublicKey: (v: string) => void;
  setPrivateKey: (v: string) => void;
  setPublicKeyB64: (v: string) => void;
  setPrivateKeyB64: (v: string) => void;
  clearKeys: () => void;
};

const useTranscodeConfig = create<TranscodeState>((set) => ({
  transcodeMode: "base64",
  setTranscodeMode: (mode) => set({ transcodeMode: mode }),

  isBase64: false,
  setIsBase64: (v) => set({ isBase64: v }),

  genRsaLength: 2048,
  setGenRsaLength: (v) => set({ genRsaLength: v }),

  readyEncryptText: "",
  setReadyEncryptText: (v) => set({ readyEncryptText: v }),
  readyDecryptText: "",
  setReadyDecryptText: (v) => set({ readyDecryptText: v }),

  public_key: "",
  private_key: "",
  public_key_b64: "",
  private_key_b64: "",
  setPublicKey: (v) => set({ public_key: v }),
  setPrivateKey: (v) => set({ private_key: v }),
  setPublicKeyB64: (v) => set({ public_key_b64: v }),
  setPrivateKeyB64: (v) => set({ private_key_b64: v }),
  clearKeys: () => set({
    public_key: "",
    private_key: "",
    public_key_b64: "",
    private_key_b64: "",
  }),
}));

export default useTranscodeConfig;


