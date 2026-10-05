/* =========================================
   API
========================================= */

const API_BASE_URL = "http://127.0.0.1:8080";


/* =========================================
   PAYMENT DATA
========================================= */

let payments = [];


/* =========================================
   ELEMENTS
========================================= */

const paymentTableBody =
    document.getElementById("payment-table-body");

const noResults =
    document.getElementById("no-results");

const searchInput =
    document.getElementById("payment-search");

const statusFilter =
    document.getElementById("status-filter");

const methodFilter =
    document.getElementById("method-filter");

const totalPayments =
    document.getElementById("total-payments");

const completedPayments =
    document.getElementById("completed-payments");

const pendingPayments =
    document.getElementById("pending-payments");

const totalRevenue =
    document.getElementById("total-revenue");

const modal =
    document.getElementById("payment-modal");

const modalClose =
    document.getElementById("modal-close");

const paymentDetails =
    document.getElementById("payment-details");


/* =========================================
   FORMAT CURRENCY
========================================= */

function formatCurrency(amount) {

    const numericAmount =
        Number(amount);

    if (Number.isNaN(numericAmount)) {
        return "Rs.0.00";
    }

    return `Rs.${numericAmount.toFixed(2)}`;
}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateValue) {

    if (!dateValue) {
        return "N/A";
    }

    const date =
        new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    );
}


/* =========================================
   DISPLAY PAYMENT METHOD
========================================= */

function formatPaymentMethod(method) {

    if (method === "CASH") {
        return "Cash on Delivery";
    }

    if (method === "ONLINE") {
        return "Online";
    }

    return method || "N/A";
}


/* =========================================
   DISPLAY PAYMENT STATUS
========================================= */

function formatPaymentStatus(status) {

    if (status === "PAID") {
        return "Paid";
    }

    if (status === "PENDING") {
        return "Pending";
    }

    if (status === "FAILED") {
        return "Failed";
    }

    return status || "Unknown";
}


/* =========================================
   STATUS CLASS
========================================= */

function getStatusClass(status) {

    return String(status)
        .toLowerCase()
        .replace(/\s+/g, "-");
}


/* =========================================
   LOAD PAYMENTS
========================================= */

async function loadPayments() {

    try {

        const [
            paymentsResponse,
            ordersResponse,
            customersResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/api/payments`,
                {
                    method: "GET",
                    credentials: "include"
                }
            ),

            fetch(
                `${API_BASE_URL}/api/orders`,
                {
                    method: "GET",
                    credentials: "include"
                }
            ),

            fetch(
                `${API_BASE_URL}/api/users/customers`,
                {
                    method: "GET",
                    credentials: "include"
                }
            )

        ]);


        if (!paymentsResponse.ok) {

            throw new Error(
                `Unable to load payments. Status: ${paymentsResponse.status}`
            );
        }


        if (!ordersResponse.ok) {

            throw new Error(
                `Unable to load orders. Status: ${ordersResponse.status}`
            );
        }


        if (!customersResponse.ok) {

            throw new Error(
                `Unable to load customers. Status: ${customersResponse.status}`
            );
        }


        const paymentData =
            await paymentsResponse.json();

        const orderData =
            await ordersResponse.json();

        const customerData =
            await customersResponse.json();


        /*
         * Match:
         *
         * payment.order_id
         *       ↓
         * order.order_id
         *       ↓
         * order.user_id
         *       ↓
         * customer.id
         */

        payments =
            paymentData.map(payment => {

                const order =
                    orderData.find(
                        item =>
                            item.order_id ===
                            payment.order_id
                    );


                let customerName =
                    "Unknown Customer";


                if (order) {

                    const customer =
                        customerData.find(
                            item =>
                                item.id ===
                                order.user_id
                        );


                    if (customer) {

                        customerName =
                            customer.name;

                    }

                }


                return {

                    paymentId:
                        payment.payment_id,

                    orderId:
                        payment.order_id,

                    customer:
                        customerName,

                    amount:
                        Number(payment.amount),

                    method:
                        formatPaymentMethod(
                            payment.payment_method
                        ),

                    date:
                        formatDate(
                            payment.payment_date
                        ),

                    status:
                        formatPaymentStatus(
                            payment.payment_status
                        )

                };

            });


        console.log(
            "Payments loaded from database:",
            payments
        );


        updateSummary();

        filterPayments();


    } catch (error) {

        console.error(
            "Error loading payments:",
            error
        );


        paymentTableBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="text-align: center;"
                >

                    Unable to load payment data.

                </td>

            </tr>

        `;

        noResults.style.display =
            "none";

    }

}


/* =========================================
   DISPLAY PAYMENTS
========================================= */

function displayPayments(paymentList) {

    paymentTableBody.innerHTML = "";


    if (paymentList.length === 0) {

        noResults.style.display =
            "block";

        return;

    }


    noResults.style.display =
        "none";


    paymentList.forEach(payment => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>

                <span class="payment-id">

                    ${payment.paymentId}

                </span>

            </td>


            <td>

                <span class="order-id">

                    ${payment.orderId}

                </span>

            </td>


            <td>

                ${payment.customer}

            </td>


            <td>

                <span class="payment-amount">

                    ${formatCurrency(payment.amount)}

                </span>

            </td>


            <td>

                ${payment.method}

            </td>


            <td>

                ${payment.date}

            </td>


            <td>

                <span
                    class="payment-status ${getStatusClass(payment.status)}"
                >

                    ${payment.status}

                </span>

            </td>


            <td>

                <button
                    class="view-payment-btn"
                    data-payment-id="${payment.paymentId}"
                >

                    <i class="fa-solid fa-eye"></i>

                    View

                </button>

            </td>

        `;


        paymentTableBody.appendChild(row);

    });

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    const total =
        payments.length;


    const completed =
        payments.filter(
            payment =>
                payment.status === "Paid"
        ).length;


    const pending =
        payments.filter(
            payment =>
                payment.status === "Pending"
        ).length;


    const revenue =
        payments
            .filter(
                payment =>
                    payment.status === "Paid"
            )
            .reduce(
                (sum, payment) =>
                    sum + payment.amount,
                0
            );


    totalPayments.textContent =
        total;


    completedPayments.textContent =
        completed;


    pendingPayments.textContent =
        pending;


    totalRevenue.textContent =
        formatCurrency(revenue);

}


/* =========================================
   FILTER PAYMENTS
========================================= */

function filterPayments() {

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const selectedMethod =
        methodFilter.value;


    const filtered =
        payments.filter(payment => {


            const matchesSearch =

                String(payment.paymentId)
                    .toLowerCase()
                    .includes(search)

                ||

                String(payment.orderId)
                    .toLowerCase()
                    .includes(search)

                ||

                payment.customer
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                selectedStatus === "all"
                ||
                payment.status === selectedStatus;


            const matchesMethod =
                selectedMethod === "all"
                ||
                payment.method === selectedMethod;


            return (
                matchesSearch
                &&
                matchesStatus
                &&
                matchesMethod
            );

        });


    displayPayments(filtered);

}


/* =========================================
   OPEN PAYMENT DETAILS
========================================= */

function openPaymentDetails(paymentId) {

    const payment =
        payments.find(
            item =>
                String(item.paymentId) ===
                String(paymentId)
        );


    if (!payment) {
        return;
    }


    paymentDetails.innerHTML = `

        <div class="detail-row">

            <span>
                Payment ID
            </span>

            <span>
                ${payment.paymentId}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Order ID
            </span>

            <span>
                ${payment.orderId}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Customer
            </span>

            <span>
                ${payment.customer}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Amount
            </span>

            <span>
                ${formatCurrency(payment.amount)}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Payment Method
            </span>

            <span>
                ${payment.method}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Payment Date
            </span>

            <span>
                ${payment.date}
            </span>

        </div>


        <div class="detail-row">

            <span>
                Status
            </span>

            <span>
                ${payment.status}
            </span>

        </div>

    `;


    modal.classList.add("active");

}


/* =========================================
   VIEW BUTTON EVENT
========================================= */

paymentTableBody.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".view-payment-btn"
            );


        if (!button) {
            return;
        }


        const paymentId =
            button.dataset.paymentId;


        openPaymentDetails(paymentId);

    }
);


/* =========================================
   FILTER EVENTS
========================================= */

searchInput.addEventListener(
    "input",
    filterPayments
);


statusFilter.addEventListener(
    "change",
    filterPayments
);


methodFilter.addEventListener(
    "change",
    filterPayments
);


/* =========================================
   CLOSE MODAL
========================================= */

modalClose.addEventListener(
    "click",
    function () {

        modal.classList.remove("active");

    }
);


/* =========================================
   CLOSE MODAL OUTSIDE
========================================= */

modal.addEventListener(
    "click",
    function (event) {

        if (event.target === modal) {

            modal.classList.remove("active");

        }

    }
);


/* =========================================
   ESC KEY
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
            &&
            modal.classList.contains("active")
        ) {

            modal.classList.remove("active");

        }

    }
);


/* =========================================
   INITIAL LOAD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadPayments();

    }
);