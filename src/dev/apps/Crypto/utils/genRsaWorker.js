import {Base64} from "js-base64";
import doCrypt from "./doCrypt.js";

const genRsaPair = function (keyLength) {
	try {
		var keys_raw_str = doCrypt.gen_keys(keyLength);
		var private_key = keys_raw_str.private_key;
		var private_key_b64 = Base64.encode(keys_raw_str.private_key);
		var public_key = keys_raw_str.public_key;
		var public_key_b64 = Base64.encode(keys_raw_str.public_key);
		return {private_key_b64, private_key, public_key_b64, public_key};
		// self.postMessage({private_key_b64, private_key, public_key_b64, public_key});
	} catch (error) {
		// self.postMessage({error: error.message});
		return {error: error.message};
	}
};

// 监听主线程消息
self.onmessage = function (e) {
	try {
		const keyLength = e.data;
		const result = genRsaPair(keyLength);
		self.postMessage(result);
	} catch (error) {
		self.postMessage({ error: error.message });
	}
};
