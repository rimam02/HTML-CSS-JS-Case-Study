function changeQty(name, qty){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let item = cart.find(p => p.name === name);

    if(item){
        item.quantity = parseInt(qty);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
}


function filterShops(){
    let value = document.getElementById("categoryFilter").value;
    let shops = document.querySelectorAll(".shop-card");

    shops.forEach(shop=>{
        if(value === "all" || shop.dataset.category === value){
            shop.style.display = "block";
        } else {
            shop.style.display = "none";
        }
    });
}

let registeredUser = null;
let registeredPass = null;

function showRegister(){
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("registerBox").style.display = "block";
}

function showLogin(){
    document.getElementById("registerBox").style.display = "none";
    document.getElementById("loginBox").style.display = "block";
}

function registerUser(){
    let user = document.getElementById("registerUsername").value;
    let pass = document.getElementById("registerPassword").value;
    let error = document.getElementById("registerError");

    if(user === "" || pass === ""){
        error.innerText = "Please fill all fields.";
        return;
    }

    registeredUser = user;
    registeredPass = pass;

    alert("Registration Successful! Please login.");
    showLogin();
}

function loginUser(){
    let user = document.getElementById("loginUsername").value;
    let pass = document.getElementById("loginPassword").value;
    let error = document.getElementById("loginError");

    if(user === "" || pass === ""){
        error.innerText = "Please fill all fields.";
        return;
    }

    if(user === registeredUser && pass === registeredPass){
        window.location.href = "home.html";
    } else {
        error.innerText = "Invalid username or password.";
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const checkBtn = document.getElementById("checkBtn");
    const pincodeInput = document.getElementById("pincodeInput");
    const statusBox = document.getElementById("statusBox");

    if (checkBtn) {
        checkBtn.addEventListener("click", function () {

            let pincode = pincodeInput.value.trim();

            statusBox.style.display = "block";

            if (pincode.length === 6 && !isNaN(pincode)) {
                statusBox.className = "status-box status-success";
                statusBox.innerHTML = "✅ Delivery available in your area!";
            } else {
                statusBox.className = "status-box status-error";
                statusBox.innerHTML = "❌ Please enter valid 6-digit code";
            }

        });
    }

});

function goToShops() {
    window.location.href = "shops.html";
}

document.addEventListener("DOMContentLoaded", function() {

    const userPin = localStorage.getItem("userPincode");

    const shops = document.querySelectorAll(".shop-card");

    shops.forEach(shop => {
        const shopPin = shop.getAttribute("data-pin");
        const sameDayBadge = shop.querySelector(".same-day");

        if (sameDayBadge && shopPin !== userPin) {
    sameDayBadge.style.display = "none";
}
    });

});

document.addEventListener("DOMContentLoaded", function () {

    const shopCards = document.querySelectorAll(".shop-card");

    shopCards.forEach(card => {
        const distanceBadge = card.querySelector(".distance");

        if (!distanceBadge) return;

        card.addEventListener("mouseenter", () => {
            distanceBadge.style.display = "block";
        });

        card.addEventListener("mouseleave", () => {
            distanceBadge.style.display = "none";
        });

        card.addEventListener("mousemove", (e) => {
            distanceBadge.style.left = e.clientX + 15 + "px";
            distanceBadge.style.top = e.clientY + 15 + "px";
        });
    });

});


document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const ratingFilter = document.getElementById("ratingFilter");
    const deliveryFilter = document.getElementById("deliveryFilter");
    const shopCards = document.querySelectorAll(".shop-card");

    function filterShops() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const ratingValue = parseFloat(ratingFilter.value);
        const deliveryValue = deliveryFilter.value;

        shopCards.forEach(card => {

            const name = card.querySelector("h2").innerText.toLowerCase();

            const ratingText = card.querySelector(".rating").innerText;
            const ratingMatch = ratingText.match(/[\d.]+/);
            const rating = ratingMatch ? parseFloat(ratingMatch[0]) : 0;

            const deliveryElement = card.querySelector(".delivery");
            let deliveryType = "";

            if (deliveryElement.classList.contains("same")) {
                deliveryType = "same";
            } else if (deliveryElement.classList.contains("tomorrow")) {
                deliveryType = "tomorrow";
            } else if (deliveryElement.classList.contains("twodays")) {
                deliveryType = "twodays";
            }

            let show = true;

            if (searchValue !== "" && !name.includes(searchValue)) {
                show = false;
            }

            if (!isNaN(ratingValue) && rating < ratingValue) {
                show = false;
            }

            if (deliveryValue !== "" && deliveryType !== deliveryValue) {
                show = false;
            }

            card.style.display = show ? "flex" : "none";
        });
    }

    searchInput.addEventListener("input", filterShops);
    ratingFilter.addEventListener("change", filterShops);
    deliveryFilter.addEventListener("change", filterShops);

});



document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("productSearch");

    if (!searchInput) return;

    searchInput.addEventListener("input", function () {

        const filter = searchInput.value.toLowerCase();
        const cards = document.querySelectorAll(".product-card");

        cards.forEach(card => {
            const title = card.querySelector(".product-name")
                               .innerText
                               .toLowerCase();

            if (title.includes(filter)) {
                card.style.display = "flex";
            } else {
                card.style.display = "none";
            }
        });

    });

});


function updateCartCount(){
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQty = 0;

    cart.forEach(item => {
        totalQty += item.quantity;
    });

    let counter = document.getElementById("cart-count");
    if(counter){
        counter.innerText = totalQty;
    }
}

function loadCart(){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let tbody = document.querySelector("#cartTable tbody");
    if(!tbody) return;

    tbody.innerHTML = "";
    let total = 0;


cart.forEach(item=>{
    let row = `
    <tr>
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>
            <input type="number" value="${item.quantity}" min="1"
            onchange="changeQty('${item.name}', this.value)">
        </td>
        <td>${item.price * item.quantity}</td>
        <td>
            <button class="remove-btn"
                onclick="removeItem('${item.name}')">−</button>
        </td>
    </tr>
    `;

        tbody.innerHTML += row;
        total += item.price * item.quantity;
    });

    document.getElementById("grandTotal").innerText = total;
}


function removeItem(name){

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(item => item.name !== name);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
    updateCartCount();
}


document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const ratingFilter = document.getElementById("ratingFilter");
    const deliveryFilter = document.getElementById("deliveryFilter");
    const shopCards = document.querySelectorAll(".shop-card");

    if (!searchInput || !ratingFilter || !deliveryFilter) return;

    function filterShops() {

        const searchValue = searchInput.value.trim().toLowerCase();
        const ratingValue = parseFloat(ratingFilter.value);
        const deliveryValue = deliveryFilter.value;

        shopCards.forEach(card => {

            const name = card.querySelector("h2").innerText.toLowerCase();

            const ratingText = card.querySelector(".rating").innerText;
            const ratingMatch = ratingText.match(/[\d.]+/);
            const rating = ratingMatch ? parseFloat(ratingMatch[0]) : 0;

            const deliveryElement = card.querySelector(".delivery");
            let deliveryType = "";

            if (deliveryElement.classList.contains("same")) {
                deliveryType = "same";
            } else if (deliveryElement.classList.contains("tomorrow")) {
                deliveryType = "tomorrow";
            } else if (deliveryElement.classList.contains("twodays")) {
                deliveryType = "twodays";
            }

            let show = true;

            if (searchValue !== "" && !name.includes(searchValue)) {
                show = false;
            }

            if (!isNaN(ratingValue) && rating < ratingValue) {
                show = false;
            }

            if (deliveryValue !== "" && deliveryType !== deliveryValue) {
                show = false;
            }

            card.style.display = show ? "flex" : "none";
        });
    }

    searchInput.addEventListener("input", filterShops);
    ratingFilter.addEventListener("change", filterShops);
    deliveryFilter.addEventListener("change", filterShops);

});


function addToCart(button, name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.quantity += 1;
    } 
    else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(name + " added to cart");
}


document.addEventListener("DOMContentLoaded", function () {

    if (document.getElementById("cartTable")) {
        loadCart();
    }

    updateCartCount();

});

function goToCheckout(){
    window.location.href = "pricing.html";
}

document.addEventListener("DOMContentLoaded", function () {

    const sellerForm = document.getElementById("sellerForm");

    if (!sellerForm) return;

    sellerForm.addEventListener("submit", function (e) {
        e.preventDefault(); 

        const shopName = sellerForm.querySelector("input[placeholder='Shop Name']").value.trim();
        const ownerName = sellerForm.querySelector("input[placeholder='Owner Name']").value.trim();
        const phone = sellerForm.querySelector("input[placeholder='Phone Number']").value.trim();
        const email = sellerForm.querySelector("input[placeholder='Email Address']").value.trim();

        if (!shopName || !ownerName || !phone || !email) {
            alert("Please fill all required fields.");
            return;
        }

        alert("🎉 Registration Successful! Our team will contact you soon.");

        sellerForm.reset();
    });

});



document.addEventListener("DOMContentLoaded", function () {

    const sellerForm = document.querySelector("#sellerForm");

    if (!sellerForm) return;

    sellerForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const successMsg = document.getElementById("formSuccess");

        successMsg.style.display = "block";
        successMsg.innerText = "Registration successful! Redirecting...";

        sellerForm.reset();

        setTimeout(function(){
            window.location.href = "thankyou.html";
        }, 2000);

    });

});

document.addEventListener("DOMContentLoaded", function(){

const btn = document.getElementById("showFormBtn");
const form = document.getElementById("register");

if(btn){
btn.addEventListener("click", function(){

form.style.display="block";

form.scrollIntoView({
behavior:"smooth"
});

});
}

});


const form = document.getElementById("sellerForm");

if(form){
form.addEventListener("submit", async function(e){

e.preventDefault();

const formData = new FormData(form);

const data = Object.fromEntries(formData);

await fetch("/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
});

});
}


document.addEventListener("DOMContentLoaded", function(){

const showBtn = document.getElementById("showFormBtn");
const formSection = document.getElementById("register");

if(showBtn){
showBtn.addEventListener("click", function(){

formSection.style.display = "block";

formSection.scrollIntoView({
behavior: "smooth"
});

});
}

});


const seller = document.getElementById("sellerForm");

if(seller){
seller.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch("/register-seller", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        alert("Registration successful!");
    });
});
}



function goToCheckout(){
    window.location.href = "checkout.html";
}


document.addEventListener("DOMContentLoaded", function () {

const paymentRadios = document.querySelectorAll('input[name="payment"]');
const upiBox = document.getElementById("upiBox");
const cardBox = document.getElementById("cardBox");

if(!paymentRadios.length || !upiBox || !cardBox) return;

paymentRadios.forEach(function(radio){

radio.addEventListener("change", function(){

upiBox.style.display = "none";
cardBox.style.display = "none";

if(this.value === "upi"){
upiBox.style.display = "block";
}

if(this.value === "card"){
cardBox.style.display = "block";
}

});

});

});



document.addEventListener("DOMContentLoaded", function () {

const paymentRadios = document.querySelectorAll('input[name="payment"]');
const upiBox = document.getElementById("upiBox");
const cardBox = document.getElementById("cardBox");

if(!paymentRadios.length || !upiBox || !cardBox) return;

paymentRadios.forEach(function(radio){

radio.addEventListener("change", function(){

upiBox.style.display = "none";
cardBox.style.display = "none";

if(this.value === "upi"){
upiBox.style.display = "block";
}

if(this.value === "card"){
cardBox.style.display = "block";
}

});

});

}); 



document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("checkoutForm");

if(form){
form.addEventListener("submit", function(e){

e.preventDefault();

document.getElementById("orderPopup").style.display = "flex";

});
}

});

function closePopup(){
document.getElementById("orderPopup").style.display = "none";
}

function continueShopping(){
window.location.href = "products.html";
}