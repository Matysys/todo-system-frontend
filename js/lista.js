const token = localStorage.getItem('token');

if (token) {
  const payload = token.split('.')[1]; // Separa a segunda parte do token

  const decodedPayload = JSON.parse(atob(payload)); // Decodifica o payload usando a classe Base64 e converte para objeto JSON
  const userId = decodedPayload.userId

  const toDoList = async() =>{
    const response = await axios.get(`http://localhost:8080/api/todolist/${userId}`)
    const data = await response.data;
    console.log(data)

    let color;
    let backgroundColor;

    data.forEach(item =>{

      switch(item.priority){
      case "BAIXA":
        color = "#25A418";
        backgroundColor = "#E8FFE3";
        break;
      case "MÉDIA":
        color = "#FEE300";
        backgroundColor = "#FDFFC4";
        break;
      case "ALTA":
        color = "#FF0000";
        backgroundColor = "#FF8585";
        break;
      default:  

      }   

      const card = document.createElement('div');
      card.classList.add('card');
      card.classList.add('task');
      card.style.backgroundColor = `${backgroundColor}`;

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');
      cardBody.classList.add('taskBody');
      card.appendChild(cardBody);
      document.getElementById("list").appendChild(card);  

      const todoTitle = document.createElement('h4');
      todoTitle.innerHTML = item.name;
      todoTitle.classList.add('card-title');
      cardBody.appendChild(todoTitle);

      const todoDescription = document.createElement('p');
      todoDescription.innerHTML = `<span style="font-weight: bold;">Descrição:</span> ${item.description}`;
      todoDescription.classList.add('card-text');
      cardBody.appendChild(todoDescription);

      const todoPriority = document.createElement('p');
      todoPriority.innerHTML = `Prioridade: <span style='color: ${color}; font-weight: bold;'>${item.priority}</span>`;
      todoPriority.classList.add('card-text');
      cardBody.appendChild(todoPriority);

      const todoRegistrationDate = document.createElement('p');
      todoRegistrationDate.innerHTML = `<span style="font-weight: bold;">Data de criação da tarefa:</span> ${convertDate(item.registrationDate)}`;
      todoRegistrationDate.classList.add('card-text');
      cardBody.appendChild(todoRegistrationDate);

      const todoFinalDate = document.createElement('p');
      todoFinalDate.innerHTML = `<span style="font-weight: bold;">Prazo previsto:</span> ${convertDate(item.finalDate)}`;
      todoFinalDate.classList.add('card-text');
      cardBody.appendChild(todoFinalDate);

      const btnEdit = document.createElement('button');
      btnEdit.setAttribute('id', `${item.id}`);
      btnEdit.setAttribute('type', `button`);

      btnEdit.addEventListener('click', function(){
        alert(this.id);
      })

      btnEdit.classList.add('btn');
      btnEdit.classList.add('btn-primary');
      btnEdit.innerHTML = "Editar tarefa"; 
      cardBody.appendChild(btnEdit);

      const imgTodo = document.createElement('img');
      imgTodo.setAttribute('src', `./img/tasks.png`);
      imgTodo.setAttribute('alt', `task image`);
      imgTodo.style.width = "100%";
      imgTodo.classList.add('card-image-bottom');
      card.appendChild(imgTodo);





    })

  }

  toDoList()

} else {
  window.location.replace("index.html")
}

const btnLogout = document.getElementById("logout")

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  // redireciona para a página de login
  window.location.href = "index.html";
});

function convertDate(data){;
let dataBrasileira = data.split('-').reverse().join('/');
return dataBrasileira
}