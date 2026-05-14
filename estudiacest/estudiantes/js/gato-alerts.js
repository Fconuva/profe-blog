(function () {
    'use strict';

    var STYLE_ID = 'gatoAlertStyles';
    var BANNER_ID = 'gatoAlertBanner';
    var hideTimer = null;
    var audioContext = null;

    function ensureStyles() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = '.gato-alert-banner{position:fixed;right:18px;bottom:18px;z-index:2500;max-width:320px;padding:16px 16px 14px;border-radius:18px;background:linear-gradient(135deg,rgba(8,47,73,.96),rgba(14,116,144,.92),rgba(15,23,42,.96));border:1px solid rgba(103,232,249,.34);box-shadow:0 18px 48px rgba(0,0,0,.34);color:#ecfeff;transform:translateY(30px);opacity:0;pointer-events:none;transition:opacity .24s,transform .24s}.gato-alert-banner.show{opacity:1;transform:translateY(0);pointer-events:auto}.gato-alert-title{font-size:15px;font-weight:900;margin-bottom:4px}.gato-alert-copy{font-size:13px;line-height:1.45;color:#cffafe;margin-bottom:12px}.gato-alert-actions{display:flex;gap:8px}.gato-alert-btn{border:none;border-radius:999px;padding:9px 14px;font:inherit;font-size:12px;font-weight:800;cursor:pointer}.gato-alert-btn.primary{background:#fbbf24;color:#082f49}.gato-alert-btn.secondary{background:rgba(255,255,255,.12);color:#ecfeff}';
        document.head.appendChild(style);
    }

    function hideBanner() {
        var banner = document.getElementById(BANNER_ID);
        if (!banner) return;
        banner.classList.remove('show');
    }

    function ensureBanner(openUrl) {
        ensureStyles();
        var banner = document.getElementById(BANNER_ID);
        if (banner) {
            banner.setAttribute('data-open-url', openUrl || 'arena-gato.html');
            return banner;
        }
        banner = document.createElement('div');
        banner.id = BANNER_ID;
        banner.className = 'gato-alert-banner';
        banner.setAttribute('data-open-url', openUrl || 'arena-gato.html');
        banner.innerHTML = '<div class="gato-alert-title"></div><div class="gato-alert-copy"></div><div class="gato-alert-actions"><button class="gato-alert-btn primary" type="button" data-action="open">Abrir gato</button><button class="gato-alert-btn secondary" type="button" data-action="close">Cerrar</button></div>';
        banner.querySelector('[data-action="open"]').addEventListener('click', function () {
            var targetUrl = banner.getAttribute('data-open-url') || 'arena-gato.html';
            window.location.href = targetUrl;
        });
        banner.querySelector('[data-action="close"]').addEventListener('click', hideBanner);
        document.body.appendChild(banner);
        return banner;
    }

    function showBanner(challenge, openUrl) {
        var banner = ensureBanner(openUrl);
        banner.querySelector('.gato-alert-title').textContent = 'Te han desafiado a un gato';
        banner.querySelector('.gato-alert-copy').textContent = (challenge.challengerName || 'Un companero') + ' quiere jugar tres en linea contigo.';
        banner.classList.add('show');
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(hideBanner, 9000);
    }

    function unlockAudio() {
        try {
            if (audioContext && audioContext.state === 'suspended') audioContext.resume();
        } catch (e) {}
    }

    function playTone() {
        try {
            var AudioContextCtor = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextCtor) return;
            audioContext = audioContext || new AudioContextCtor();
            if (audioContext.state === 'suspended') audioContext.resume();
            var now = audioContext.currentTime;
            var osc = audioContext.createOscillator();
            var gain = audioContext.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(740, now);
            osc.frequency.linearRampToValueAtTime(920, now + 0.09);
            gain.gain.setValueAtTime(0.0001, now);
            gain.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.2);
        } catch (e) {}
    }

    document.addEventListener('pointerdown', unlockAudio, false);

    window.initGatoChallengeAlerts = function (options) {
        if (!options || !options.auth || !options.db || !options.base) return;

        var activeRef = null;
        options.auth.onAuthStateChanged(function (user) {
            if (activeRef) {
                activeRef.off();
                activeRef = null;
            }
            if (!user) return;

            var storageKey = 'gatoLastSeen:' + (options.storageScope || 'default') + ':' + user.uid;
            activeRef = options.db.ref(options.base + '/arena/gato/incoming/' + user.uid).limitToLast(5);
            activeRef.on('value', function (snap) {
                if (!snap.exists()) return;

                var latestPending = null;
                snap.forEach(function (child) {
                    var value = child.val() || {};
                    if (value.status !== 'pending') return;
                    if (value.challengerUid === user.uid) return;
                    latestPending = {
                        id: child.key,
                        challengerName: value.challengerName || 'Un companero',
                        createdAt: value.createdAt || 0
                    };
                });

                if (!latestPending) return;

                var lastSeenId = '';
                try {
                    lastSeenId = window.localStorage.getItem(storageKey) || '';
                } catch (e) {}

                if (lastSeenId === latestPending.id) return;
                if (latestPending.createdAt && latestPending.createdAt < Date.now() - 86400000) {
                    try {
                        window.localStorage.setItem(storageKey, latestPending.id);
                    } catch (e) {}
                    return;
                }

                try {
                    window.localStorage.setItem(storageKey, latestPending.id);
                } catch (e) {}

                showBanner(latestPending, options.openUrl || 'arena-gato.html');
                playTone();
            });
        });
    };
}());