#!/bin/bash
# Focused Windsurf Inference Capture
# Filters out noise, shows only inference/auth traffic

MITMPROXY_PORT=8080
CAPTURE_DIR="$HOME/Desktop/Projects/libraries/opencode-windsurf-auth/captures"

mkdir -p "$CAPTURE_DIR"

echo "=== Windsurf Inference Traffic Capture ==="
echo ""
echo "Filtering OUT: unleash.codeium.com, telemetry, static assets"
echo "Looking FOR: server.codeium.com, inference.codeium.com, api.codeium.com, firebase"
echo ""
echo "Make sure Windsurf is running with:"
echo ""
echo "  HTTP_PROXY=http://localhost:$MITMPROXY_PORT \\"
echo "  HTTPS_PROXY=http://localhost:$MITMPROXY_PORT \\"
echo "  NODE_EXTRA_CA_CERTS=~/.mitmproxy/mitmproxy-ca-cert.pem \\"
echo "  /Applications/Windsurf.app/Contents/MacOS/Electron"
echo ""

# Filter: exclude unleash and telemetry, show everything else
# The ! means NOT, so we exclude those domains
mitmdump \
    --mode regular \
    -p $MITMPROXY_PORT \
    --save-stream-file "$CAPTURE_DIR/inference-$(date +%Y%m%d-%H%M%S).flow" \
    --set flow_detail=4 \
    --showhost \
    "! ~d unleash.codeium.com & ! ~d telemetry & ! ~d sentry & ! ~d analytics"
