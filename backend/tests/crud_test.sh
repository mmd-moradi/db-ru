#!/usr/bin/env bash

API=http://localhost:3001
PG_URI="postgresql://myuser:mypassword@localhost/ru"

command -v jq  >/dev/null || { echo "Instale jq: sudo apt install jq"; exit 1; }
command -v psql>/dev/null || { echo "psql não encontrado"; exit 1; }

function pg() {
  psql -At "$PG_URI" -c "$1";
}

function test_restaurante_crud() {
  local new_rest_json
  local REST_ID
  local updated_name
  local http_code

  new_rest_json=$(curl -sX POST $API/api/restaurantes \
    -H "Content-Type: application/json" \
    -d '{"nome":"RU Shell","endereco":"Bloco Z","tipo_cozinha":"Self"}')
  REST_ID=$(jq -r '.id' <<<"$new_rest_json")
  assertNotNull "ID restaurante" "$REST_ID"

  curl -s $API/api/restaurantes/$REST_ID | jq -e . >/dev/null

  updated_name=$(curl -sX PUT $API/api/restaurantes/$REST_ID \
      -H "Content-Type: application/json" \
      -d '{"nome":"RU Alterado"}' | jq -r '.nome')
  assertEquals "RU Alterado" "$updated_name"

  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
              $API/api/restaurantes/$REST_ID)
  assertEquals "204" "$http_code"
}

function test_usuario_crud() {
  local new_user_json
  local USER_ID
  local saldo_after
  local http_code

  new_user_json=$(curl -sX POST $API/api/usuarios \
    -H "Content-Type: application/json" \
    -d '{"nome":"UserShell","matricula":"9999","grupousuario":"A","saldoatual":100}')
  USER_ID=$(jq -r '.usuarioid' <<<"$new_user_json")
  assertNotNull "ID usuário" "$USER_ID"

  curl -s $API/api/usuarios/$USER_ID | jq -e . >/dev/null

  saldo_after=$(curl -sX PUT $API/api/usuarios/$USER_ID \
      -H "Content-Type: application/json" \
      -d '{"saldoatual":80}' | jq -r '.saldoatual')
  assertEquals "80.00" "$saldo_after"

  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
              $API/api/usuarios/$USER_ID)
  assertEquals "204" "$http_code"
}

function test_ticket_debita_saldo() {
  local USER_OK
  local REST_ID
  local CAT_TICKET_ID
  local saldo_before
  local saldo_after
  local delta
  local TICKET_ID

  USER_OK=$(pg "SELECT usuarioid FROM usuario WHERE saldoatual > 20 LIMIT 1")
  REST_ID=$(pg "SELECT restauranteid FROM restaurante LIMIT 1")
  CAT_TICKET_ID=$(pg "SELECT categoriaticketid FROM categoriaticket LIMIT 1")
  [ -n "$USER_OK" ] || startSkipping "Sem usuário com saldo"

  saldo_before=$(curl -s $API/api/usuarios/$USER_OK | jq -r '.saldoatual')

  TICKET_ID=$(curl -sX POST $API/api/tickets -H "Content-Type: application/json" \
      -d "{\"usuarioId\":$USER_OK,\"restauranteId\":$REST_ID,\"categoriaTicketId\":$CAT_TICKET_ID,\"preco\":12.5}" \
      | jq -r '.ticketid')
  assertNotNull "Ticket ID" "$TICKET_ID"

  saldo_after=$(curl -s $API/api/usuarios/$USER_OK | jq -r '.saldoatual')
  delta=$(awk "BEGIN {print $saldo_before - $saldo_after}")
  assertEquals "12.5" "$delta"
}

function test_ticket_saldo_insuficiente() {
  local USER_ZERO
  local REST_ID
  local CAT_TICKET_ID
  local http_code

  USER_ZERO=$(pg "SELECT usuarioid FROM usuario WHERE saldoatual = 0 LIMIT 1")
  [ -n "$USER_ZERO" ] || startSkipping "Sem usuário saldo zero"

  REST_ID=$(pg "SELECT restauranteid FROM restaurante LIMIT 1")
  CAT_TICKET_ID=$(pg "SELECT categoriaticketid FROM categoriaticket LIMIT 1")

  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X POST $API/api/tickets \
      -H "Content-Type: application/json" \
      -d "{\"usuarioId\":$USER_ZERO,\"restauranteId\":$REST_ID,\"categoriaTicketId\":$CAT_TICKET_ID,\"preco\":12.5}")
  assertEquals "409" "$http_code"
}

. shunit2
