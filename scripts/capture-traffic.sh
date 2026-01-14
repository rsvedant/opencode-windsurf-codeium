#!/bin/bash
# Windsurf Traffic Capture Script
# This script helps capture Windsurf's network traffic for reverse-engineering

set -e

CAPTURE_DIR="$HOME/Desktop/Projects/libraries/opencode-windsurf-auth/captures"
MITMPROXY_PORT=8080

echo "=== Windsurf Traffic Capture Setup ==="
echo ""

# Create capture directory
mkdir -p "$CAPTURE_DIR"

# Step 1: Generate mitmproxy CA cert if not exists
if [ ! -f "$HOME/.mitmproxy/mitmproxy-ca-cert.pem" ]; then
    echo "Step 1: Generating mitmproxy CA certificate..."
    echo "Starting mitmproxy briefly to generate certs..."
    timeout 3 mitmproxy --mode regular -p $MITMPROXY_PORT 2>/dev/null || true
    echo "Certs generated at ~/.mitmproxy/"
else
    echo "Step 1: mitmproxy CA cert already exists"
fi

echo ""
echo "Step 2: Trust the CA certificate"
echo "Run this command to add to system keychain:"
echo ""
echo "  sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ~/.mitmproxy/mitmproxy-ca-cert.pem"
echo ""
echo "Or manually: Open ~/.mitmproxy/mitmproxy-ca-cert.pem, add to System keychain, set 'Always Trust'"
echo ""

read -p "Press Enter after trusting the certificate..."

echo ""
echo "Step 3: Starting mitmproxy..."
echo "Captures will be saved to: $CAPTURE_DIR"
echo ""
echo "In another terminal, run:"
echo ""
echo "  HTTP_PROXY=http://localhost:$MITMPROXY_PORT \\"
echo "  HTTPS_PROXY=http://localhost:$MITMPROXY_PORT \\"
echo "  NODE_EXTRA_CA_CERTS=~/.mitmproxy/mitmproxy-ca-cert.pem \\"
echo "  /Applications/Windsurf.app/Contents/MacOS/Electron"
echo ""
echo "Then use Cascade to generate traffic."
echo ""
echo "Press 'q' in mitmproxy to quit and save."
echo ""

# Start mitmproxy with flow saving
mitmdump \
    --mode regular \
    -p $MITMPROXY_PORT \
    --save-stream-file "$CAPTURE_DIR/windsurf-$(date +%Y%m%d-%H%M%S).flow" \
    --set flow_detail=3 \
    -v

echo ""
echo "Capture saved to $CAPTURE_DIR"
