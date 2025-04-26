const token = localStorage.getItem('token');

//Verifica se o Token existe
if(token) {
  const payload = token.split('.')[1]; //Separa a segunda parte do token

  const decodedPayload = JSON.parse(atob(payload)); //Decodifica o payload usando a classe Base64 e converte para objeto JSON
  const userId = decodedPayload.userId

  const username = document.getElementById('username');
  username.innerHTML = decodedPayload.name + "!"; //Coloca o nome de usuário que veio do Token no elemento HTML.
  username.style.color = "purple";

  const formEdit = document.getElementById("formEditarTarefa");
  const formCriarTarefa = document.getElementById("formCriarTarefa");

  //Essa função vai criar a lista de tarefas na tela do usuário.
  const toDoList = async() =>{

    let data = []

    //Tentando fazer uma requisição GET com o id do usuário.
    try{
      const response = await axios.get(`http://localhost:8080/api/todolist/${userId}`)
      data = response.data;
      console.log("Mateus Lima esteve aqui!\nMostrando como os dados chegam no console...\n\n")
    }catch(error){
      const msg = document.createElement('h1')
      msg.style.padding = "50px"
      msg.textContent = 'Não há tarefas no momento.';
      document.getElementById('container').appendChild(msg)
      return;
    }


    let color;
    let backgroundColor;

    //Para cada item da tarefa, executa tal algoritmo.
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

      if(item.finished == "SIM"){
        backgroundColor = "#BCBCBC";
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

      if(item.finished != "SIM"){
        const todoPriority = document.createElement('p');
        todoPriority.innerHTML = `Prioridade: <span style='color: ${color}; font-weight: bold;'>${item.priority}</span>`;
        todoPriority.classList.add('card-text');
        cardBody.appendChild(todoPriority);
      }else{
        const todoFinalizada = document.createElement('p');
        todoFinalizada.innerHTML = `<div style='color: #3AFF00; font-weight: bold; font-size: 30px; text-align: center;'>CONCLUÍDA</div>`;
        todoFinalizada.classList.add('card-text');
        cardBody.appendChild(todoFinalizada);
      }

      const todoRegistrationDate = document.createElement('p');
      todoRegistrationDate.innerHTML = `<span style="font-weight: bold;">Data de criação da tarefa:</span> ${convertDate(item.registrationDate)}`;
      todoRegistrationDate.classList.add('card-text');
      cardBody.appendChild(todoRegistrationDate);

      const todoFinalDate = document.createElement('p');
      todoFinalDate.innerHTML = `<span style="font-weight: bold;">Prazo previsto:</span> ${convertDate(item.finalDate)}`;
      todoFinalDate.classList.add('card-text');
      cardBody.appendChild(todoFinalDate);

      if(item.finished != "SIM"){
        const btnEdit = document.createElement('button');
        const btnImg = document.createElement('img')
        btnImg.setAttribute('src', './img/edit.png')
        btnImg.style.width = "30px"
        btnImg.style.height = "30px"
        btnEdit.style.backgroundColor = "transparent";
        btnEdit.style.border = "none";
        btnEdit.setAttribute('id', `${item.id}`);
        btnEdit.setAttribute('type', `button`);

        btnEdit.appendChild(btnImg) 
        cardBody.appendChild(btnEdit);

        btnEdit.addEventListener('click', function(){
          const todoListId = document.getElementById("todoListId");
          const todoName = document.getElementById("todoName");
          const todoDescription = document.getElementById("todoDescription");
          const selectPriority = document.getElementById("selectPriority");
          const todoFinalDate = document.getElementById("todoFinalDate");

          todoListId.value = this.id;
          formEdit.style.display = "block";
          todoName.value = item.name;
          todoDescription.value = item.description;
          selectPriority.value = item.priority;
          todoFinalDate.value = item.finalDate;

        })

        const btnDelete = document.createElement('button');
        const btnImg2 = document.createElement('img');

        btnImg2.setAttribute('src', './img/delete.png')
        btnImg2.style.width = "30px";
        btnImg2.style.height = "30px";
        btnDelete.style.backgroundColor = "transparent";
        btnDelete.style.border = "none";
        btnDelete.setAttribute('id', `${item.id}`);
        btnDelete.setAttribute('type', `button`);

        btnDelete.appendChild(btnImg2) 
        cardBody.appendChild(btnDelete);

        btnDelete.addEventListener('click', async function(){
          if(confirm("Quer mesmo apagar essa tarefa?")){
            try{
              const taskId = this.id;
              const response = await axios.delete(`http://localhost:8080/api/todolist/delete/${taskId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              alert("Tarefa deletada com sucesso!");
              location.reload();
            }catch(error){
              alert(error.response.data);
            }
          }
        })


        const btnCompleted = document.createElement('button');
        const btnImg3 = document.createElement('img')
        btnImg3.setAttribute('src', './img/completed.png')
        btnImg3.style.width = "30px";
        btnImg3.style.height = "30px";
        btnCompleted.style.backgroundColor = "transparent";
        btnCompleted.style.border = "none";
        btnCompleted.setAttribute('id', `${item.id}`);
        btnCompleted.setAttribute('type', `button`);

        btnCompleted.appendChild(btnImg3) 
        cardBody.appendChild(btnCompleted);


        //Função que será executada ao clicar no botão de tarefa completada.
        btnCompleted.addEventListener('click', async function(){
          if(confirm("Sua tarefa foi realmente concluída? Tarefas concluídas não podem ser deletadas.")){
            try{
              const taskId = this.id;
              const response = await axios.patch(`http://localhost:8080/api/todolist/finish/${taskId}`, {}, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              alert("Sua tarefa agora está concluída!!!");
              location.reload();
            }catch(error){
              alert(error.response);
            }
          }
        })

      }
      const imgTodo = document.createElement('img');
      imgTodo.setAttribute('src', `./img/tasks.png`);
      imgTodo.setAttribute('alt', `task image`);
      imgTodo.style.width = "100%";
      imgTodo.classList.add('card-image-bottom');
      card.appendChild(imgTodo);
    })

}
//Função que vai trazer os detalhes sobre as tarefas, como o número totais de tarefas.
const toDoDetails = async() => {
  let data = []
  try{
    const response = await axios.get(`http://localhost:8080/api/todolist/details/${userId}`)
    data = response.data;
    console.log("Detalhes números sobre as tarefas abaixo:\n\n", data);
  }catch(error){
    console.log("Detalhes não existem: HTTP STATUS", error.response.status)
    
  }

  //Biblioteca que vai criar úm gráfico de colunas para os detalhes das tarefas.
  Highcharts.chart('chart-container', {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Detalhes sobre suas tarefas'
    },
    xAxis: {
      categories: ['Total', 'Baixa prioridade', 'Média prioridade', 'Alta prioridade', 'Fora do prazo', 'Concluídas']
    },
    yAxis: {
      title: {
        text: 'Quantidade de tarefas'
      }
    },
    plotOptions: {
      column: {
        colorByPoint: true,
        colors: ['#0072C6', '#20A400', '#FFC000', '#C00000', '#3E0000', '#CCCCCC']
      }
    },
    series: [{
      name: 'Tarefas',
      data: [data.totalTasks, data.totalBaixa, data.totalMedia, data.totalAlta, data.totalOutOfLimit, data.totalfinished],
      dataLabels: {
        enabled: true,
        color: '#FFFFFF',
        style: {
          fontSize: '13px',
          fontFamily: 'Verdana, sans-serif'
        }
      }
    }]
  });
}

//Função para adicionar uma nova tarefa
formCriarTarefa.addEventListener("submit", async(event) => {
  event.preventDefault()

  let taskToAdd = {
    name: event.target.todoNewName.value,
    description: event.target.todoNewDescription.value,
    priority: event.target.selectNewPriority.value,
    finalDate: event.target.todoNewFinalDate.value,
    userId: decodedPayload.userId
  }
  try{
    const response = await axios.post("http://localhost:8080/api/todolist", taskToAdd, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert(response.data);
    location.reload();
  }catch(error){
    alert(error.response.data);
    formEdit.style.display = none;
  }
})




toDoList(); //Mostrando as tarefas.
toDoDetails(); //Mostrando os detalhes das tarefas.

//Função para editar as tarefas.
formEdit.addEventListener("submit", async(event) => {
  event.preventDefault()

  let taskToUpdate = {
    id: event.target.todoListId.value,
    name: event.target.todoName.value,
    description: event.target.todoDescription.value,
    priority: event.target.selectPriority.value,
    finalDate: event.target.todoFinalDate.value,
    userId: decodedPayload.userId
  }
  try{
    console.log(taskToUpdate);
    const response = await axios.patch("http://localhost:8080/api/todolist/update", taskToUpdate, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    alert(response.data);
    location.reload();
  }catch(error){
    alert(error.response.data);
    formEdit.style.display = none;
  }
})

} else {
  window.location.replace("index.html")
}

const btnLogout = document.getElementById("logout");

//Função para deslogar do sistema.
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "index.html";
});

const btnTarefa = document.getElementById("criarTarefa");

//Esse botão vai mostrar o formulário de criar uma nova tarefa
btnTarefa.addEventListener('click', function(){
  formCriarTarefa.style.display = "block";
});

//Função pra converter a data do formato americano para o formato brasileiro.
function convertDate(data){;
let dataBrasileira = data.split('-').reverse().join('/');
return dataBrasileira
}
