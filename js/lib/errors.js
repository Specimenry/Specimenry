// =========================================================================
// SPECIMENRY — errors.js
// Unified error reporting: consistent logging + user-facing toast, with an
// optional clickable "Retry" action. Loaded as a classic script before
// app.js (see index.html) so it must not depend on anything from app.js.
// =========================================================================
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeHtmlAttr(str) {
    return escapeHtml(str);
}

var SpecimenryErrors = {
    lastError: null,
    _retrySeq: 0,

    _normalizeType: function(type) {
        var t = (type || 'error').toLowerCase();
        if (t === 'danger') t = 'error';
        if (t !== 'success' && t !== 'error' && t !== 'warning' && t !== 'info') t = 'error';
        return t;
    },

    _logToConsole: function(type, context, err) {
        var prefix = '[Specimenry]' + (context ? ' [' + context + ']' : '');
        if (type === 'error') console.error(prefix, err);
        else if (type === 'warning') console.warn(prefix, err);
        else console.log(prefix, err);
    },

    // report(err, context, options) — options: { type, duration, retry }
    report: function(err, context, options) {
        options = options || {};
        var type = this._normalizeType(options.type);
        var message = (err && err.message) ? err.message : String(err || 'Unknown error');

        this.lastError = {
            error: err,
            context: context || '',
            type: type,
            time: Date.now()
        };

        this._logToConsole(type, context, err);

        var toastMsg = escapeHtmlForToast(message);
        if (context) toastMsg = escapeHtmlForToast(context) + ': ' + toastMsg;

        var retryId = null;
        if (typeof options.retry === 'function') {
            retryId = 'specimenry-retry-' + (++this._retrySeq);
            toastMsg += ' <a href="#" id="' + retryId + '" class="specimenry-retry-link" ' +
                'style="text-decoration:underline; font-weight:700; margin-left:0.35rem; cursor:pointer;">Retry</a>';
        }

        if (window.app && typeof window.app.showToast === 'function') {
            window.app.showToast(toastMsg, type, options.duration);
        } else {
            this._logToConsole(type, context, message);
        }

        if (retryId) {
            var retryFn = options.retry;
            var self = this;
            setTimeout(function() {
                var el = document.getElementById(retryId);
                if (!el) return;
                el.addEventListener('click', function(evt) {
                    evt.preventDefault();
                    try {
                        retryFn();
                    } catch (retryErr) {
                        self.report(retryErr, context, { type: 'error' });
                    }
                });
            }, 0);
        }

        return this.lastError;
    },

    // wrap(promise, context, options) — reports+rethrows on rejection
    wrap: function(promise, context, options) {
        var self = this;
        return promise.catch(function(err) {
            self.report(err, context, options);
            throw err;
        });
    }
};

function escapeHtmlForToast(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

function reportAppError(err, context, options) {
    return SpecimenryErrors.report(err, context, options);
}
