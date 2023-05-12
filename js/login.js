//Atribui o valor do Token que veio da API para a constante token.
const token = localStorage.getItem('token');

//Checa se o Token existe e manda o usuário de volta para a tela de lista de tarefas se existir.
if(token){
	window.location.replace("./lista.html")
}

//Atribuindo o form de login na constante form.
const form = document.getElementById("loginForm");

//Função que vai executar quando o formulário de login for submetido
form.addEventListener("submit", async(event) => {
	event.preventDefault()

	let userLogin = {
		password: event.target.password.value,
		email: event.target.email.value
	}

	//Tentativa de uma requisição HTTP POST para a API.
	try {
		const response = await axios.post('http://todolistsystem.dynv6.net:8080/api/user/login', userLogin)
		const data = await response.data;

		// Se a resposta da API incluir o token, armazena o token no localStorage.
		if (data) {
			localStorage.setItem('token', data.token);
			window.location.replace("./lista.html");
		}

	//Para qualquer erro, criar uma janelinha que demonstre o erro em questão.
	} catch (error) {
		console.log(error)
		const wrongLogin = document.createElement('div');
		wrongLogin.className = 'alert alert-danger alert-dismissible';
		const strongElement = document.createElement('strong');
		strongElement.textContent = 'Login inválido!';
		wrongLogin.appendChild(strongElement);
		wrongLogin.appendChild(document.createTextNode(` ${error.response.data}`));

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