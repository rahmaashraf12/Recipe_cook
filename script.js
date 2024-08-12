const searchBox=document.querySelector('.searchBox')
const searchBtn=document.querySelector('.searchBtn')
const recipeContainer=document.querySelector('.recipe-container')
const recipeDetailsContent=document.querySelector('.recipe-details-content')
const recipeCloseBtn=document.querySelector('.recipe-close-btn')
const recipeImg=document.querySelector('.recipeImg')




const fetchRecipes=async (query)=>{
    // recipeContainer.innerHTML='<h2>search...</h2>'
    const data=await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response =await data.json();
    recipeContainer.innerHTML=""
    recipeImg.innerHTML=""

    response.meals.forEach(meal=>{
        const recipDiv=document.createElement('div')
        recipDiv.classList.add('recipe')
        recipDiv.innerHTML=`<img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span> ${meal.strArea}  Dish</span></p>
        <p>${meal.strCategory}</p>`

        const button=document.createElement('button')
        // button.textContent="Recipe"
        button.innerHTML=`<h5>Recipe    <i class="fa fa-cutlery" aria-hidden="true"></i></h5>`
        recipDiv.appendChild(button);
        button.addEventListener('click',function(){
            openRecipePopup(meal)
        })
        recipeContainer.appendChild(recipDiv);

    })
    // console.log(response.meals[0])
}
const fetchIngredients=(meal)=>{
    console.log(meal)
let ingredientsList="";
for(let i=1;i<=20;i++){
    const ingredient=meal[`strIngredient${i}`]
    if(ingredient){
        const measure=meal[`strMeasure${i}`];
        ingredientsList+=`<li>${measure} ${ingredient}</li>`


    }else{
        break;
    }
}
return ingredientsList;
}
const openRecipePopup=(meal)=>{
    recipeDetailsContent.innerHTML=`
     <h2 class="recipeName">${meal.strMeal}</h2>
     <h3  >Ingredents المكونات:</h3>
     <ol class="ingredientList">${fetchIngredients(meal)}</ol>
     <div>
     <br>
     <hr>
     <br>
     <h3  > Instructions طريقة التحضير: </h3>
     <p class="recipeInstructions">${meal.strInstructions}</p>
     </div>
    
    `

    recipeDetailsContent.parentElement.style.display="block"


}
recipeCloseBtn.addEventListener('click',(e)=>{
    recipeDetailsContent.parentElement.style.display="none";
})
searchBtn.addEventListener('click',function(e){
    e.preventDefault()
    const searchInput=searchBox.value.trim()
    fetchRecipes(searchInput)
    console.log('hh')
})


const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...carousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of cards that can fit in the carousel at once
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to beginning of carousel for infinite scrolling
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});

// Insert copies of the first few cards to end of carousel for infinite scrolling
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Add event listeners for the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if(!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
        carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if(Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if(window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);