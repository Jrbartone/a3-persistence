
document.getElementById("bad").style.display = "none"
document.getElementById("dupe").style.display = "none"
document.getElementById("ok").style.display = "none"
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
        else if (r == "BAD"){
         document.getElementById("bad").style.display = "inline"
        }
  })
}

function createAccount(){
  let user = document.querySelector( '#newUsername' )
  let password = document.querySelector( '#newPassword' )
  //send session info here
  let json = { user: user.value, pass: password.value}
  let body = JSON.stringify(json)
  
  fetch( '/create', {
      method:'POST',
      body 
    }).then(function(response){
       return response.text();
      }).then(function (r){
        if (r == "OK"){
         document.getElementById("ok").style.display = "inline"
        }
        else if (r == "BAD"){
         document.getElementById("dupe").style.display = "inline"
        }
  })
}

window.onload = function() {
    //recieve session info here
    const button = document.getElementById( 'login' )
    button.onclick = logIn
    const button2 = document.getElementById('createAccount')
    button2.onclick = createAccount
  }
