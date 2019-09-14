

function logIn(){
  let user = document.querySelector( '#username' )
  let password = document.querySelector( '#password' )
  //send session info here
  let json = { user: user.value, pass: password.value}
  let body = JSON.stringify(json)
  
  fetch( '/login', {
      method:'POST',
      body 
    }).then(function(response){
       return response.text();
      }).then(function (r){
        if (r == "OK"){
          location.href='/index.html'
        }
        else {
         document.getElementById("baddy").style.display = "inline"
        }
  })
}


window.onload = function() {
    //recieve session info here
  document.getElementById("baddy").style.display = "none"

    const button = document.getElementById( 'loginButton' )
    button.onclick = logIn
  }
