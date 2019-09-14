
document.getElementById("bad").style.display = "none"

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
      response = response.json();
      document.getElementById('login').innerHTML = response
      if (response == "OK"){
        location.href='/index.html'
      }
      else if (response == "BAD"){
       document.getElementById("bad").style.display = "inline"
      }
  })
  
}

window.onload = function() {
    //recieve session info here
    const button = document.getElementById( 'login' )
    button.onclick = logIn
  }
