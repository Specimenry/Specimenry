// =========================================================================
// SPECIMENRY — provenance.js
// PROVENANCE VAULT — paperwork + short collection-restriction cues
// Educational only — not legal advice. Laws change; verify locally.
// Extracted from app.js. Loaded as a classic script before app.js
// (see index.html).
// =========================================================================
var PROVENANCE_DOC_TYPES = [
    { id: 'permit', label: 'Land / collecting permit' },
    { id: 'permission', label: 'Landowner permission' },
    { id: 'receipt', label: 'Purchase / sales receipt' },
    { id: 'export', label: 'Export / import paperwork' },
    { id: 'transfer', label: 'Transfer / chain-of-custody' },
    { id: 'other', label: 'Other provenance document' }
];

var PROVENANCE_RESTRICTIONS = [
    {
        keys: ['china', 'prc', "people's republic of china"],
        level: 'danger',
        title: 'China — export controls',
        text: 'Export tightly regulated. Keep paperwork with the specimen.'
    },
    {
        keys: ['mongolia', 'mongolian'],
        level: 'danger',
        title: 'Mongolia — heritage restrictions',
        text: 'Often treated as state heritage; clear provenance is essential.'
    },
    {
        keys: ['brazil', 'brasil', 'brazilian'],
        level: 'danger',
        title: 'Brazil — export restrictions',
        text: 'National heritage; export restricted. Keep permits on file.'
    },
    {
        keys: ['myanmar', 'burma', 'burmese'],
        level: 'danger',
        title: 'Myanmar — sourcing concerns',
        text: 'May involve serious ethical/legal issues. Prefer documented sources.'
    },
    {
        keys: ['argentina', 'argentine'],
        level: 'warning',
        title: 'Argentina — heritage rules',
        text: 'Protected material; export usually needs authorization.'
    },
    {
        keys: ['chile', 'chilean'],
        level: 'warning',
        title: 'Chile — heritage rules',
        text: 'Paleontological heritage is regulated. Verify permissions.'
    },
    {
        keys: ['national park', 'national monument', 'world heritage', 'unesco', 'nature reserve', 'protected area'],
        level: 'warning',
        title: 'Protected site cue',
        text: 'May be a protected area — confirm collecting rules.'
    }
];

function analyzeProvenanceRestrictions(country, location, formation) {
    var haystack = [country, location, formation].filter(Boolean).join(' ').toLowerCase();
    var alerts = [];
    var seen = {};
    if (!haystack.trim()) return alerts;

    PROVENANCE_RESTRICTIONS.forEach(function(rule) {
        var hit = rule.keys.some(function(k) { return haystack.indexOf(k) !== -1; });
        if (!hit || seen[rule.title]) return;
        seen[rule.title] = true;
        alerts.push({
            level: rule.level,
            title: rule.title,
            text: rule.text
        });
    });

    var rank = { danger: 0, warning: 1, caution: 2, info: 3 };
    alerts.sort(function(a, b) { return (rank[a.level] || 9) - (rank[b.level] || 9); });
    return alerts;
}

function getProvenanceDocTypeLabel(typeId) {
    for (var i = 0; i < PROVENANCE_DOC_TYPES.length; i++) {
        if (PROVENANCE_DOC_TYPES[i].id === typeId) return PROVENANCE_DOC_TYPES[i].label;
    }
    return 'Document';
}

function getProvenanceBadgeHtml(f) {
    if (!f) return '';
    var docs = f.provenanceDocs || [];
    var alerts = analyzeProvenanceRestrictions(f.country, f.location, f.formation);
    var parts = [];
    if (docs.length) {
        parts.push('<span class="provenance-badge has-docs" title="' + docs.length + ' provenance document(s) on file">📜 ' + docs.length + '</span>');
    }
    if (alerts.length) {
        var top = alerts[0];
        var icon = top.level === 'danger' ? '🚫' : (top.level === 'warning' ? '⚠️' : 'ℹ️');
        parts.push('<span class="provenance-badge level-' + escapeHtml(top.level) + '" title="' + escapeHtml(top.title) + '">' + icon + '</span>');
    }
    if (!parts.length) return '';
    return '<div class="provenance-badge-row">' + parts.join('') + '</div>';
}

function renderProvenanceRestrictionHtml(alerts, options) {
    options = options || {};
    if (!alerts || !alerts.length) {
        return '';
    }
    // Keep cues short — the document vault is the main provenance feature.
    var html = '<div class="provenance-alerts provenance-alerts-compact">';
    alerts.forEach(function(a) {
        html += '<div class="provenance-alert level-' + escapeHtml(a.level) + '">' +
            '<div class="provenance-alert-title">' + escapeHtml(a.title) + '</div>' +
            '<div class="provenance-alert-text">' + escapeHtml(a.text) + '</div>' +
            '</div>';
    });
    html += '</div>';
    return html;
}
