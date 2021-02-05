//! Test suite for the Web and headless browsers.

#![cfg(target_arch = "wasm32")]

extern crate wasm_bindgen_test;
use wasm_bindgen_test::*;

use crypto::*;

// wasm_bindgen_test_configure!(run_in_browser);

#[wasm_bindgen_test]
pub fn test_private_key_has_length() {
    let bitsize = BIT_SIZE[0];

    let key = Crypto::new(bitsize).export_private();

    assert!(key.len() > 0);
}

#[wasm_bindgen_test]
pub fn test_public_key_has_length() {
    let bitsize = BIT_SIZE[0];

    let key = Crypto::new(bitsize);
    let private_key = key.export_private();
    let public_key = key.export_public();

    assert!(public_key.len() > 0);
    assert!(private_key.len() > public_key.len());
}

#[wasm_bindgen_test]
pub fn test_falls_back_to_default_bitsize() {
    let bitsize = 2200;

    let key = Crypto::new(bitsize).export_public();
    let cmp = Crypto::new(BIT_SIZE[0]).export_public();

    assert!(key.len() == cmp.len());
}

#[wasm_bindgen_test]
pub fn test_key_equality() {
    let bitsize = BIT_SIZE[0];
    let crypto = Crypto::new(bitsize);

    let exported = crypto.export_private();

    let crypto2 = Crypto::from_pkcs1(&exported);

    let exported2 = crypto2.export_private();

    assert_eq!(exported, exported2);
}
