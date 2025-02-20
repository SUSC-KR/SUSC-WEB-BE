DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT="$(dirname "$DIR")"

if [ -f $ROOT/data.db ]; then
    exit 0
fi

touch $ROOT/data.db
