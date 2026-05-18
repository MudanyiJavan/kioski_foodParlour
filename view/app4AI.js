const cart_value = document.getElementById("cart_value");

// 1. INITIAL SYNC: Update the top counter immediately
function updateGlobalCounter() {
    const savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    const totalQty = savedCart.reduce((acc, item) => acc + item.quantity, 0);
    if (cart_value) cart_value.textContent = totalQty;
}
updateGlobalCounter();

// 2. CORE LOGIC: This handles the actual button transformation
function cart(btn, name, price, img) {
    // Determine current quantity (1 if new, or use existing from storage)
    const savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    const item = savedCart.find(i => i.name === name);
    const initialQty = item ? item.quantity : 1;

    // Transform Button UI
    btn.innerHTML = `
        <button class="decrease">-</button>
        <span class="counter">${initialQty}</span>
        <button class="add">+</button>
    `;
    btn.onclick = null;

    // Save initial state if it's a new addition
    if (!item) {
        webStorage(name, price, 1, img);
        updateGlobalCounter();
    }

    const nevbtn = btn.querySelector(".decrease");
    const posbtn = btn.querySelector(".add");
    const dec = btn.querySelector(".counter");

    // Minus Button Logic
    nevbtn.onclick = (e) => {
        e.stopPropagation();
        const newVal = parseInt(dec.innerText) - 1;
        dec.textContent = newVal;
        webStorage(name, price, newVal, img);
        updateGlobalCounter();

        if (newVal < 1) {
            btn.innerHTML = "cart";
            btn.onclick = () => cart(btn, name, price, img);
        }
    };

    // Plus Button Logic
    posbtn.onclick = (e) => {
        e.stopPropagation();
        const newVal = parseInt(dec.innerText) + 1;
        dec.textContent = newVal;
        webStorage(name, price, newVal, img);
        updateGlobalCounter();
    };
}

// 3. STORAGE LOGIC
function webStorage(name, price, quantity, img) {
    let myKioskiCart = JSON.parse(localStorage.getItem("kioski")) || [];
    const itemIndex = myKioskiCart.findIndex(item => item.name === name);

    if (quantity > 0) {
        if (itemIndex > -1) {
            myKioskiCart[itemIndex].quantity = quantity;
        } else {
            myKioskiCart.push({ name, price, quantity, img });
        }
    } else if (itemIndex > -1) {
        myKioskiCart.splice(itemIndex, 1);
    }
    localStorage.setItem("kioski", JSON.stringify(myKioskiCart));
}

// 4. HYDRATION: Fix the "Default to Zero" on reload
window.onload = function() {
    const savedCart = JSON.parse(localStorage.getItem("kioski")) || [];
    
    savedCart.forEach(item => {
        // Search for the button using the data-name attribute we added in HTML
        const btn = document.querySelector(`button[data-name="${item.name}"]`);
        if (btn) {
            // Re-trigger the cart function to restore the +/- UI
            cart(btn, item.name, item.price, item.img);
        }
    });
};