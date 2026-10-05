// var swiper = new Swiper('.mySwiper', {
//     loop: true,
//     navigation: {
//         nextEl: "#next",
//         prevEl: "#prev",
//     },
// });

// const cartIcon = document.querySelector('.cart-icon');
// const cartTab = document.querySelector('.cart-tab');
// const closeBtn = document.querySelector('.close-btn');
// const cardList = document.querySelector('.card-list');
// const cartList = document.querySelector('.cart-list');
// const cartTotal = document.querySelector('.cart-total');
// const cartValue = document.querySelector('.cart-value');
// const hamburger = document.querySelector('.hamburger');
// const mobileMenu = document.querySelector('.mobile-menu');
// const bars = document.querySelector('.fa-bars');
// const orderNowBtn = document.querySelector('#order-now-btn');

// const isLoggedIn = () => localStorage.getItem('isLoggedIn') === 'true';

// const requireLogin = () => {
//     localStorage.setItem('redirectAfterLogin', window.location.pathname.split('/').pop() || 'index.html');
//     window.location.href = 'login.html';
// };

// cartIcon.addEventListener('click', () => cartTab.classList.add('cart-tab-active'));
// closeBtn.addEventListener('click', () => cartTab.classList.remove('cart-tab-active'));
// hamburger.addEventListener('click', () => {
//     mobileMenu.classList.toggle('mobile-menu-active');
//     bars.classList.toggle('fa-bars');
//     bars.classList.toggle('fa-xmark');
// });

// orderNowBtn.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (!isLoggedIn()) {
//         requireLogin();
//         return;
//     }
//     document.querySelector('.card-list').scrollIntoView({ behavior: 'smooth' });
// });


// let productList = [];
// let cartProduct = [];

// const updateTotal = ()=>{
//     let totalPrice = 0;
//     let totalQuantity = 0;
//     document.querySelectorAll('.item').forEach(item =>{
//         const quantity = parseInt(item.querySelector('.quantity-value').textContent);
//         const price = parseFloat(item.querySelector('.item-total').textContent.replace('Rs.',''));
//         totalPrice += price;
//         totalQuantity += quantity;
//     });

//     cartTotal.textContent = `Rs.${totalPrice.toFixed(2)}`;
//     cartValue.textContent = totalQuantity;
// }

// const showCards = () => {

//     productList.forEach(product => {

//         const orderCard = document.createElement('div');
//         orderCard.classList.add('food-card');

//         orderCard.innerHTML = `
//         <div class="card-image">
//             <img src="${product.image}">
//         </div>
//         <h4>${product.name}</h4>
//         <h4 class="price">${product.price}</h4>
//         <a href="#" class="btn card-btn">Add to Cart</a>
//         `;

//         cardList.appendChild(orderCard);

//         const cardBtn = orderCard.querySelector('.card-btn');
//         cardBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             if (!isLoggedIn()) {
//                 requireLogin();
//                 return;
//             }
//             addToCart(product);
//         });
//     });
// };



// const addToCart = (product) => {

//     const existingProduct = cartProduct.find(item => item.id === product.id);
//     if (existingProduct) {
//         alert('Item already in your cart!');
//         return;
//     }

//     cartProduct.push(product);

//     let quantity = 1;
//     let price = parseFloat(product.price.replace('Rs.', ''));

//     const cartItem = document.createElement('div');
//     cartItem.classList.add('item');

//     cartItem.innerHTML = `
//     <div class="item-image">
//         <img src="${product.image}">
//     </div>

//     <div class="detail">
//         <h4>${product.name}</h4>
//         <h4 class="item-total">${product.price}</h4>
//     </div>

//     <div class="flex">
//         <a href="#" class="quantity-btn minus">
//             <i class="fa-solid fa-minus"></i>
//         </a>

//         <h4 class="quantity-value">${quantity}</h4>

//         <a href="#" class="quantity-btn plus">
//             <i class="fa-solid fa-plus"></i>
//         </a>
//     </div>
//     `;

//     cartList.appendChild(cartItem);
//     updateTotal();

//     const plusBtn = cartItem.querySelector('.plus');
//     const quantityValue = cartItem.querySelector('.quantity-value');
//     const itemTotal = cartItem.querySelector('.item-total');
//     const minusBtn = cartItem.querySelector('.minus');

//     plusBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         quantity++;
//         quantityValue.textContent = quantity;
//         itemTotal.textContent = `Rs.${(price * quantity).toFixed(2)}`;
//         updateTotal();
//     });

//     minusBtn.addEventListener('click', (e) => {
//         e.preventDefault();
//         if (quantity > 1) {
//             quantity--;
//             quantityValue.textContent = quantity;
//             itemTotal.textContent = `Rs.${(price * quantity).toFixed(2)}`;
//             updateTotal();
//         } 
//         else {
//             cartItem.classList.add('slide-out')
//             setTimeout(() => {
//                 cartItem.remove();
//                 cartProduct = cartProduct.filter(item => item.id !== product.id);
//                 updateTotal(); 
//             }, 300)
            
//         }
//     });
// }




// const initApp = () => {

//     fetch('products.json')
//         .then(response => response.json())
//         .then(data => {
//             productList = data;
//             showCards();
//         })
// }

// initApp();
const API_BASE_URL = "http://127.0.0.1:8080";

// ========================================
// SWIPER
// ========================================

const swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#next",
        prevEl: "#prev"
    }
});


// ========================================
// ELEMENTS
// ========================================

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");
const orderNowBtn = document.querySelector("#order-now-btn");


// ========================================
// CART DATA
// ========================================

let productList = [];
let cartProduct = [];


// ========================================
// CHECK CURRENT LOGIN SESSION
// ========================================

async function getCurrentUser() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/auth/me`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) {
            return null;
        }

        return await response.json();

    } catch (error) {

        console.error("Could not check login session:", error);

        return null;
    }
}


// ========================================
// REQUIRE LOGIN
// ========================================

async function requireLogin() {

    const currentUser = await getCurrentUser();

    if (currentUser) {
        return true;
    }

    localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname.split("/").pop() || "index.html"
    );

    window.location.href = "login.html";

    return false;
}


// ========================================
// CART OPEN / CLOSE
// ========================================

cartIcon.addEventListener("click", () => {
    cartTab.classList.add("cart-tab-active");
});


closeBtn.addEventListener("click", () => {
    cartTab.classList.remove("cart-tab-active");
});


// ========================================
// MOBILE MENU
// ========================================

hamburger.addEventListener("click", () => {

    mobileMenu.classList.toggle("mobile-menu-active");

    bars.classList.toggle("fa-bars");
    bars.classList.toggle("fa-xmark");

});


// ========================================
// ORDER NOW BUTTON
// ========================================

orderNowBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    const loggedIn = await requireLogin();

    if (!loggedIn) {
        return;
    }

    cardList.scrollIntoView({
        behavior: "smooth"
    });

});


// ========================================
// UPDATE CART TOTAL
// ========================================

function updateTotal() {

    let totalPrice = 0;
    let totalQuantity = 0;

    document.querySelectorAll(".item").forEach(item => {

        const quantityElement =
            item.querySelector(".quantity-value");

        const totalElement =
            item.querySelector(".item-total");

        if (!quantityElement || !totalElement) {
            return;
        }

        const quantity =
            parseInt(quantityElement.textContent, 10);

        const price =
            parseFloat(
                totalElement.textContent
                    .replace("Rs.", "")
            );

        if (!Number.isNaN(quantity)) {
            totalQuantity += quantity;
        }

        if (!Number.isNaN(price)) {
            totalPrice += price;
        }

    });

    cartTotal.textContent =
        `Rs.${totalPrice.toFixed(2)}`;

    cartValue.textContent =
        totalQuantity;

}


// ========================================
// DISPLAY FOOD CARDS
// ========================================

function showCards() {

    cardList.innerHTML = "";

    if (productList.length === 0) {

        cardList.innerHTML = `
            <p class="para">
                No food items are available at the moment.
            </p>
        `;

        return;
    }

    productList.forEach(product => {

        const orderCard =
            document.createElement("div");

        orderCard.classList.add("food-card");

        orderCard.innerHTML = `
            <div class="card-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                >
            </div>

            <h4>${product.name}</h4>

            <h4 class="price">
                ${product.price}
            </h4>

            <a href="#" class="btn card-btn">
                Add to Cart
            </a>
        `;

        cardList.appendChild(orderCard);

        const cardBtn =
            orderCard.querySelector(".card-btn");

        cardBtn.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                const loggedIn =
                    await requireLogin();

                if (!loggedIn) {
                    return;
                }

                addToCart(product);
            }
        );

    });

}


// ========================================
// ADD PRODUCT TO LOCAL CART
// ========================================

function addToCart(product) {

    const existingProduct =
        cartProduct.find(
            item => item.id === product.id
        );

    if (existingProduct) {

        alert("Item already in your cart!");

        return;
    }

    cartProduct.push(product);

    let quantity = 1;

    const price =
        parseFloat(
            product.price.replace("Rs.", "")
        );

    const cartItem =
        document.createElement("div");

    cartItem.classList.add("item");

    cartItem.innerHTML = `
        <div class="item-image">
            <img
                src="${product.image}"
                alt="${product.name}"
            >
        </div>

        <div class="detail">
            <h4>${product.name}</h4>

            <h4 class="item-total">
                ${product.price}
            </h4>
        </div>

        <div class="flex">

            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>

            <h4 class="quantity-value">
                ${quantity}
            </h4>

            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>

        </div>
    `;

    cartList.appendChild(cartItem);

    updateTotal();


    // ========================================
    // PLUS BUTTON
    // ========================================

    const plusBtn =
        cartItem.querySelector(".plus");

    const quantityValue =
        cartItem.querySelector(".quantity-value");

    const itemTotal =
        cartItem.querySelector(".item-total");

    const minusBtn =
        cartItem.querySelector(".minus");


    plusBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            quantity++;

            quantityValue.textContent =
                quantity;

            itemTotal.textContent =
                `Rs.${(price * quantity).toFixed(2)}`;

            updateTotal();

        }
    );


    // ========================================
    // MINUS BUTTON
    // ========================================

    minusBtn.addEventListener(
        "click",
        event => {

            event.preventDefault();

            if (quantity > 1) {

                quantity--;

                quantityValue.textContent =
                    quantity;

                itemTotal.textContent =
                    `Rs.${(price * quantity).toFixed(2)}`;

                updateTotal();

            } else {

                cartItem.classList.add("slide-out");

                setTimeout(() => {

                    cartItem.remove();

                    cartProduct =
                        cartProduct.filter(
                            item =>
                                item.id !== product.id
                        );

                    updateTotal();

                }, 300);

            }

        }
    );

}


// ========================================
// LOAD PRODUCTS FROM DATABASE
// ========================================

async function loadProducts() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/food-items`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

        if (!response.ok) {

            throw new Error(
                `Could not load food items. Status: ${response.status}`
            );
        }

        const data =
            await response.json();


        // ========================================
        // ONLY SHOW AVAILABLE PRODUCTS
        // ========================================

        productList =
            data
                .filter(
                    product =>
                        product.isAvailable === true
                )
                .map(product => {

                    return {

                        id: product.foodId,

                        name: product.foodName,

                        description:
                            product.description || "",

                        price:
                            `Rs.${Number(product.price).toFixed(2)}`,

                        image:
                            product.imageUrl ||
                            "images/food.png",

                        categoryId:
                            product.categoryId,

                        popular:
                            product.isPopular === true

                    };

                });


        console.log(
            "Food items loaded from database:",
            productList
        );


        showCards();

        updateTotal();

    } catch (error) {

        console.error(
            "Error loading food items:",
            error
        );

        cardList.innerHTML = `
            <p class="para">
                Unable to load food items.
                Please make sure the backend is running.
            </p>
        `;

    }

}


// ========================================
// START APPLICATION
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProducts();

    }
);