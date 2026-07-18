// =========================================================================
// SPECIMENRY — qr.js
// Client-side QR generation (no third-party image API).
// Uses QRCode.js when loaded from CDN; falls back to a placeholder SVG.
// =========================================================================
var SpecimenryQR = (function() {
    function makeDataUrl(text, size) {
        size = size || 120;
        text = String(text || '');
        try {
            if (typeof QRCode !== 'undefined') {
                var host = document.createElement('div');
                host.style.cssText = 'position:absolute;left:-9999px;top:0;';
                document.body.appendChild(host);
                var qr = new QRCode(host, {
                    text: text,
                    width: size,
                    height: size,
                    correctLevel: QRCode.CorrectLevel ? QRCode.CorrectLevel.M : 1
                });
                var canvas = host.querySelector('canvas');
                var img = host.querySelector('img');
                var dataUrl = '';
                if (canvas && canvas.toDataURL) {
                    dataUrl = canvas.toDataURL('image/png');
                } else if (img && img.src) {
                    dataUrl = img.src;
                }
                if (qr && typeof qr.clear === 'function') {
                    try { qr.clear(); } catch (e) {}
                }
                if (host.parentNode) host.parentNode.removeChild(host);
                if (dataUrl) return dataUrl;
            }
        } catch (e) {
            console.warn('SpecimenryQR local generation failed:', e);
        }
        // Offline fallback: tiny SVG mark (not scannable) — better than leaking data to a CDN.
        var safe = encodeURIComponent(text.slice(0, 40));
        return 'data:image/svg+xml,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">' +
            '<rect width="100%" height="100%" fill="#fff"/>' +
            '<rect x="8%" y="8%" width="84%" height="84%" fill="none" stroke="#111" stroke-width="4"/>' +
            '<text x="50%" y="52%" text-anchor="middle" font-size="10" fill="#111">QR</text>' +
            '<title>' + safe + '</title></svg>'
        );
    }

    return { makeDataUrl: makeDataUrl };
})();
