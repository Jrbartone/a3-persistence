
document.getElementById("bad").style.display = "none"
document.getElementById("login").onclick = function logIn(){
  let user = document.querySelector( '#username' )
  let password = document.querySelector( '#password' )
  //send session info here
  let json = { user: user.value, pass: password.value}
  let body = JSON.stringify(json)
  
  fetch( '/login', {
      method:'POST',
      body 
    }).then(function(response){
      if (response == "OK"){
        location.href='/index.html'
      }
      else if (response == "BAD"){
       document.getElementById("bad").style.display = "inline"
      }
  })
  
}