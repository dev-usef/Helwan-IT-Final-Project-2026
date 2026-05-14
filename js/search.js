const searchInput = document.getElementById("search-bar");
if (searchInput) {
    searchInput.addEventListener("input", (event) => {
        let q = searchInput.value.toLowerCase();
        window.filteredData = window.PRODUCTS.filter(
        (p)=>
            p.id.toLowerCase().includes(q)
    );
    window.currentPage = 1;
    window.render();
    });
}

function changeCategory(categoryName){
  document.querySelectorAll("#category-list ul li").forEach(li => {
    li.classList.remove("active");
  });
  if(categoryName === "all"){
    window.filteredData = [...window.PRODUCTS];
  }
  else{
    window.filteredData = window.PRODUCTS.filter(
        (p) =>
            p.cat.toLowerCase().includes(categoryName)
        );
  }
  event.target.classList.add("active");
  window.currentPage = 1;
  window.render()
};
