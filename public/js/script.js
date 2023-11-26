(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()
  

  let ratings=document.querySelectorAll('.no-scroll')
  for(let rating of ratings){
    rating.addEventListener('mouseover', function(event) {
      // Get the current page scroll position
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    
      // if any scroll is attempted, set this to the previous value
      window.onscroll = function() {
        window.scrollTo(scrollLeft, scrollTop);
      };
    });
    rating.addEventListener('mouseleave', function(event) {
    
      // if any scroll is attempted, set this to the previous value
      window.onscroll = function() {};
      
    });
  }



  //Toggle favorite



async function addToFavorite(listingId,currUser){
  let favBtn=document.getElementById(listingId);
  let removeBtn=document.getElementById("del-"+listingId);

  if (!currUser) {
    return window.location.href = "/login";
  }
  let response = await axios.post(`/favorites/${listingId}`);
  favBtn.style.display="none"
  removeBtn.style.display="inline"
  
}  

async function removeFavorite(listingId,currUser){
  let favBtn=document.getElementById(listingId);
  let removeBtn=document.getElementById("del-"+listingId);
  console.log("onlick");
  
  removeBtn.style.display="none"
  favBtn.style.display="inline"
  let response = await axios.delete(`/favorites/${listingId}`);
}  



   