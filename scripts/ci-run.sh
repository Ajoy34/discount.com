#!/usr/bin/env bash
# Runs a command and, if it fails, republishes the output as workflow
# annotations. Annotations render on the run page without signing in, which
# keeps a red build diagnosable from the outside.
set -u

label="$1"
shift

log="$(mktemp)"
set +e
"$@" >"$log" 2>&1
code=$?
set -e

echo "::group::${label} output"
cat "$log"
echo "::endgroup::"

if [ "$code" -ne 0 ] && [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    printf '### %s failed (exit %s)

' "$label" "$code"
    printf '```
'
    tail -c 60000 "$log"
    printf '
```
'
  } >>"$GITHUB_STEP_SUMMARY"
fi

if [ "$code" -ne 0 ]; then
  echo "::error::${label} failed with exit code ${code}"
  grep -nE 'AXE |FAIL|AssertionError|Error:|Expected|Received|✕|×|⨯|✘|at .*\.(ts|tsx|mjs):' "$log" \
    | head -80 \
    | while IFS= read -r line; do
        printf '::error::%s\n' "${line//$'\r'/}"
      done
fi

exit "$code"
