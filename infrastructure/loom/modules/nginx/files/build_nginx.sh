#!/usr/bin/env bash

set -e

version="1.5.4"
pcre_version="8.33"

set -e

rm -rf nginx-$version*

# download nginx

wget http://nginx.org/download/nginx-$version.tar.gz
tar -zxvf nginx-$version.tar.gz

# compile pcre

cd nginx-$version/contrib
wget -O pcre-$pcre_version.tar.gz "http://downloads.sourceforge.net/project/pcre/pcre/$pcre_version/pcre-$pcre_version.tar.gz?r=&ts=1367323585&use_mirror=ufpr"
tar -zxvf pcre-$pcre_version.tar.gz

# clone extensions
cd ..
mkdir ext
cd ext
git clone --depth=1 git://github.com/simpl/ngx_devel_kit.git
git clone --depth=1 git://github.com/agentzh/set-misc-nginx-module.git
git clone --depth=1 git://github.com/agentzh/nginx-eval-module.git
git clone --depth=1 git://github.com/agentzh/echo-nginx-module.git
git clone --depth=1 git://github.com/chaoslawful/lua-nginx-module.git
git clone --depth=1 git://github.com/agentzh/redis2-nginx-module.git
git clone --depth=1 git://github.com/agentzh/memc-nginx-module.git

# configure

cd ..
./configure --prefix=/usr/local/nginx --user=nginx --group=nginx \
  --with-debug \
  --with-http_ssl_module \
  --with-http_gzip_static_module \
  --with-http_spdy_module \
  --with-http_mp4_module \
  --with-http_flv_module \
  --add-module=ext/ngx_devel_kit \
  --add-module=ext/set-misc-nginx-module \
  --add-module=ext/echo-nginx-module \
  --add-module=ext/lua-nginx-module \
  --add-module=ext/redis2-nginx-module \
  --add-module=ext/memc-nginx-module \
  --with-pcre=contrib/pcre-$pcre_version \
  --with-pcre-jit

make
make install
useradd -M -r --shell /bin/bash --home-dir /usr/local/nginx nginx

# cleanup
cd ..
rm -rf nginx-$version*
