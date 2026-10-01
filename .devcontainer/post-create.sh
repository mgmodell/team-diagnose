#!/usr/bin/env bash
set -e

if [ ! -f .env ]; then
	cp .env.example .env
	if ! grep -q '@localhost:5432/' .env; then
		echo "DATABASE_URL in .env.example must use localhost:5432" >&2
		exit 1
	fi
	sed -i 's#@localhost:5432/#@db:5432/#' .env
fi
# Bootstrap Aube globally; project dependencies are installed with `aube ci`.
npm install -g @endevco/aube@1.5.1
aube ci
