# RSA worker example

**⚠️ CAUTION**: currently exceeds time limit for Cloudflare Workers, therefore not usable in standard setup as of now.

> generates random RSA key & returns it in PEM format. Written in Rust

## Prerequsites

To successfully build this project, either build the Docker Image using the [Dockerfile](../../Dockerfile), or make sure that the following packages are in your `$PATH` variable:

- `rustup` (therefore `rustc` & `cargo`)
- `wasm-pack`
- `cargo-generate`
- `wrangler` (optional, since not usable on Cloudflare Workers as of now)

## Example

To generate a random 1024-bit RSA key, perform an example request like the following:

```bash
curl -X GET http://localhost:8787/key/1024
```

Other supported bitsizes are:

- **2048**: `/key/2048`
- **3072**: `/key/3072`
- **4096**: `/key/4096`
