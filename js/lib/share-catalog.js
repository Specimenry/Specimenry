// =========================================================================
// SPECIMENRY — share-catalog.js
// Build a privacy-safe, shareable HTML catalog (no prices / private storage).
// Suitable for sharing with collectors, collaborators, or museums.
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryShareCatalog = (function() {
    // Fields never exported to a public/read-only catalog.
    var PRIVATE_KEYS = {
        price: 1, purchasePrice: 1, salePrice: 1, saleCurrency: 1, cost: 1,
        estimatedValue: 1, value: 1, insuranceValue: 1, acquisitionCost: 1,
        seller: 1, dealer: 1, purchasedFrom: 1, purchaseDate: 1, purchaseNotes: 1,
        storageRoom: 1, storageUnit: 1, storageDrawer: 1, storageBox: 1,
        provenanceDocs: 1, provenanceNotes: 1, legalStatus: 1,
        tradedWith: 1, tradedFor: 1, tradeDate: 1,
        conditionReport: 1, restoration: 1, prepNotes: 1, prepHours: 1,
        prepStabilizers: 1, prepTools: 1, prepMilestones: 1, prepStatus: 1,
        link: 1, sourceLink: 1, urls: 1,
        isForSale: 1, isSold: 1, isWishlist: 1, isDream: 1, isTraded: 1, isCartItem: 1,
        changeLog: 1
    };

    function pickPublicSpecimen(f, options) {
        options = options || {};
        if (!f || f.isCartItem) return null;
        // Default: owned collection only (not wishlist/sale/dream carts)
        if (!options.includeWishlist && f.isWishlist) return null;
        if (!options.includeForSale && f.isForSale) return null;
        if (!options.includeSold && f.isSold) return null;
        if (!options.includeDream && f.isDream) return null;
        if (f.isTraded && !options.includeTraded) return null;

        var images = [];
        if (options.includePhotos !== false) {
            var src = f.images || [];
            var max = Math.max(0, options.maxPhotosPerSpecimen || 1);
            for (var i = 0; i < src.length && images.length < max; i++) {
                var img = src[i];
                if (!img) continue;
                if (typeof img === 'string') images.push(img);
                else if (img.data) images.push(img.data);
                else if (img.url) images.push(img.url);
                else if (img.src) images.push(img.src);
            }
        }

        // Whitelist-only — never Object.assign from the specimen (PRIVATE_KEYS is the denylist of fields that must never appear here).
        var out = {
            id: f.id || '',
            type: f.type || 'fossil',
            specimen: f.specimen || '',
            anatomy: f.anatomy || '',
            category: f.category || '',
            fossilType: f.fossilType || '',
            geologicalPeriod: f.geologicalPeriod || '',
            epoch: f.epoch || '',
            stratAge: f.stratAge || '',
            ageMa: f.ageMa != null ? f.ageMa : null,
            country: f.country || '',
            location: f.location || '',
            formation: f.formation || '',
            lat: (options.includeCoordinates !== false && f.lat != null) ? f.lat : null,
            lng: (options.includeCoordinates !== false && f.lng != null) ? f.lng : null,
            formula: f.formula || '',
            crystalSystem: f.crystalSystem || '',
            hardness: f.hardness != null ? f.hardness : null,
            color: f.color || '',
            luster: f.luster || '',
            streak: f.streak || '',
            cleavage: f.cleavage || '',
            taxonomy: f.taxonomy || null,
            description: options.includeNotes ? (f.description || '') : '',
            etymology: f.etymology || '',
            notes: options.includeNotes ? (f.notes || '') : '',
            tags: Array.isArray(f.tags) ? f.tags.slice() : [],
            isSelfFound: !!f.isSelfFound,
            tripId: f.tripId || '',
            images: images
        };

        Object.keys(out).forEach(function(k) {
            if (PRIVATE_KEYS[k]) delete out[k];
        });
        return out;
    }

    function buildPayload(fossilsList, options) {
        options = options || {};
        var items = [];
        (fossilsList || []).forEach(function(f) {
            var pub = pickPublicSpecimen(f, options);
            if (pub) items.push(pub);
        });
        items.sort(function(a, b) {
            return String(a.specimen || '').localeCompare(String(b.specimen || ''));
        });
        return {
            format: 'specimenry-public-catalog',
            version: 1,
            generatedAt: new Date().toISOString(),
            title: options.title || 'Specimen Catalog',
            collector: options.collector || '',
            blurb: options.blurb || '',
            privacy: {
                pricesExcluded: true,
                storageExcluded: true,
                provenanceDocsExcluded: true,
                personalContactsExcluded: true
            },
            count: items.length,
            specimens: items
        };
    }

    function escapeHtmlAttr(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function renderHtml(payload) {
        var dataJson = JSON.stringify(payload).replace(/</g, '\\u003c');
        var title = payload.title || 'Specimen Catalog';
        var collector = payload.collector || '';
        var blurb = payload.blurb || '';

        return '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n' +
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
            '<title>' + escapeHtmlAttr(title) + '</title>\n' +
            '<style>\n' +
            ':root{--ink:#1c1917;--muted:#78716c;--paper:#faf7f2;--card:#fff;--line:#e7e5e4;--accent:#7a5c12;}\n' +
            '*{box-sizing:border-box}\n' +
            'body{margin:0;font-family:"Segoe UI",system-ui,sans-serif;background:linear-gradient(180deg,#f3efe6 0%,var(--paper) 40%);color:var(--ink);line-height:1.45}\n' +
            'header{padding:2.5rem 1.25rem 1.5rem;max-width:1100px;margin:0 auto}\n' +
            'h1{font-family:Georgia,"Times New Roman",serif;font-weight:700;font-size:clamp(1.8rem,4vw,2.6rem);margin:0 0 .35rem;letter-spacing:-0.02em}\n' +
            '.meta{color:var(--muted);font-size:.9rem}\n' +
            '.blurb{max-width:42rem;margin-top:.85rem;font-size:1rem}\n' +
            '.privacy{display:inline-block;margin-top:1rem;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--accent);border:1px solid rgba(139,105,20,.35);padding:.25rem .55rem;border-radius:999px;background:rgba(139,105,20,.08)}\n' +
            '.toolbar{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;max-width:1100px;margin:0 auto 1rem;padding:0 1.25rem}\n' +
            '.toolbar input,.toolbar select{padding:.45rem .65rem;border:1px solid var(--line);border-radius:8px;background:#fff;font:inherit}\n' +
            '.toolbar input{flex:1;min-width:180px}\n' +
            '.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem;max-width:1100px;margin:0 auto 3rem;padding:0 1.25rem}\n' +
            'article{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 24px rgba(28,25,23,.04)}\n' +
            '.thumb{aspect-ratio:4/3;background:#ebe6dc;display:flex;align-items:center;justify-content:center;overflow:hidden}\n' +
            '.thumb img{width:100%;height:100%;object-fit:cover}\n' +
            '.body{padding:1rem 1.05rem 1.15rem;flex:1;display:flex;flex-direction:column;gap:.35rem}\n' +
            '.name{font-family:Georgia,serif;font-size:1.15rem;margin:0}\n' +
            '.name em{font-style:italic}\n' +
            '.id{font-size:.7rem;font-weight:700;letter-spacing:.06em;color:var(--accent);text-transform:uppercase}\n' +
            '.facts{font-size:.82rem;color:var(--muted);margin:0}\n' +
            '.tags{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.35rem}\n' +
            '.tag{font-size:.65rem;background:#f5f0e8;border:1px solid var(--line);border-radius:999px;padding:.15rem .45rem;color:var(--muted)}\n' +
            'footer{max-width:1100px;margin:0 auto 2rem;padding:0 1.25rem;font-size:.75rem;color:var(--muted)}\n' +
            '@media print{body{background:#fff}.toolbar{display:none}article{break-inside:avoid;box-shadow:none}}\n' +
            '</style>\n</head>\n<body>\n' +
            '<header>\n' +
            '<h1 id="cat-title"></h1>\n' +
            '<div class="meta" id="cat-meta"></div>\n' +
            '<p class="blurb" id="cat-blurb"></p>\n' +
            '<span class="privacy">Read-only · No prices · No private storage</span>\n' +
            '</header>\n' +
            '<div class="toolbar">\n' +
            '<input type="search" id="q" placeholder="Search name, locality, period…" aria-label="Search catalog">\n' +
            '<select id="type-filter" aria-label="Filter type"><option value="">All types</option><option value="fossil">Fossils</option><option value="mineral">Minerals</option></select>\n' +
            '<button type="button" onclick="window.print()" style="padding:.45rem .8rem;border-radius:8px;border:1px solid var(--line);background:#fff;font:inherit;cursor:pointer">Print</button>\n' +
            '</div>\n' +
            '<main class="grid" id="grid"></main>\n' +
            '<footer>Generated with Specimenry · Public catalog export · ' + escapeHtmlAttr(payload.generatedAt || '') + '</footer>\n' +
            '<script>\n' +
            'var CATALOG = ' + dataJson + ';\n' +
            'function esc(s){return String(s||"").replace(/[&<>\"\']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;","\'":"&#39;"})[c];});}\n' +
            'function formatName(s,type){s=s||"Untitled";if(type==="mineral")return esc(s);var w=s.split(/\\s+/);if(w.length>=2&&/^[A-Z][a-z]+$/.test(w[0])&&/^[a-z]+$/.test(w[1]))return "<em>"+esc(w[0]+" "+w[1])+"</em>"+(w.length>2?" "+esc(w.slice(2).join(" ")):"");return esc(s);}\n' +
            'function render(){var q=(document.getElementById("q").value||"").toLowerCase();var t=document.getElementById("type-filter").value;var grid=document.getElementById("grid");grid.innerHTML="";(CATALOG.specimens||[]).forEach(function(f){if(t&&f.type!==t)return;var hay=[f.specimen,f.category,f.country,f.location,f.formation,f.geologicalPeriod,(f.tags||[]).join(" ")].join(" ").toLowerCase();if(q&&hay.indexOf(q)===-1)return;var loc=[f.location,f.country].filter(Boolean).join(", ");var geo=[f.geologicalPeriod,f.epoch,f.ageMa!=null?("~"+f.ageMa+" Ma"):""].filter(Boolean).join(" · ");var img=(f.images&&f.images[0])?("<img src=\\""+f.images[0].replace(/"/g,"&quot;")+"\\" alt=\\"\\">"):("<span style=\\"color:#a8a29e\\">No photo</span>");var tags=(f.tags||[]).slice(0,6).map(function(tag){return "<span class=\\"tag\\">"+esc(tag)+"</span>";}).join("");grid.innerHTML+="<article><div class=\\"thumb\\">"+img+"</div><div class=\\"body\\"><div class=\\"id\\">"+esc(f.id)+"</div><h2 class=\\"name\\">"+formatName(f.specimen,f.type)+"</h2><p class=\\"facts\\">"+esc(f.category||f.type)+"</p>"+(geo?"<p class=\\"facts\\">"+esc(geo)+"</p>":"")+(loc?"<p class=\\"facts\\">"+esc(loc)+"</p>":"")+(f.formation?"<p class=\\"facts\\">"+esc(f.formation)+"</p>":"")+(f.notes?"<p class=\\"facts\\">"+esc(f.notes.slice(0,160))+(f.notes.length>160?"…":"")+"</p>":"")+(tags?"<div class=\\"tags\\">"+tags+"</div>":"")+"</div></article>";});}\n' +
            'document.getElementById("cat-title").textContent=CATALOG.title||"Specimen Catalog";\n' +
            'document.getElementById("cat-meta").textContent=(CATALOG.collector?CATALOG.collector+" · ":"")+CATALOG.count+" specimens · exported "+(CATALOG.generatedAt||"").slice(0,10);\n' +
            'document.getElementById("cat-blurb").textContent=CATALOG.blurb||"";\n' +
            'document.getElementById("q").addEventListener("input",render);\n' +
            'document.getElementById("type-filter").addEventListener("change",render);\n' +
            'render();\n' +
            '</script>\n</body>\n</html>';
    }

    function downloadHtml(payload, filename) {
        var html = renderHtml(payload);
        var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = filename || 'specimenry-catalog.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function() { URL.revokeObjectURL(url); }, 1500);
        return html;
    }

    function openPreview(payload) {
        var html = renderHtml(payload);
        var w = window.open('', '_blank');
        if (!w) return null;
        w.document.write(html);
        w.document.close();
        return w;
    }

    /** Metadata-only catalog for URL hash sharing (no photos — keeps links short). */
    function slimPayloadForLink(payload) {
        var slim = {
            format: payload.format,
            version: payload.version,
            generatedAt: payload.generatedAt,
            title: payload.title,
            collector: payload.collector,
            blurb: payload.blurb,
            privacy: payload.privacy,
            count: payload.count,
            specimens: (payload.specimens || []).map(function(s) {
                var copy = {};
                Object.keys(s).forEach(function(k) {
                    if (k === 'images') return;
                    copy[k] = s[k];
                });
                copy.images = [];
                return copy;
            })
        };
        return slim;
    }

    function encodeShareLink(payload, baseUrl) {
        var slim = slimPayloadForLink(payload);
        var json = JSON.stringify(slim);
        var b64 = btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        var base = baseUrl || (window.location.origin + window.location.pathname);
        var url = base + '#catalog=' + b64;
        return {
            url: url,
            bytes: json.length,
            tooLarge: url.length > 28000
        };
    }

    function decodeShareLink(hash) {
        if (!hash) return null;
        var m = String(hash).match(/[#&?]catalog=([^&]+)/);
        if (!m) return null;
        try {
            var b64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4) b64 += '=';
            var json = decodeURIComponent(escape(atob(b64)));
            var data = JSON.parse(json);
            if (!data || data.format !== 'specimenry-public-catalog') return null;
            return data;
        } catch (e) {
            return null;
        }
    }

    return {
        PRIVATE_KEYS: PRIVATE_KEYS,
        pickPublicSpecimen: pickPublicSpecimen,
        buildPayload: buildPayload,
        renderHtml: renderHtml,
        downloadHtml: downloadHtml,
        openPreview: openPreview,
        slimPayloadForLink: slimPayloadForLink,
        encodeShareLink: encodeShareLink,
        decodeShareLink: decodeShareLink
    };
})();
