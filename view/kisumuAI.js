let cartbtn = document.getElementById("cartbtn");

document.addEventListener("DOMContentLoaded", () => {
    browserreload();
});

function browserreload() {
    let reloadData = JSON.parse(localStorage.getItem("products")) || [];
    let allbtn = document.querySelectorAll(".product");

    reloadData.forEach(element => {
        allbtn.forEach((item) => {
            let productid = item.dataset.uniqueid;
            // Match the stored ID with the HTML ID
            if (String(element.product_id) === productid) {
                let targetbtn = item.querySelector("button");
                // Pass 'true' as the last argument to indicate this is a reload
                shop(targetbtn, element.product_id, element.product_name, element.product_price, element.product_qty, true);
            }
        });
    });
}

function shop(btn, id, name, price, qtyOrImage, isReloading = false) {
    // Replace the button with quantity controls
    // If it's a reload, use the saved qty. If it's a new click, start at 1.
    let displayQty = isReloading ? qtyOrImage : 1;

    btn.outerHTML = `
    <div class="qty-container">
        <button onclick="changeQty(this, '${id}', -1)">-</button>
        <span>${displayQty}</span>
        <button onclick="changeQty(this, '${id}', 1)">+</button>
    </div>`;

    // ONLY save to localStorage if this is a fresh click (not a reload)
    if (!isReloading) {
        realtime(id, name, price, 1);
    }
}

function realtime(id, name, price, qty) {
    let storedData = JSON.parse(localStorage.getItem("products")) || [];
    
    // Check if product already exists to avoid duplicates
    let existingItem = storedData.find(item => item.product_id === id);
    
    if (existingItem) {
        existingItem.product_qty = qty;
    } else {
        storedData.push({
            product_id: id,
            product_name: name,
            product_price: price,
            product_qty: qty
        });
    }
    
    localStorage.setItem("products", JSON.stringify(storedData));
}