const form = document.getElementById("registerForm");

form.addEventListener("submit", async(event) => {
	event.preventDefault()

	let data = {
		name: event.target.name.value,
		password: event.target.password.value,
		email: event.target.email.value
	}

	try {
		const response = await axios.post('http://localhost:8080/api/user', data)
		const goodRegister = document.createElement('div');
		goodRegister.className = 'alert alert-success alert-dismissible';
		const strongElement = document.createElement('strong');
		strongElement.textContent = 'Usuário registrado com sucesso!!';
		goodRegister.appendChild(strongElement);
		const registerForm = document.getElementById('registerForm');
		registerForm.appendChild(goodRegister)

		const btnClose = document.createElement('button');
		btnClose.setAttribute('type', 'button');
		btnClose.setAttribute('class', 'btn-close');
		btnClose.setAttribute('data-bs-dismiss', 'alert');
		goodRegister.appendChild(btnClose);

	} catch (error) {
		console.log(error)
		const wrongRegister = document.createElement('div');
		wrongRegister.className = 'alert alert-danger alert-dismissible';

		const registerForm = document.getElementById('registerForm');

		const btnClose = document.createElement('button');
		btnClose.setAttribute('type', 'button');
		btnClose.setAttribute('class', 'btn-close');
		btnClose.setAttribute('data-bs-dismiss', 'alert');
		wrongRegister.appendChild(btnClose);

		const strongElement = document.createElement('strong');
		strongElement.textContent = 'Registro inválido!';
		wrongRegister.appendChild(strongElement);
		wrongRegister.appendChild(document.createTextNode(`${error.response.data.error}`));

		registerForm.appendChild(wrongRegister)
	}
})