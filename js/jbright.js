window.JBright = {

    call: function(action, data, callback) {

        console.log("JBright Action:", action);
        console.log("Payload:", data);

        // Store callback for payment response
        if (callback) {
            window._jbrightPaymentCallback = callback;
        }

        // PAYMENT FLOW
        if (action === "banking.payment.initiate") {

            console.log("Open Native Banking App");

            const payload = {
                action: action,
                data: data
            };

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

                window.AndroidBridge.postMessage(
                    JSON.stringify(payload)
                );
                return;
            }

            console.warn("Native bridge not found");
            return;
        }

        // OTHER ACTIONS
        setTimeout(() => {

            const response = {
                success: true,
                message: "Success",
                action: action
            };

            if (callback) {
                callback(response);
            }

        }, 1000);
    }
};


// ========================================
// NATIVE -> WEB CALLBACK
// ========================================

window.onPaymentResult = function(result) {

    console.log("Payment Result:", result);

    if (
        window._jbrightPaymentCallback &&
        typeof window._jbrightPaymentCallback === "function"
    ) {
        window._jbrightPaymentCallback(result);
    }
};


// ========================================
// TEST FUNCTIONS
// ========================================

// Payment Success
function nativePaymentSuccess() {

    window.onPaymentResult({
        success: true,
        transactionId: "TXN999888",
        amount: 5.50,
        currency: "USD",
        message: "Payment Successful"
    });

}

// Payment Failed
function nativePaymentFailed() {

    window.onPaymentResult({
        success: false,
        message: "Insufficient Balance"
    });

}