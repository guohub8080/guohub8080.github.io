import JSEncrypt from "jsencrypt";
import {Base64} from "js-base64";
import jsrsasign from "jsrsasign"
// import {Base64} from "js-base64";
// 将公钥用于加密，输出的结果是base64编码的字符串
const encrypt_string_by_text_public_key = (plain_text: string, public_text_key: string) => {
	const encrypt = new JSEncrypt();
	encrypt.setPublicKey(public_text_key);
	return encrypt.encrypt(plain_text);
}
const encrypt_string_by_b64_public_key = (plain_text: string, public_b64_key: string) => {
	const encrypt = new JSEncrypt();
	encrypt.setPublicKey(Base64.decode(public_b64_key));
	return encrypt.encrypt(plain_text);
}

const decrypt_string_by_b64_private_key = (encrypted_text: string, private_b64_key: string) => {
	const decrypt = new JSEncrypt();
	decrypt.setPrivateKey(Base64.decode(private_b64_key));
	return decrypt.decrypt(encrypted_text);
}
const decrypt_string_by_text_private_key = (encrypted_text: string, private_text_key: string) => {
	const decrypt = new JSEncrypt();
	decrypt.setPrivateKey(private_text_key);
	return decrypt.decrypt(encrypted_text);
}

const decrypt_json_by_b64_private_key = (encrypted_json: string, private_b64_key: string) => {
	return JSON.parse(decrypt_string_by_b64_private_key(encrypted_json, private_b64_key) as string)
}

const encrypt_obj_by_b64_public_key = (base_obj: object, public_b64_key: string) => {
	return encrypt_string_by_b64_public_key(JSON.stringify(base_obj), public_b64_key)
}

const gen_keys = (key_length = 2048, is_b64_encode = false) => {
	let rsa_key_pair = jsrsasign.KEYUTIL.generateKeypair("RSA", key_length)
	let public_key = jsrsasign.KEYUTIL.getPEM(rsa_key_pair.prvKeyObj)
	let private_key = jsrsasign.KEYUTIL.getPEM(rsa_key_pair.prvKeyObj, "PKCS1PRV")
	if (is_b64_encode) {
		return {private_key: Base64.encode(private_key), public_key: Base64.decode(public_key)}
	}
	return {private_key, public_key}
}

export default {
	encrypt_string_by_b64_public_key, decrypt_string_by_b64_private_key,
	encrypt_string_by_text_public_key, decrypt_string_by_text_private_key,
	decrypt_json_by_b64_private_key, encrypt_obj_by_b64_public_key, gen_keys
}
