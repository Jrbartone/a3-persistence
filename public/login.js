

document.getElementById("login").onclick = function logIn(){
  let user = document.querySelector( '#username' )
  let password = document.querySelector( '#password' )
  //send session info here
  let json = { user: user.value, pass: password.value}
  let body = JSON.stringify(json)
  fetch( '/submit', {
      method:'POST',
      body 
    }).then(function(response){
      if (response == "OK"){
        location.href='/'
      }
      else if (response == "BAD"){
        
      }
  })
  
}