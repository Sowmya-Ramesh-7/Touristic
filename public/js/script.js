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
  

  let ratings=document.querySelectorAll('.rate-area')
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
      

    

  