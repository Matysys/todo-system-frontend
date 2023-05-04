const token = localStorage.getItem('token');

if(token){
	window.location.replace("./lista.html")
}

const form = document.getElementById("loginForm");

form.addEventListener("submit", async(event) => {
	event.preventDefault()

	let data = {
		password: event.target.password.value,
		email: event.target.email.value
	}

	try {
		const response = await axios.post('http://localhost:8080/api/user/login', data)
				// Se a resposta da API incluir o token, armazena o token no localStorage
		if (response.data.token) {
			localStorage.setItem('token', response.data.token);
			window.location.replace("./lista.html")
		}
	} catch (error) {
		console.log(error)
		const wrongLogin = document.createElement('div');
		wrongLogin.className = 'alert alert-danger alert-dismissible';
		const strongElement = document.createElement('strong');
		strongElement.textContent = 'Login inválido!';
		wrongLogin.appendChild(strongElement);
		wrongLogin.appendChild(document.createTextNode(` ${error.response.data.error}`));

		const loginForm = document.getElementById('loginForm');
		loginForm.appendChild(wrongLogin)

		const btnClose = document.createElement('button');
		btnClose.setAttribute('type', 'button');
		btnClose.setAttribute('class', 'btn-close');
		btnClose.setAttribute('data-bs-dismiss', 'alert');
		btnClose.classList.add('my-3');
		wrongLogin.appendChild(btnClose);

	}
})