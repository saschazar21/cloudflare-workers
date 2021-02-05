mod utils;

use base64::{decode};
use rand::rngs::OsRng;
use rsa::{PrivateKeyPemEncoding, PublicKeyPemEncoding, RSAPrivateKey, RSAPublicKey};
use std::str;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub const BIT_SIZE: [usize; 4] = [1024, 2048, 3072, 4096];

#[wasm_bindgen]
pub struct Crypto {
    key: RSAPrivateKey,
    rng: OsRng
}

#[wasm_bindgen]
impl Crypto {
    #[wasm_bindgen(constructor)]
    pub fn new(bitsize: usize) -> Crypto {
        let mut rng = OsRng;
        let bitsize: usize = match BIT_SIZE.contains(&bitsize) {
            true => bitsize,
            false => BIT_SIZE[0]
        };

        return Crypto {
            rng: rng,
            key: RSAPrivateKey::new(&mut rng, bitsize).expect("Failed to generate RSA private key")
        };
    }

    pub fn from_pkcs1(pem: &str) -> Crypto {
        let rng = OsRng;
        let pem = pem
            .lines()
            .filter(|line| !line.starts_with("-"))
            .fold(String::new(), |mut data, line| {
                data.push_str(&line);
                return data;
            });
        
        let der = decode(&pem).expect("Failed to decode base64-encoded PEM certificate!");

        return Crypto {
            rng: rng,
            key: RSAPrivateKey::from_pkcs1(&der).expect("Failed to create RSA private key from supplied PEM certificate!"),
        }
    }

    fn export(&self, private: bool) -> String {
        let pkcs = match private {
            true => self.key.to_pem_pkcs1().expect("Failed to export private key in PKCS1 format!"),
            false => RSAPublicKey::from(&self.key).to_pem_pkcs1().expect("Failed to export public key in PKCS1 format!")
        };

        return pkcs;
    }

    pub fn export_private(&self) -> String {
        return self.export(true);
    }

    pub fn export_public(&self) -> String {
        return self.export(false);
    }
}