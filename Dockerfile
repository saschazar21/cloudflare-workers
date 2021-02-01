FROM rust:slim

ENV NODE_VERSION=14
ENV NVM_VERSION=v0.37.2
ENV USER=${USER}

# Install curl to download install scripts below
RUN apt-get update \
  && apt-get install -y --no-install-recommends curl

# Install wasm-pack
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

# Install nvm, will auto-install Node.js version defined in NODE_VERSION
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_VERSION}/install.sh | bash

# Uninstall curl again, as it's not needed anymore
RUN apt-get remove -y --autoremove curl