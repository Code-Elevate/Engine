#!/usr/bin/env bash

[[ -d "bin" ]] && exit 0
PREFIX=$(realpath $(dirname $0))

mkdir -p build obj

cd build

curl "https://ftp.gnu.org/gnu/gcc/gcc-13.2.0/gcc-13.2.0.tar.gz" -o gcc.tar.gz

tar xzf gcc.tar.gz --strip-components=1

./contrib/download_prerequisites

cd ../obj

# === autoconf based === 
../build/configure --prefix "$PREFIX" --enable-languages=c,c++ --disable-multilib --disable-bootstrap

make -j$(nproc)
make install -j$(nproc)
cd ../
rm -rf build obj

# Download bits/stdc++.h file
mkdir -p "$PREFIX/include/bits"
curl "https://raw.githubusercontent.com/gcc-mirror/gcc/master/libstdc%2B%2B-v3/include/precompiled/stdc%2B%2B.h" -o "$PREFIX/include/bits/stdc++.h"
