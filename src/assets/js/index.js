const btnRecord = document.querySelector('.record-botton');
const tasksCountText = document.querySelector('.tasks-count-text')
const filterPriority = document.querySelector('#filter-priority');
const loginBtn = document.querySelector('#loginBtn');
const registerBtn = document.querySelector('.registerBtn');
const logoutBtn = document.querySelector('.logoutBtn');
const loginForm = document.getElementById('loginForm');
const loginFormContent = document.getElementById('loginFormContent');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');


let recognition;
let isRecording = false;

recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.lang = 'es-ES';

recognition.onstart = () => updateRecordingStatus(true);
recognition.onend = () => updateRecordingStatus(false);

function updateRecordingStatus(isRecording) {
  btnRecord.textContent = isRecording ? '⏹️ Detener Grabación' : '🎙️ Grabar Tarea';
}

const countTasks = async () => {
  await fetch("/api/tasks")
    .then(res => res.json())
    .then(totalTasks => {
      // Calculate total tasks and completed tasks
      const tasks = totalTasks.length;
      const completedTasks = totalTasks.filter(task => task.done).length;

      // Update the tasks count text
      tasksCountText.textContent = `Tareas: ${tasks} | Completadas: ${completedTasks}`;
    }
    )
}



const updateTaskStatus = async (taskId, isDone) => {
  await fetch(`/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ done: isDone })
  })
    .then(response => {
      if (!response.ok) console.error('Error al actualizar la tarea');
    })
    .catch(error => console.error('Error al actualizar la tarea:', error));
}

const addTask = ({ transcriptFinal, priority }) => {
  const newTask = {
    text: transcriptFinal.charAt(0).toUpperCase() + transcriptFinal.slice(1),
    done: false,
    priority,
    date: new Date().toISOString()
  };

  fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  })
  .catch(error => console.error('Error al añadir la tarea:', error));
}

recognition.onresult = (event) => {
  let priority = "tranqui";
  const transcript = event.results[0][0].transcript;
  const transcriptFinal = transcript.replace(/categoría.*/, "");
  if (transcript.includes("urgente")) {
    priority = "urgente";
  }
  else if (transcript.includes("medio")) {
    priority = "medio";
  }
  addTask({ transcriptFinal, priority });
  document.getElementById('tasks-list').dispatchEvent(new Event('htmx:refresh'));
  
};

btnRecord.addEventListener('click', () => {
  if (isRecording) {
    recognition.stop();
    isRecording = false;
  } else {
    recognition.start();
    isRecording = true;
  }
});

countTasks()