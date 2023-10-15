function generateSchedule () {

  sortByPriority(dailyPlanner);
  let sortedPlanner = [];

  let dailyLimit = 540;
  let dailyPlannerCopy = dailyPlanner.map(temp => Object.assign({}, temp, { approved: true }));

  let length=dailyPlanner.length;
  let length2=dailyPlannerCopy.length;
  let day = 1;

  let dailyPlannerHTML = '';
  let html = '';
  let index = 0;

  document.querySelector('.js-generated-table').innerHTML = dailyPlannerHTML;

  for (let i=0; i<length; i++) {
    if (length2 > 0) {
      html += `
        <div class="per-day-container">
          <div class="heading-container">
            <h2 class="per-day-heading">DAY ${day}:</h2>
            <input class="input-date" type="date">
          </div>
      `;
      }

    for(let j=0; j<length2; j++) {

      const taskLength = dailyPlannerCopy[j].taskDuration;
      const taskName = dailyPlannerCopy[j].taskName;
      const taskInfo = dailyPlannerCopy[j].taskInfo;

      console.log(taskName, dailyPlannerCopy[j].taskDuration);

      let taskName_taskLength = '';
      
      if (dailyLimit - taskLength >= 0) {

        dailyLimit-=taskLength;

        taskName_taskLength = `
          <div class="per-task-container">
            <div class="task-title-container">
              <div class="task-title" contenteditable="true">${taskName}</div>

              <input class="checkbox" type="checkbox">
            </div>

            <div class=task-info-container">
              <div class="task-info" contenteditable="true">${taskInfo}</div>
            </div>

            <div class="task-button-container">
              <div class="countdown-container">
                <div class = "countdown-button-container">
                  <button class = "js-button pause-button js-pause-button">
                    <img src = "icons/pause-icon.png" class = "icon-pause">
                  </button>
            
                  <button class = "js-button play-button js-countdown-button">
                    <img src = "icons/play-icon.png" class = "icon-play">
                  </button>
                </div>

                <div class = "js-stop-watch">
                  <p class = "js-display-timer display-timer js-display-timer${index}">
                    00:00:00
                  </p>
                </div>
              </div>

              <div class="delete-button-container">
                <button class="delete-button js-delete-task-button">
                  delete
                </button>
              </div>
            </div>
          </div>

          <div class="break-container">
            <p class="break-time-text">${includeBreak(taskLength)}</p>
          </div>
          `

          console.log(taskName, index);

          length2--;
          index++;

          html += taskName_taskLength;
          sortedPlanner.push(dailyPlannerCopy[j]);
          dailyPlannerCopy.splice(j, 1);
  
          if (length2 > 0)
            j=-1;
      }
    }

    if (length2 >= 0) {
      html += `</div>`
      if (length2==0)
        length2-=10;}

    dailyLimit = 540;
    day++;

    dailyPlannerHTML += html;
    html = '';
  }
    document.querySelector('.js-generated-table').innerHTML = dailyPlannerHTML;

    document.querySelectorAll('.js-countdown-button').forEach((runButton, index) => {
      runButton.addEventListener('click', () => {
        startTimer('run', index, sortedPlanner)
      });
    });

    document.querySelectorAll('.js-pause-button').forEach((pauseButton, index) => {
      pauseButton.addEventListener('click', () => {
        startTimer('pause', index, sortedPlanner)
      });
    });

    document.querySelectorAll('.js-delete-task-button').forEach((deleteButton, index) => {
      deleteButton.addEventListener('click', () => {

        const length = dailyPlanner.length;
        const confirm = window.confirm("Are you sure you want to delete the task?");

        for (let i=0; i<length; i++){
          const pk = dailyPlanner[i].primaryKey;
          const pk2 = sortedPlanner[index].primaryKey;

          if (pk == pk2 && confirm) {
            dailyPlanner.splice(i, 1);
            localStorage.setItem('daily-planner', JSON.stringify(dailyPlanner));
            generateSchedule();
            return;}
        }
      });
    });

    document.querySelectorAll('.js-display-timer').forEach((displayTimer, index) => {

      let paragraphElement = displayTimer;
      let time = sortedPlanner[index];

      if (time.taskLength.seconds < 10){
        time.taskLength.seconds = '0' + Number(time.taskLength.seconds);
      }

      if (time.taskLength.minute < 10) {
        time.taskLength.minute = '0' + Number(time.taskLength.minute);
      }

      if (time.taskLength.hour < 10) {
        time.taskLength.hour = '0' + Number(time.taskLength.hour);
      }
      
      paragraphElement.innerHTML = `${time.taskLength.hour}:${time.taskLength.minute}:${time.taskLength.seconds}`
      });

      document.querySelectorAll('.task-info').forEach((taskInfo, index) => {
        taskInfo.addEventListener('input', () => {
          
          console.log(dailyPlanner[index].primaryKey);
          const length = dailyPlanner.length;
          
          for (let i=0; i<length; i++){

            const pk = dailyPlanner[i].primaryKey;
            const pk2 = sortedPlanner[index].primaryKey;

            if (pk == pk2) {

              dailyPlanner[i].taskInfo = taskInfo.innerHTML;
              localStorage.setItem('daily-planner', JSON.stringify(dailyPlanner));

              }
          }
        })
      })

      document.querySelectorAll('.task-title').forEach((taskTitle, index) => {
        taskTitle.addEventListener('input', () => {
          
          console.log(dailyPlanner[index].primaryKey);
          const length = dailyPlanner.length;
          
          for (let i=0; i<length; i++){

            const pk = dailyPlanner[i].primaryKey;
            const pk2 = sortedPlanner[index].primaryKey;

            if (pk == pk2) {

              dailyPlanner[i].taskName = taskTitle.innerHTML;
              localStorage.setItem('daily-planner', JSON.stringify(dailyPlanner));

              }
          }
        })
      })
}
