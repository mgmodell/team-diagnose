#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
	cp .env.example .env
fi

sed -i 's#@localhost:5432/#@db:5432/#' .env
npm install -g --ignore-scripts=false @endevco/aube@1.5.1
aube ci
