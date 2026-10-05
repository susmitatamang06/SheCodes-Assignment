/* =========================================================
   QUICK BITES - RIDER DELIVERIES
   Backend connected
========================================================= */

const API_BASE_URL = "http://127.0.0.1:8080";

let deliveries = [];


/* =========================================================
   GET ELEMENTS
========================================================= */

const tableBody =
    document.querySelector("#delivery-table-body") ||
    document.querySelector("#deliveries-table-body") ||
    document.querySelector("#deliveries-tbody");

const statusFilter =
    document.querySelector("#status-filter");


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDeliveries();

    }
);


/* =========================================================
   LOAD CURRENT RIDER
========================================================= */

async function loadCurrentRider() {

    const response =
        await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );


    if (!response.ok) {

        throw new Error(
            `Could not identify current rider. Status: ${response.status}`
        );

    }


    return await response.json();

}


/* =========================================================
   LOAD DELIVERIES
========================================================= */

async function loadDeliveries() {

    try {

        if (!tableBody) {

            console.error(
                "Delivery table body was not found."
            );

            return;

        }


        /* -------------------------------------------------
           Get logged-in rider
        ------------------------------------------------- */

        const currentRider =
            await loadCurrentRider();


        console.log(
            "Current rider:",
            currentRider
        );


        /* -------------------------------------------------
           Get all deliveries
        ------------------------------------------------- */

        const response =
            await fetch(
                `${API_BASE_URL}/api/deliveries`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load deliveries. Status: ${response.status}`
            );

        }


        const allDeliveries =
            await response.json();


        console.log(
            "All deliveries:",
            allDeliveries
        );


        /* -------------------------------------------------
           Only show deliveries assigned to current rider
        ------------------------------------------------- */

        const riderDeliveries =
            allDeliveries.filter(
                delivery =>
                    Number(
                        delivery.rider_id
                    ) ===
                    Number(
                        currentRider.id
                    )
            );


        /* -------------------------------------------------
           Convert each delivery
        ------------------------------------------------- */

        deliveries =
            await Promise.all(
                riderDeliveries.map(
                    delivery =>
                        prepareDelivery(
                            delivery
                        )
                )
            );


        console.log(
            "Rider deliveries:",
            deliveries
        );


        /* -------------------------------------------------
           Display
        ------------------------------------------------- */

        displayDeliveries(
            getFilteredDeliveries()
        );

        updateSummary();


    } catch (error) {

        console.error(
            "Could not load rider deliveries:",
            error
        );


        if (tableBody) {

            tableBody.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        style="text-align:center; padding:30px;"
                    >

                        Could not load deliveries.

                    </td>

                </tr>

            `;

        }

    }

}


/* =========================================================
   PREPARE DELIVERY
========================================================= */

async function prepareDelivery(
    delivery
) {

    let order = null;
    let address = null;


    /* -------------------------------------------------
       Get order
    ------------------------------------------------- */

    try {

        const orderResponse =
            await fetch(
                `${API_BASE_URL}/api/orders/${delivery.order_id}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (orderResponse.ok) {

            order =
                await orderResponse.json();

        }

    } catch (error) {

        console.error(
            "Could not load order:",
            error
        );

    }


    /* -------------------------------------------------
       Get address
    ------------------------------------------------- */

    if (
        order &&
        order.address_id
    ) {

        try {

            const addressResponse =
                await fetch(
                    `${API_BASE_URL}/api/addresses/${order.address_id}`,
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );


            if (addressResponse.ok) {

                address =
                    await addressResponse.json();

            }

        } catch (error) {

            console.error(
                "Could not load address:",
                error
            );

        }

    }


    return {

        deliveryId:
            delivery.delivery_id,

        orderId:
            delivery.order_id,

        customer:
            order
                ? `Customer #${order.user_id}`
                : "Unknown Customer",

        address:
            formatAddress(address),

        date:
            formatDate(
                delivery.assigned_at
            ),

        total:
            order
                ? Number(
                    order.total_amount || 0
                )
                : 0,

        status:
            String(
                delivery.delivery_status ||
                "ASSIGNED"
            ).toUpperCase()

    };

}


/* =========================================================
   FORMAT ADDRESS
========================================================= */

function formatAddress(
    address
) {

    if (!address) {

        return "Address unavailable";

    }


    const parts = [];


    if (address.addressLine) {

        parts.push(
            address.addressLine
        );

    }


    if (address.address_line) {

        parts.push(
            address.address_line
        );

    }


    if (address.city) {

        parts.push(
            address.city
        );

    }


    return parts.length > 0
        ? parts.join(", ")
        : "Address unavailable";

}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(
    dateValue
) {

    if (!dateValue) {

        return "N/A";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "N/A";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   FORMAT STATUS
========================================================= */

function formatStatus(
    status
) {

    switch (
        String(
            status || ""
        ).toUpperCase()
    ) {

        case "ASSIGNED":

            return "Pending";


        case "PICKED_UP":

            return "Picked Up";


        case "OUT_FOR_DELIVERY":

            return "Out for Delivery";


        case "DELIVERED":

            return "Delivered";


        default:

            return "Unknown";

    }

}


/* =========================================================
   STATUS CSS CLASS
========================================================= */

function getStatusClass(
    status
) {

    switch (
        String(
            status || ""
        ).toUpperCase()
    ) {

        case "ASSIGNED":

            return "status-pending";


        case "PICKED_UP":

            return "status-picked-up";


        case "OUT_FOR_DELIVERY":

            return "status-out-for-delivery";


        case "DELIVERED":

            return "status-delivered";


        default:

            return "status-pending";

    }

}


/* =========================================================
   FILTER
========================================================= */

function getFilteredDeliveries() {

    if (!statusFilter) {

        return deliveries;

    }


    const selectedStatus =
        statusFilter.value;


    if (
        !selectedStatus ||
        selectedStatus === "all"
    ) {

        return deliveries;

    }


    return deliveries.filter(
        delivery =>
            delivery.status ===
            selectedStatus
    );

}


/* =========================================================
   DISPLAY DELIVERIES
========================================================= */

function displayDeliveries(
    list
) {

    if (!tableBody) {

        return;

    }


    tableBody.innerHTML = "";


    /* -------------------------------------------------
       Empty
    ------------------------------------------------- */

    if (list.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center; padding:30px;"
                >

                    No deliveries found.

                </td>

            </tr>

        `;

        return;

    }


    /* -------------------------------------------------
       Rows
    ------------------------------------------------- */

    list.forEach(
        delivery => {

            const row =
                document.createElement(
                    "tr"
                );


            const action =
                getNextAction(
                    delivery.status
                );


            row.innerHTML = `

                <!-- DELIVERY ID -->

                <td>

                    #${escapeHTML(
                        delivery.deliveryId
                    )}

                </td>


                <!-- CUSTOMER -->

                <td>

                    ${escapeHTML(
                        delivery.customer
                    )}

                </td>


                <!-- ADDRESS -->

                <td>

                    ${escapeHTML(
                        delivery.address
                    )}

                </td>


                <!-- DATE / TOTAL -->

                <td>

                    <div>

                        ${escapeHTML(
                            delivery.date
                        )}

                    </div>

                    <small>

                        Rs.${delivery.total.toFixed(2)}

                    </small>

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="delivery-status ${getStatusClass(
                            delivery.status
                        )}"
                    >

                        ${escapeHTML(
                            formatStatus(
                                delivery.status
                            )
                        )}

                    </span>

                </td>


                <!-- ACTION -->

                <td>

                    <button
                        type="button"
                        class="delivery-action-btn"
                        data-delivery-id="${escapeHTML(
                            delivery.deliveryId
                        )}"
                        ${
                            action.disabled
                                ? "disabled"
                                : ""
                        }
                    >

                        ${
                            action.icon
                                ? `<i class="${action.icon}"></i>`
                                : ""
                        }

                        ${escapeHTML(
                            action.label
                        )}

                    </button>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    attachActionListeners();

}


/* =========================================================
   NEXT ACTION
========================================================= */

function getNextAction(
    status
) {

    switch (
        String(
            status || ""
        ).toUpperCase()
    ) {

        case "ASSIGNED":

            return {

                label: "Pick Up",

                icon:
                    "fa-solid fa-box",

                nextStatus:
                    "PICKED_UP",

                disabled:
                    false

            };


        case "PICKED_UP":

            return {

                label: "Start Delivery",

                icon:
                    "fa-solid fa-motorcycle",

                nextStatus:
                    "OUT_FOR_DELIVERY",

                disabled:
                    false

            };


        case "OUT_FOR_DELIVERY":

            return {

                label: "Mark Delivered",

                icon:
                    "fa-solid fa-check",

                nextStatus:
                    "DELIVERED",

                disabled:
                    false

            };


        case "DELIVERED":

            return {

                label: "Completed",

                icon:
                    "fa-solid fa-check-double",

                nextStatus:
                    null,

                disabled:
                    true

            };


        default:

            return {

                label: "Pick Up",

                icon:
                    "fa-solid fa-box",

                nextStatus:
                    "PICKED_UP",

                disabled:
                    false

            };

    }

}


/* =========================================================
   ATTACH ACTION LISTENERS
========================================================= */

function attachActionListeners() {

    const buttons =
        document.querySelectorAll(
            ".delivery-action-btn"
        );


    buttons.forEach(
        button => {

            button.addEventListener(
                "click",
                function () {

                    const deliveryId =
                        this.dataset.deliveryId;


                    updateDeliveryStatus(
                        deliveryId,
                        this
                    );

                }
            );

        }
    );

}


/* =========================================================
   UPDATE DELIVERY STATUS
========================================================= */

async function updateDeliveryStatus(
    deliveryId,
    button
) {

    const delivery =
        deliveries.find(
            item =>
                String(
                    item.deliveryId
                ) ===
                String(
                    deliveryId
                )
        );


    if (!delivery) {

        alert(
            "Delivery could not be found."
        );

        return;

    }


    const action =
        getNextAction(
            delivery.status
        );


    if (
        !action.nextStatus
    ) {

        return;

    }


    const originalText =
        button.innerHTML;


    button.disabled =
        true;


    button.innerHTML = `

        <i class="fa-solid fa-spinner fa-spin"></i>

        Updating...

    `;


    try {

        /* -------------------------------------------------
           Get latest delivery from backend
        ------------------------------------------------- */

        const response =
            await fetch(
                `${API_BASE_URL}/api/deliveries/${deliveryId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );


        if (!response.ok) {

            throw new Error(
                `Could not load delivery. Status: ${response.status}`
            );

        }


        const backendDelivery =
            await response.json();


        /* -------------------------------------------------
           Update status
        ------------------------------------------------- */

        backendDelivery.delivery_status =
            action.nextStatus;


        /* -------------------------------------------------
           Delivered timestamp
        ------------------------------------------------- */

        if (
            action.nextStatus ===
            "DELIVERED"
        ) {

            backendDelivery.delivered_at =
                new Date().toISOString();

        }


        /* -------------------------------------------------
           Save
        ------------------------------------------------- */

        const updateResponse =
            await fetch(
                `${API_BASE_URL}/api/deliveries/${deliveryId}`,
                {
                    method: "PUT",

                    credentials:
                        "include",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            backendDelivery
                        )

                }
            );


        if (!updateResponse.ok) {

            const errorText =
                await updateResponse.text();


            throw new Error(
                `Could not update delivery. Status: ${updateResponse.status} ${errorText}`
            );

        }


        await updateResponse.json();


        /* -------------------------------------------------
           Reload fresh data
        ------------------------------------------------- */

        await loadDeliveries();


    } catch (error) {

        console.error(
            "Delivery status update error:",
            error
        );


        alert(
            `Could not update delivery status.\n\n${error.message}`
        );


        button.disabled =
            false;


        button.innerHTML =
            originalText;

    }

}


/* =========================================================
   FILTER EVENT
========================================================= */

if (statusFilter) {

    statusFilter.addEventListener(
        "change",
        function () {

            displayDeliveries(
                getFilteredDeliveries()
            );

        }
    );

}

/* =========================================================
   UPDATE DELIVERY SUMMARY
========================================================= */

function updateSummary() {

    const total =
        deliveries.length;


    const pending =
        deliveries.filter(
            delivery =>
                delivery.status ===
                "ASSIGNED"
        ).length;


    const inDelivery =
        deliveries.filter(
            delivery =>
                delivery.status ===
                    "PICKED_UP" ||

                delivery.status ===
                    "OUT_FOR_DELIVERY"
        ).length;


    const delivered =
        deliveries.filter(
            delivery =>
                delivery.status ===
                "DELIVERED"
        ).length;


    /* -----------------------------------------------------
       Update Total Deliveries
    ----------------------------------------------------- */

    const totalElement =
        document.getElementById(
            "total-deliveries"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    /* -----------------------------------------------------
       Update Pending
    ----------------------------------------------------- */

    const pendingElement =
        document.getElementById(
            "pending-deliveries"
        );


    if (pendingElement) {

        pendingElement.textContent =
            pending;

    }


    /* -----------------------------------------------------
       Update In Delivery
    ----------------------------------------------------- */

    const activeElement =
        document.getElementById(
            "active-deliveries"
        );


    if (activeElement) {

        activeElement.textContent =
            inDelivery;

    }


    /* -----------------------------------------------------
       Update Delivered
    ----------------------------------------------------- */

    const completedElement =
        document.getElementById(
            "completed-deliveries"
        );


    if (completedElement) {

        completedElement.textContent =
            delivered;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}