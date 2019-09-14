
document.getElementById("bad").style.display = "none"
document.getElementById("bad").style.alignContent = "center"

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
         document.getElementById("bad").style.display = "inline"
        }
  })
}


window.onload = function() {
    //recieve session info here
    const button = document.getElementById( 'login' )
    button.onclick = logIn
  }
