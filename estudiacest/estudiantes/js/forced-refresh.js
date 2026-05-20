(function () {
    function initStudentForcedRefresh(options) {
        if (!options || window.__studentForcedRefreshInitialized) return;

        const auth = options.auth;
        const db = options.db;
        const base = options.base;
        if (!auth || !db || !base) return;

        window.__studentForcedRefreshInitialized = true;

        let listeners = [];
        let reloadTriggered = false;

        function clearListeners() {
            listeners.forEach(stop => stop());
            listeners = [];
        }

        auth.onAuthStateChanged(async (user) => {
            clearListeners();
            reloadTriggered = false;

            if (!user) return;

            const pageStartedAt = Date.now();

            try {
                const cursoSnap = await db.ref(base + '/estudiantes/' + user.uid + '/curso').once('value');
                const curso = cursoSnap.val();
                const refs = [
                    db.ref(base + '/admin_refresh/all'),
                    db.ref(base + '/admin_refresh/estudiantes/' + user.uid)
                ];

                if (curso) refs.push(db.ref(base + '/admin_refresh/cursos/' + curso));

                refs.forEach(ref => {
                    const handler = (snap) => {
                        const data = snap.val();
                        const timestamp = Number(data && data.timestamp);
                        if (!timestamp || timestamp <= pageStartedAt || reloadTriggered) return;

                        const lastSeen = Number(sessionStorage.getItem('student-force-refresh-ts') || 0);
                        if (timestamp <= lastSeen) return;

                        reloadTriggered = true;
                        sessionStorage.setItem('student-force-refresh-ts', String(timestamp));

                        // Prevent strikes and bypass confirm box
                        window.isForceReloading = true;
                        window.isUnloading = true;

                        // Safely autoSave first if available, then reload
                        if (typeof window.autoSave === 'function') {
                            window.autoSave().then(() => {
                                window.location.reload();
                            }).catch(() => {
                                window.location.reload();
                            });
                        } else {
                            window.location.reload();
                        }
                    };

                    ref.on('value', handler);
                    listeners.push(() => ref.off('value', handler));
                });
            } catch (error) {
                console.warn('[force-refresh] Unable to bind listener', error);
            }
        });
    }

    window.initStudentForcedRefresh = initStudentForcedRefresh;
})();