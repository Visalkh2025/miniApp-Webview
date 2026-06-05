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
        
        // ✅ iOS WKWebView — Swift handle
        if (window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.jbright) {
            window.webkit.messageHandlers.jbright.postMessage({ action, data });
            return; // ← Swift handle ទាំងអស់ — JS មិន timeout
        }
        
        // ✅ Android
        if (window.AndroidBridge &&
            typeof window.AndroidBridge.postMessage === "function") {
            window.AndroidBridge.postMessage(JSON.stringify({ action, data }));
            return;
        }
        
        // ✅ Browser fallback — redirect paymentlink ផ្ទាល់
        if (action === "banking.payment.initiate" && data.paymentlink) {
            window.location.href = data.paymentlink;
            return; // ← មិន run timeout
        }
        
        console.warn("[JBright] Native bridge not found");
    }
};

// ========================================
// NATIVE CALLBACK
// ========================================
window.onNativeResult = function(action, result) {
    console.log("[JBright] Native Result:", action, result)
    
    const callback = window.JBright.callbacks[action]
    if (callback && typeof callback === "function") {
        callback(result)
        delete window.JBright.callbacks[action]
        return
    }
    
    // ✅ Fallback — បើ callback lost after redirect
    if (action === "banking.payment.initiate") {
        if (result.success) {
            localStorage.setItem("paymentResult", JSON.stringify({
                status: "success",
                transactionId: result.transactionId,
                amount: result.amount,
                currency: result.currency,
                message: result.message
            }))
        } else {
            localStorage.setItem("paymentResult", JSON.stringify({
                status: "failed",
                message: result.message || "Payment Failed"
            }))
        }
        // ✅ Navigate to success.html
        window.location.href = "success.html"
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