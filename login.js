let loadLogin = function(errors = []) {
  renderErrors(errors)
  renderLoginForm()
  loginForm.onsubmit = (e) => {
    e.preventDefault()
    removeErrors()
    const formData = {}
    formData.name = userName.value
    formData.password = password.value
    authUser(formData).then((res) => {
      if (res.status === 401) {
        loadLogin(["Invalid Username or Password"])
      } else {
        return res.json()
      }
    }).then((json) => {
      if (typeof json === 'object') {
        console.log(json)
        let token = json.auth_token
        document.cookie = `session_token=${json.auth_token}; expires=` + setExpiration(60).toUTCString() + "; path=/";
        get_user(token, formData.name).then(res => renderMain())
      }
    })
  }
}

function authUser(formData) {
  return fetch(`http://${serverAddress}/authenticate`, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      mode: 'no-cors',
      'Accept': 'application/json',
      "Content-Type": 'application/json'
    }
  })
}


function renderLoginForm() {
  loginContent.innerHTML = `
    <form id=loginForm>
      Username:<br>
      <input type="text" id=userName name="username"><br>
      Password:<br>
      <input type="password" id=password name="password"><br>
      <input id="submit" type="submit" value="Submit">
    </form>`
}

function removeErrors() {
  let errors = document.querySelectorAll('.error')
  errors.forEach(el => el.remove())
}

function renderErrors(errors = []) {
  errors.forEach(el => {
    let error = document.createElement('h1')
    error.className = 'error'
    error.innerHTML = el
    document.body.prepend(error)
  })
}
function logOut() {
  deleteCookies()
  loginContent.style.display = 'block'
  mainContentContainer.style.display = 'none'
}


let is_loggedin = function() {
  document.cookie ? renderMain() : loadLogin()
}
