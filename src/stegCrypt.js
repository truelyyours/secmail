const nameless = require('crypto');

// Generate private and public keys. returs a json of private and publi keys.
const algorithm = 'aes-256-cbc'
function gen_keys() {
    const u1 = nameless.createECDH('secp256k1');
    u1.generateKeys();

    return {
        "public_key": u1.getPublicKey().toString('hex'),
        "private_key": u1.getPrivateKey().toString('hex')
    }
  }

function get_shared_secret(u1_priv,u2_priv) {
    const u1 = nameless.createECDH('secp256k1');
    const u2 = nameless.createECDH('secp256k1');

    u1.setPrivateKey(u1_priv);
    u2.setPrivateKey(u2_priv);
    
    const shared = u1.computeSecret(u2.getPublicKey()).toString('hex');
    // console.log("Shared Secret: ",shared);

    return shared;
}

// Encryption algo is aes256
function encrypt(msg, pass) {
    
    const key = Buffer.from(pass, 'hex');
    const iv = nameless.randomBytes(16);
    const cipher = nameless.createCipheriv(algorithm, key, iv);
    cipher.setEncoding('hex');
    
    var enc = cipher.update(msg, 'utf-8', 'hex');
    // console.log("Before final: ", enc);
    enc += cipher.final('hex');
    // console.log("After final: ", enc);

    return {"enc":enc, "iv": iv.toString('hex')};
}

// Decrypt the enc text
function decrypt(enc, pass,iv) {
    // get the key
    const key = Buffer.from(pass, 'hex');
    const decipher = nameless.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));

    var txt = decipher.update(enc, 'hex', 'utf-8');
    txt += decipher.final('utf-8');

    return txt;
}

export {gen_keys, get_shared_secret, encrypt, decrypt};

