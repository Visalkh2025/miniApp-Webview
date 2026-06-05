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
        
        if (action === "banking.payment.initiate") {
            if (data.paymentlink) {
                // ✅ Save callback flag ទៅ localStorage មុន redirect
                localStorage.setItem("pendingPaymentAction", action)
                window.location.href = data.paymentlink
                return
            }
        }
        
        // iOS WKWebView
        if (window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.jbright) {
            window.webkit.messageHandlers.jbright.postMessage({ action, data })
            return
        }
        
        // Android
        if (window.AndroidBridge &&
            typeof window.AndroidBridge.postMessage === "function") {
            window.AndroidBridge.postMessage(JSON.stringify({ action, data }))
            return
        }
        
        console.warn("[JBright] Native bridge not found")
    }
}

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