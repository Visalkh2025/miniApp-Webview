let paymentTimeout = null;

function payNow() {

    const paymentData = {
        merchantId: "CAFE001",
        merchantName: "Mini Cafe",
        amount: 5.50,
        currency: "USD",
        orderId: "ORDER001",
        description: "Cafe Payment",
        paymentlink:"https://acledabank.com.kh/acleda?deeplink_menu_id=transfer_to_trading_acs&merchant_id=CSX&payment_data=oNWXAtxk3MgZdS4YDljhri8AhzOdJ48SZBacledabankSecurityTCxRrYd+rBlnnyaVeWfViextlacledabankSecurityTCeSsZ3G+yEJaR6OIipnYU1pmRXGZ1i1H6EfN4KhZVLMWTHZY0YngTereksllw62IugFrp0aWJ7XacledabankSecurityTCJsIacledabankSecurityTCxqDFAbzEbw3BBL1MRHRxwesgxe7Se9aoE8YIB2SJv2tyJWRqvNXKK6qjYxEpqXiZJT20kacledabankSecurityTCJSSf77iWW3dmJCmA2jhvkUag4aY="
    };

    console.log("Mini App Start Payment");

    showLoading(true);

    JBright.call(
        "banking.payment.initiate",
        paymentData
    );

    paymentTimeout = setTimeout(() => {

        showLoading(false);

        localStorage.setItem(
            "paymentResult",
            JSON.stringify({
                status: "pending",
                transactionId: "TXN999888",
                amount: 5.50,
                currency: "USD",
                message: "Waiting for bank confirmation"
            })
        );

        window.location.href =
            "success.html";

    }, 10000);

}


// Native callback from banking app
window.onPaymentResult = function(res) {

    console.log("Native Callback:", res);

    clearTimeout(paymentTimeout);

    showLoading(false);

    if (res.success) {

        localStorage.setItem(
            "paymentResult",
            JSON.stringify({
                status: "success",
                transactionId: res.transactionId,
                amount: res.amount,
                currency: res.currency,
                message: res.message
            })
        );

    } else {

        localStorage.setItem(
            "paymentResult",
            JSON.stringify({
                status: "failed",
                message: res.message || "Payment Failed"
            })
        );

    }

    window.location.href =
        "success.html";

};


// Permissions

function requestCamera() {

    JBright.call(
        "permission.camera",
        {},
        function(res) {

            alert(
                "📷 Camera Permission Granted"
            );

        }
    );

}

function requestContacts() {

    JBright.call(
        "permission.contacts",
        {},
        function(res) {

            alert(
                "👤 Contacts Permission Granted"
            );

        }
    );

}

function requestLocation() {

    JBright.call(
        "permission.location",
        {},
        function(res) {

            alert(
                "📍 Location Permission Granted"
            );

        }
    );

}

function requestPhotos() {

    JBright.call(
        "permission.photos",
        {},
        function(res) {

            alert(
                "🖼️ Photo Permission Granted"
            );

        }
    );

}


// Navigation

function openPermissionPage() {

    window.location.href =
        "permission.html";

}

function goHome() {

    window.location.href =
        "index.html";

}


// Loading UI

function showLoading(show) {

    const loading =
        document.getElementById(
            "loading"
        );

    if (!loading) return;

    loading.style.display =
        show ? "flex" : "none";

}