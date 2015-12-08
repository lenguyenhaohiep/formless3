mainApp.service('openpgpservice', function (){
	var openpgpservice = {};

    /**
    * Generate a Private and Public keypair
    * @param  {numBits} Integer - Any multiple of 1024. 2048 is recommended.
    * @param  {userid} String - should be like: Alice Mayfield <amayfield@quantum.com>
    * @param  {passphrase} String - password should be a 4-5 word sentence (20+ chars)
    * @return {key} String - Encrypted ASCII armored keypair (contains both Private and Public keys)
    */
    openpgpservice.keygen = function (numBits, userId, passphrase) {
    	var openpgp = window.openpgp;
    	var key = openpgp.generateKeyPair({
    		numBits: numBits,
    		userId: userId,
    		passphrase: passphrase
    	});
    	return key;
    }

	/**
	 * Encrypt a message using the recipient's public key.
	 * @param  {pubkey} String - Encrypted ASCII Armored public key.
	 * @param  {message} String - Your message to the recipient.
	 * @return {pgpMessage} String - Encrypted ASCII Armored message.
	 */

	 openpgpservice.encrypt_message = function(pubkey, message) {
	 	var openpgp = window.openpgp;
	 	var key = pubkey;
	 	var publicKey = openpgp.key.readArmored(key);
	 	var pgpMessage = openpgp.encryptMessage(publicKey.keys, message);
	 	return pgpMessage;
	 }

	/**
	 * Decrypt a message using your private key.
	 * @param  {pubkey} String - Your recipient's public key.
	 * @param  {privkey} String - Your private key.
	 * @param  {passphrase} String - Your ultra-strong password.
	 * @param  {encoded_message} String - Your message from the recipient.
	 * @return {decrypted} String - Decrypted message.
	 */

	 openpgpservice.decrypt_message = function(pubkey, privkey, passphrase, encoded_message) {
	 	var openpgp = window.openpgp;
	 	var privKeys = openpgp.key.readArmored(privkey);
	 	var publicKeys = openpgp.key.readArmored(pubkey);
	 	var privKey = privKeys.keys[0];
	 	var success = privKey.decrypt(passphrase);
	 	var message = openpgp.message.readArmored(encoded_message);
	 	var decrypted = openpgp.decryptMessage(privKey, message);
	 	return decrypted;
	 }

	/**
	 * Sign a message using your private key.
	 * @param  {pubkey} String - Your recipient's public key.
	 * @param  {privkey} String - Your private key.
	 * @param  {passphrase} String - Your ultra-strong password.
	 * @param  {message} String - Your message from the recipient.
	 * @return {signed} String - Signed message.
	 */

	openpgpservice.sign_message = function(pubkey, privkey, passphrase, message){
	 	var openpgp = window.openpgp;
	 	var priv = openpgp.key.readArmored(privkey);
	 	var pub = openpgp.key.readArmored(pubkey);
	 	var privKey = priv.keys[0];
	 	var success = priv.decrypt(passphrase);
	 	var signed = openpgp.signClearMessage(priv.keys, message);
	 	return signed;  
	 }

	/**
	 * Sign a message using your private key.
	 * @param  {pubkey} String - Your recipient's public key.
	 * @param  {privkey} String - Your private key.
	 * @param  {passphrase} String - Your ultra-strong password.
	 * @param  {signed_message} String - Your signed message from the recipient.
	 * @return {signed} Boolean - True (1) is a valid signed message.
	 */

	 openpgpservice.verify_signature = function(pubkey, privkey, passphrase, signed_message) {
	 	var openpgp = window.openpgp;
	 	var privKeys = openpgp.key.readArmored(privkey);
	 	var publicKeys = openpgp.key.readArmored(pubkey);
	 	var privKey = privKeys.keys[0];
	 	var success = privKey.decrypt(passphrase);
	 	var message = openpgp.cleartext.readArmored(signed_message);
	 	var verified = openpgp.verifyClearSignedMessage(publicKeys.keys, message);
	 	if (verified.signatures[0].valid === true) {
	 		return '1';
	 	} else {
	 		return '0';
	 	}
	 }

	/**
	 * Determines public key size (1024, 2048...)
	 * @param  {data} String - Your recipient's Encrypted ASCII Armored public key.
	 * @return {size} Integer - Length of the public key.
	 */

	 openpgpservice.get_publickey_length = function (data) {
	 	var publicKey = openpgp.key.readArmored(data);
	 	var publicKeyPacket = publicKey.keys[0].primaryKey;
	 	if (publicKeyPacket !== null) {
	 		strength = openpgpservice.getBitLength(publicKeyPacket);
	 	}

	 	openpgpservice.getBitLength = function(publicKeyPacket) {
	 		var size = -1;
	 		if (publicKeyPacket.mpi.length > 0) {
	 			size = (publicKeyPacket.mpi[0].byteLength() * 8);
	 		}
	 		return size;
	 	}
	 }
});