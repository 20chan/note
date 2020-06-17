#!/bin/sh

_usage() {
  echo "Usage: $0 <subcommands> [args]

SUBCOMMANDS:

  user:
    $0 user add <id> <password>
    $0 user update <id> <password>
    $0 user remove <id>
    $0 user list

  debug:
    $0 debug hash <text>
"
  exit 1
}

INFO=$(docker ps \
  --no-trunc \
  --format "{{.Image}};{{.Names}}" \
  --filter name="note-server" | \
  tail -1)
IMAGE_NAME=${INFO%;*}
CONTAINER_NAME=${INFO#*;}
VOLUMES="$(docker inspect $CONTAINER_NAME --format='{{range .Mounts}}{{ println .Source .Destination}}{{end}}')"
if [ ! -z "$CONTAINER_NAME" ]; then
  CONFIG_VOLUME=$(echo "${VOLUMES}" | grep "/app/config$" 2>/dev/null)
  SERVERAPP_PATH=$(echo "${VOLUMES}" | grep "/app$" | awk '{print $1}' 2>/dev/null)
fi
if [ ! -z "$CONFIG_VOLUME" ]; then
  CONFIG_PATH=$(echo $CONFIG_VOLUME | awk '{print $1}')
fi
if [ ! -n "$CONFIG_PATH" ]; then
  CONFIG_PATH="$(pwd)/config"
fi
if [ ! -e "$CONFIG_PATH" ]; then
  echo "config path not found"
  exit 1
fi

ACCOUNTS_PATH="$CONFIG_PATH/accounts.json"
if [ ! -e "$ACCOUNTS_PATH" ]; then
  echo "config/accounts.json file not found. creating new one.."
  echo "[]" > $ACCOUNTS_PATH
fi

_add_user() {
  id=$1
  users=$(cat $ACCOUNTS_PATH)
  id_count=$(echo $users | jq "map(select(.id==\"$id\")) | length")
  if [ "$id_count" -gt "0" ]; then
    echo "error: id duplicates"
    exit 1
  fi

  password=$(_hash $2)
  user="[{\"id\":\"$id\",\"password\":\"$password\"}]"
  result=$(echo $user $users | jq -s ".[0] + .[1]|.")
  echo "${result}" > $ACCOUNTS_PATH
}

_update_user() {
  id=$1
  users=$(cat $ACCOUNTS_PATH)
  id_count=$(echo $users | jq "map(select(.id==\"$id\")) | length")
  if [ ! "$id_count" -gt "0" ]; then
    echo "error: id not found"
    exit 1
  fi
  users_except=$(echo $users | jq "map(select(.id!=\"$id\"))")

  password=$(_hash $2)
  user="[{\"id\":\"$id\",\"password\":\"$password\"}]"
  result=$(echo $user $users_except | jq -s ".[0] + .[1]|.")
  echo "${result}" > $ACCOUNTS_PATH
}

_remove_user() {
  id=$1
  users=$(cat $ACCOUNTS_PATH)
  id_count=$(echo $users | jq "map(select(.id==\"$id\")) | length")
  if [ ! "$id_count" -gt "0" ]; then
    echo "error: id not found"
    exit 1
  fi
  result=$(echo $users | jq "map(select(.id!=\"$id\"))")
  echo "${result}" > $ACCOUNTS_PATH
}

_list_user() {
  users=$(cat $ACCOUNTS_PATH | jq -r '.[] | .id')
  echo "${users}"
}

_hash() {
  hash=$(cd $SERVERAPP_PATH && \
   ts-node -e "import * as crypto from 'crypto-js'; console.log(crypto.SHA512('$1').toString())")
  echo $hash
}

case $1 in
  user)
    shift
    case $1 in
      add)
        shift
        _add_user $@
        ;;
      update)
        shift
        _update_user $@
        ;;
      remove)
        shift
        _remove_user $@
        ;;
      list)
        shift
        _list_user
        ;;
      *)
        _usage
        ;;
    esac
    ;;
  debug)
    shift
    case $1 in
      hash)
        shift
        _hash $@
        ;;
      *)
        _usage
        ;;
    esac
    ;;
  *)
    _usage
    ;;
esac
