// =========================================================================
// SPECIMENRY — dictation-status.js
// Tracks whether the offline Whisper dictation model is cached locally, so
// the UI can show "ready offline" vs "needs download" without re-triggering
// the ~75MB model fetch. Loaded as a classic script before app.js
// (see index.html).
// =========================================================================
var SpecimenryDictationStatus = (function() {
    var READY_FLAG_KEY = 'whisper_model_ready';
    var CACHE_NAME_HINT = /transformers|whisper|xenova/i;

    function markReady() {
        try {
            localStorage.setItem(READY_FLAG_KEY, 'true');
        } catch (e) {}
        updateBadge();
    }

    function isModelCached() {
        try {
            if (localStorage.getItem(READY_FLAG_KEY) === 'true') {
                return Promise.resolve(true);
            }
        } catch (e) {}

        if (typeof caches === 'undefined' || !caches.keys) {
            return Promise.resolve(false);
        }

        return caches.keys().then(function(names) {
            var hit = (names || []).some(function(name) { return CACHE_NAME_HINT.test(name); });
            if (hit) return true;

            if (!(window.indexedDB && typeof indexedDB.databases === 'function')) {
                return false;
            }
            return indexedDB.databases().then(function(dbs) {
                return (dbs || []).some(function(db) {
                    return db && db.name && CACHE_NAME_HINT.test(db.name);
                });
            }).catch(function() { return false; });
        }).catch(function() { return false; });
    }

    function getStatusLabel(ready, compact) {
        if (compact) {
            return ready ? 'Offline' : 'Setup';
        }
        return ready ? 'Ready offline' : 'Needs download';
    }

    function getStatusTitle(ready) {
        return ready
            ? 'Dictation model ready — works offline'
            : 'Dictation model not downloaded yet (~75 MB once)';
    }

    function updateBadge() {
        var labels = document.querySelectorAll('#dictation-offline-badge, #dictation-offline-badge-settings');
        if (!labels.length) return;

        isModelCached().then(function(ready) {
            for (var i = 0; i < labels.length; i++) {
                var badge = labels[i];
                var compact = badge.id === 'dictation-offline-badge';
                badge.textContent = getStatusLabel(ready, compact);
                badge.title = getStatusTitle(ready);
                badge.classList.toggle('dictation-ready', !!ready);
                badge.classList.toggle('dictation-needs-download', !ready);
            }
        });
    }

    return {
        isModelCached: isModelCached,
        markReady: markReady,
        getStatusLabel: getStatusLabel,
        getStatusTitle: getStatusTitle,
        updateBadge: updateBadge
    };
})();
