// ========================================
// JBRIGHT NATIVE BRIDGE
// ========================================

window.JBright = {
    callbacks: {},
    call: function (action, data = {}, callback = null) {
        console.log("[JBright] Action:", action);
        console.log("[JBright] Payload:", data);

        if (callback) {
            this.callbacks[action] = callback;
        }

        const payload = { action, data };

        // ✅ ADD នៅទីនេះ — មុន iOS/Android check
        if (action === "banking.payment.initiate") {
            if (data.paymentlink) {
                window.location.href = data.paymentlink;
                return;
            }
        }

        // iOS WKWebView
        if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.jbright
        ) {
            window.webkit.messageHandlers.jbright.postMessage(payload);
            return;
        }

        // Android WebView
        if (
            window.AndroidBridge &&
            typeof window.AndroidBridge.postMessage === "function"
        ) {
            window.AndroidBridge.postMessage(JSON.stringify(payload));
            return;
        }

        console.warn("[JBright] Native bridge not found");
    }
};


// ========================================
// NATIVE CALLBACK
// ========================================

window.onNativeResult = function (
    action,
    result
) {

    console.log(
        "[JBright] Native Result:",
        action,
        result
    );

    const callback =
        window.JBright.callbacks[action];

    if (
        callback &&
        typeof callback === "function"
    ) {

        callback(result);

        delete window.JBright.callbacks[action];
    }

};