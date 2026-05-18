let cartbtn = document.getElementById("cartbtn")


// Wait for the HTML to load before running the reload logic
document.addEventListener("DOMContentLoaded", () => {
    browserreload();
});
function browserreload(){
    let reloadData = JSON.parse(localStorage.getItem("products"))||[]
    reloadData.forEach(element => {
        let allbtn= document.querySelectorAll(".product")  
        
        let productname= element.product_name   
        let productprice = element.product_price   
        let productqty= element.product_qty       

        allbtn.forEach((item)=>{
            let productid = item.dataset.uniqueid
             if(String(element.product_id) === productid){
                let targetbtn = item.querySelector("button")
                shop(targetbtn, productid, productname, productprice, productqty)
             }
        })
    });
}


function shop(btn, id, name, price, image){
    btn.outerHTML = `<div>
    <button>-</button>
    <span>1</span>
    <button>+</button>
    </div>`;
    let idx= id
    let namex= name
    let pricex= price
    let qtyx= 1    
    realtime(idx, namex, pricex, qtyx)
    
}
//cart functionality
function cartValue(){

}    
cartValue();



//ocal storage functionality
function realtime(id, name, price, qty){   
    let storedData= JSON.parse(localStorage.getItem("products"))||[]
    let userData= {
        product_id:id, 
        product_name:name, 
        product_price: price, 
        product_qty:qty
    }
    storedData.push(userData);
    let dataArry = JSON.stringify(storedData)
    localStorage.setItem("products", dataArry);
    console.log(storedData)
}
