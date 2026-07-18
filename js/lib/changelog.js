// =========================================================================
// SPECIMENRY — changelog.js
// Local per-specimen change history (what / when / actor — no accounts).
// Loaded as a classic script before app.js (see index.html).
// =========================================================================
var SpecimenryChangeLog = (function() {
    var MAX_ENTRIES = 80;
    var ACTOR_KEY = 'pref_curator_name';

    // Fields worth logging (images/docs excluded — too noisy / large).
    var TRACKED = {
        specimen: 'Name',
        category: 'Category',
        fossilType: 'Fossil type',
        type: 'Specimen type',
        anatomy: 'Anatomy',
        country: 'Country',
        location: 'Locality',
        formation: 'Formation',
        geologicalPeriod: 'Period',
        epoch: 'Epoch',
        stratAge: 'Age (stage)',
        ageMa: 'Age (Ma)',
        lat: 'Latitude',
        lng: 'Longitude',
        formula: 'Formula',
        crystalSystem: 'Crystal system',
        hardness: 'Hardness',
        color: 'Color',
        price: 'Purchase price',
        currency: 'Purchase currency',
        estimatedValue: 'Estimated value',
        estimatedCurrency: 'Estimated currency',
        salePrice: 'Sale price',
        saleCurrency: 'Sale currency',
        notes: 'Notes',
        description: 'Description',
        etymology: 'Etymology',
        tags: 'Tags',
        tripId: 'Field trip',
        isWishlist: 'Wishlist',
        isSold: 'Sold',
        isForSale: 'For sale',
        isTraded: 'Traded',
        isDream: 'Dream',
        isSelfFound: 'Self found',
        tradedWith: 'Traded with',
        tradedFor: 'Traded for',
        tradeDate: 'Trade date',
        storageRoom: 'Storage room',
        storageUnit: 'Storage unit',
        storageDrawer: 'Storage drawer',
        storageBox: 'Storage box',
        legalStatus: 'Legal status',
        accessionCode: 'Accession code'
    };

    function getActor() {
        try {
            var name = (localStorage.getItem(ACTOR_KEY) || '').trim();
            if (name) return name;
        } catch (e) {}
        return 'Local curator';
    }

    function setActor(name) {
        try {
            localStorage.setItem(ACTOR_KEY, (name || '').trim());
        } catch (e) {}
    }

    function normalizeValue(field, value) {
        if (value === undefined || value === null || value === '') return '';
        if (field === 'tags') {
            if (Array.isArray(value)) return value.slice().map(String).sort().join(', ');
            return String(value);
        }
        if (typeof value === 'boolean') return value ? 'yes' : 'no';
        if (typeof value === 'number') return String(value);
        return String(value);
    }

    function diff(before, after) {
        var changes = [];
        if (!after) return changes;
        before = before || {};
        Object.keys(TRACKED).forEach(function(field) {
            var from = normalizeValue(field, before[field]);
            var to = normalizeValue(field, after[field]);
            if (from === to) return;
            changes.push({
                field: field,
                label: TRACKED[field],
                from: from,
                to: to
            });
        });
        return changes;
    }

    function summarize(changes) {
        if (!changes || !changes.length) return '';
        return changes.map(function(c) {
            var label = (c.label || c.field || '').toLowerCase();
            if (c.field === 'price' || c.field === 'salePrice' || c.field === 'estimatedValue') {
                return label + ' changed';
            }
            if (c.field === 'location' || c.field === 'country' || c.field === 'formation') {
                return 'locality corrected';
            }
            if (c.field === 'isSold' && c.to === 'yes') return 'marked as sold';
            if (c.field === 'isTraded' && c.to === 'yes') return 'marked as traded';
            if (c.field === 'tripId') return 'trip link updated';
            return label + ' updated';
        }).filter(function(s, i, arr) {
            return arr.indexOf(s) === i;
        }).join('; ');
    }

    function applyDiff(nextFossil, previousFossil, options) {
        options = options || {};
        if (!nextFossil) return nextFossil;
        var changes = diff(previousFossil, nextFossil);
        if (!changes.length) return nextFossil;

        var entry = {
            at: Date.now(),
            actor: options.actor || getActor(),
            summary: summarize(changes),
            changes: changes
        };

        var log = Array.isArray(nextFossil.changeLog) ? nextFossil.changeLog.slice() : [];
        // Prefer previous log if next was stripped/stale empty during partial updates
        if ((!log.length) && previousFossil && Array.isArray(previousFossil.changeLog)) {
            log = previousFossil.changeLog.slice();
        }
        log.unshift(entry);
        if (log.length > MAX_ENTRIES) log = log.slice(0, MAX_ENTRIES);
        nextFossil.changeLog = log;
        return nextFossil;
    }

    function renderHtml(changeLog, options) {
        options = options || {};
        var log = Array.isArray(changeLog) ? changeLog : [];
        if (!log.length) {
            return options.showEmpty
                ? '<div class="change-log-empty">No changes recorded yet. Edits are logged automatically on this device.</div>'
                : '';
        }
        var limit = options.limit || 12;
        var html = '<div class="change-log-list">';
        log.slice(0, limit).forEach(function(entry) {
            var when = '';
            try {
                when = new Date(entry.at).toLocaleString();
            } catch (e) {
                when = String(entry.at || '');
            }
            html += '<div class="change-log-entry">' +
                '<div class="change-log-meta">' + escapeHtml(when) +
                ' · ' + escapeHtml(entry.actor || 'Local curator') + '</div>' +
                '<div class="change-log-summary">' + escapeHtml(entry.summary || 'Updated') + '</div>';
            if (entry.changes && entry.changes.length && options.showDetails !== false) {
                html += '<ul class="change-log-details">';
                entry.changes.slice(0, 8).forEach(function(c) {
                    html += '<li><strong>' + escapeHtml(c.label || c.field) + '</strong>: ' +
                        '<span class="from">' + escapeHtml(c.from || '—') + '</span> → ' +
                        '<span class="to">' + escapeHtml(c.to || '—') + '</span></li>';
                });
                html += '</ul>';
            }
            html += '</div>';
        });
        if (log.length > limit) {
            html += '<div class="change-log-more">+' + (log.length - limit) + ' older entries</div>';
        }
        html += '</div>';
        return html;
    }

    return {
        TRACKED: TRACKED,
        MAX_ENTRIES: MAX_ENTRIES,
        getActor: getActor,
        setActor: setActor,
        diff: diff,
        summarize: summarize,
        applyDiff: applyDiff,
        renderHtml: renderHtml
    };
})();
