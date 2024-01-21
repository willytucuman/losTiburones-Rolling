import Navbar from "./components/Navbar.js";
import ProductCard from "./components/ProductCard.js";
import ProductNotFoundMessage from "./components/ProductNotFoundMessage.js";
import { setProducts } from "./services/setProducts.js";
import { getProducts } from "./services/getProducts.js";
import { createAdminUser } from "./services/setAdminUser.js";
import { renderCartBody } from "./cart.init.js";
import { cartBadgeHandler } from "./utils/cartBadgeHandler.js";

const searchInput = document.getElementById("searchInput");
const priceSelect = document.getElementById("priceSelect");
const categorySelect = document.getElementById("categorySelect");
const clearFilters = document.getElementById("clearFilters");

let products;


document.addEventListener("DOMContentLoaded", () => {
  Navbar();
  createAdminUser()
  setProducts()
  products = getProducts()
  // renderCartBody()
  // cartBadgeHandler()
  renderProductCards(products);
});


const cardContainer = document.getElementById("cardContainer");

/**
 * 
 * @param {array} products Arreglo de producto 
  * @returns {} Renderiza las cards de los productos.
 */


const renderProductCards = (products) => {
  cardContainer.innerHTML = "";
  products.map((product) => {
    (product.visible? cardContainer.innerHTML += ProductCard(product) : null)
    // const visible = product.visible === true;
    
    // if (visible){
    //   cardContainer.innerHTML += ProductCard(product);
    // }

  })
};





/**
 * 
 * @param {string} value Valor del filtro de categoria 
 * @param {array} productsArray Arreglo de productos a renderizar
 * @returns {array} Devuelve el arreglo de productos filtrados
 */


const filterByCategory = (value, productsArray) => {
  console.log(value)
  console.log(productsArray)
  const matchingProducts = productsArray.filter((product) => product.category == value);
  console.log(matchingProducts)
  if (value) {
    return matchingProducts;
  }
  return productsArray;
    // switch (true) {
    //   case value === "mug":
    //       categorySelect = productsArray
    //     break;
    
    //   default:
    //     break;
    // }
};

/**
 * 
* @param {string} value Valor del filtro de precio. 
 * @param {array} productsArray Arreglo de productos a renderizar
 * @returns {array} Devuelve el arreglo de productos filtrados
 */



const filterByPrice = (value, productsArray) => {
  let productsOrdered = [];
  console.log(value)
  console.log(productsArray)
  // let matchingProducts;
  // if (value == "asc") {
  //   matchingProducts = productsArray.sort((a, b) => a.price - b.price);
  // }
  // if (value == "desc") {
  //   matchingProducts = productsArray.sort((a, b) => b.price - a.price);
  // }
  // if (value == "disc") {
  //   matchingProducts = productsArray.filter((product) => product.discountPercentage);
  //   matchingProducts = matchingProducts.sort((a, b) => b.discountPercentage - a.discountPercentage);
  // }
  // if (value) {
  //   return matchingProducts;
  // }
  // return productsArray;
  if (value == "") {
    productsOrdered = productsArray
    console.log(productsOrdered)
  } else {
    switch (value){
    case 'asc' :
          let matchingProductsAsc = productsArray.sort((a, b) => {
            return (a.price-(a.price*(a.discountPercentage*0.01))) - (b.price-(b.price*(b.discountPercentage*0.01)));
          });
          console.log(matchingProductsAsc)
          return productsOrdered = matchingProductsAsc;  
    case 'desc':
          let matchingProductsDesc = productsArray.sort((a, b) => {
            return (b.price-(b.price*(b.discountPercentage*0.01))) - (a.price-(a.price*(a.discountPercentage*0.01)));
          });
          console.log(matchingProductsDesc)
          return productsOrdered = matchingProductsDesc;  
    case 'disc':
      let productsArrayDisc = (productsArray.filter(products => products.discountPercentage != false)).sort((a, b) => a.discountPercentage - b.discountPercentage);
      console.log(productsArrayDisc)
      return productsOrdered = productsArrayDisc;  
    default :
    productsOrdered = ProductNotFoundMessage();
    console.log("no hay nada que filtrar");
  }
}
console.log(productsOrdered)
return productsOrdered;
};

/**
 * 
 * @param {string} value valor del input de nombre 
 * @returns Arreglo de productos a renderizar
 */

const searchByName = (inputWord) => {
  products = getProducts()
  let searchedProducts = [];
  const nombreProducto = (inputWord).toString().toLowerCase().trim();
   if (inputWord == "") {
    searchedProducts = products;
   } else {
     products.forEach( p =>{
      const nombreMinuscula = p.name.toLowerCase()
      if(nombreMinuscula.includes(nombreProducto) && nombreProducto.length > 0){
        searchedProducts.push(p)
      }
    })
   }
  console.log(searchedProducts)
  return searchedProducts
  
  //https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/includes
};
// searchInput.addEventListener('keyup', searchByName)

/**
 * 
 * @param {string} searchInputValue Valor del input de nombre
 * @param {string} priceSelectValue Valor del select de precios 
 * @param {string} categorySelectValue Valor del select de categoria
 * @returns Crea un arreglo de productos pasando por todos los filtros y llama a renderProductCards() para renderizarlas, en caso de no haber productos muestra ProductNotFoundMessage()
 */

const renderFilteredProducts = (searchInputValue,priceSelectValue,categorySelectValue) => {
  let filteredProducts = searchByName(searchInputValue)
  console.log(filteredProducts)
  filteredProducts = filterByPrice(priceSelectValue, filteredProducts)
  console.log(filteredProducts)
  filteredProducts = filterByCategory(categorySelectValue, filteredProducts)
  console.log(filteredProducts)
  renderProductCards(filteredProducts);

  ProductNotFoundMessage()
};

searchInput.addEventListener("keyup", (e) => {
  renderFilteredProducts(
    e.target.value.toLowerCase(),
    priceSelect.value,
    categorySelect.value
  );
});

priceSelect.addEventListener("change", (e) => {
  renderFilteredProducts(
    searchInput.value,
    e.target.value,
    categorySelect.value
  );
});

categorySelect.addEventListener("change", (e) => {
  renderFilteredProducts(
    searchInput.value,
    priceSelect.value,
    e.target.value.toLowerCase()
  );
});

clearFilters.addEventListener("click", (e) => {
  e.preventDefault()
  searchInput.value = "";
  priceSelect.value = "";
  categorySelect.value = "";
  renderProductCards(products);
});
