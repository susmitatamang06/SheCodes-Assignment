// ========================================
// DATA AND ELEMENTS
// ========================================

let cart = quickBites.getCart();

const checkoutItems = document.querySelector("#checkout-items");
const subtotalElement = document.querySelector("#checkout-subtotal");
const deliveryElement = document.querySelector("#checkout-delivery");
const totalElement = document.querySelector("#checkout-total");
const cartValue = document.querySelector(".cart-value");

const nameInput = document.querySelector("#customer-name");
const phoneInput = document.querySelector("#customer-phone");
const addressInput = document.querySelector("#customer-address");
const cityInput = document.querySelector("#customer-city");

const checkoutForm = document.querySelector("#checkout-form");
const checkoutMessage = document.querySelector("#checkout-message");


// ========================================
// LOAD CUSTOMER INFORMATION
// ========================================

nameInput.value = quickBites.getCustomer(
    "customerName",
    "Susmita Tamang"
);

phoneInput.value = quickBites.getCustomer("customerPhone");
addressInput.value = quickBites.getCustomer("customerAddress");
cityInput.value = quickBites.getCustomer("customerCity");


// ========================================
// DISPLAY CHECKOUT ITEMS
// ========================================

function displayCheckoutItems() {
    checkoutItems.innerHTML = "";

    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        checkoutItems.innerHTML = `
            <div class="empty-checkout">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty.</p>
            </div>
        `;

        subtotalElement.textContent = "Rs.0.00";
        deliveryElement.textContent = "Rs.0.00";
        totalElement.textContent = "Rs.0.00";
        cartValue.textContent = "0";
        return;
    }

    cart.forEach(product => {
        const price = Number(
            String(product.price)
                .replace("Rs.", "")
                .replace(/,/g, "")
        );

        const itemTotal = price * product.quantity;

        subtotal += itemTotal;
        totalItems += product.quantity;

        const item = document.createElement("div");
        item.classList.add("checkout-item");

        item.innerHTML = `
            <div class="checkout-item-image">
                <img
                    src="${quickBites.getImagePath(product.image)}"
                    alt="${product.name}">
            </div>

            <div class="checkout-item-info">
                <h4>${product.name}</h4>
                <p>Quantity: ${product.quantity}</p>
            </div>

            <div class="checkout-item-price">
                Rs.${itemTotal.toFixed(2)}
            </div>
        `;

        checkoutItems.appendChild(item);
    });

    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    subtotalElement.textContent = `Rs.${subtotal.toFixed(2)}`;
    deliveryElement.textContent = `Rs.${deliveryFee.toFixed(2)}`;
    totalElement.textContent = `Rs.${total.toFixed(2)}`;
    cartValue.textContent = totalItems;
}


// ========================================
// FORM SUBMISSION
// ========================================

checkoutForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (cart.length === 0) {
        quickBites.showMessage(
            checkoutMessage,
            "Your cart is empty.",
            "red"
        );
        return;
    }

    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();
    const city = cityInput.value.trim();

    if (!name || !phone || !address || !city) {
        quickBites.showMessage(
            checkoutMessage,
            "Please complete all delivery details.",
            "red"
        );
        return;
    }

    const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
    );

    if (!selectedPayment) {
        quickBites.showMessage(
            checkoutMessage,
            "Please select a payment method.",
            "red"
        );
        return;
    }

    const paymentMethod = selectedPayment.value;

    quickBites.setCustomer({
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        customerCity: city
    });

    const orderNumber =
        "QB" + Date.now().toString().slice(-6);

    const newOrder = {
        id: orderNumber,
        date: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }),
        status: "Preparing",
        customerName: name,
        phone,
        address,
        city,
        paymentMethod,
        items: cart
    };

    const orders = quickBites.getOrders();
    orders.push(newOrder);

    quickBites.saveOrders(orders);

    quickBites.clearCart();
    cart = [];

    quickBites.showMessage(
        checkoutMessage,
        "Order placed successfully!",
        "green"
    );

    setTimeout(function () {
        window.location.href =
            `order_details.html?id=${orderNumber}`;
    }, 1000);
});



// ========================================
// INITIAL DISPLAY
// ========================================

displayCheckoutItems();
