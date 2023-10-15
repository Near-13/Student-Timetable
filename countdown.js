function startTimer (state, index, sortedPlanner) {
  
  let id = sortedPlanner[index].intervalId;

  if (state == 'run') {

    clearInterval(id);
    intervalId = setInterval(() => countDown(index, sortedPlanner), 1000);
    sortedPlanner[index].intervalId = intervalId;

  } else 
    clearInterval(id);
}

function countDown(index, sortedPlanner) {
  
    const time = sortedPlanner[index];
    const paragraphElement = document.querySelector(`.js-display-timer${index}`);

    if (time.taskLength.seconds == 0 && (time.taskLength.minute > 0 || time.taskLength.hour > 0)) {
      Number(time.taskLength.seconds = 59);

      if (time.taskLength.minute == 0 && time.taskLength.hour > 0) {
        Number(time.taskLength.minute = 59);
        
        if (time.taskLength.hour > 0) {
          time.taskLength.hour--;
        }
      } else if (time.taskLength.minute > 0) {
        time.taskLength.minute--;
      }
    } else {
      if (time.taskLength.seconds>0)
        time.taskLength.seconds--;
    }

    if (time.taskLength.seconds < 10){
      time.taskLength.seconds = '0' + Number(time.taskLength.seconds);
    }

    if (time.taskLength.minute < 10) {
      time.taskLength.minute =  '0' + Number(time.taskLength.minute);
    }

    if (time.taskLength.hour < 10) {
      time.taskLength.hour =  '0' + Number(time.taskLength.hour);
    }

    const length = dailyPlanner.length;
    paragraphElement.innerHTML = `${time.taskLength.hour}:${time.taskLength.minute}:${time.taskLength.seconds}`
    
    for (let i=0; i<length; i++){

      const pk = dailyPlanner[i].primaryKey;
      const pk2 = sortedPlanner[index].primaryKey;

      if (pk == pk2) {

        dailyPlanner[i].taskLength.hour = time.taskLength.hour;
        dailyPlanner[i].taskLength.minute = time.taskLength.minute;
        dailyPlanner[i].taskLength.seconds = time.taskLength.seconds;
        localStorage.setItem('daily-planner', JSON.stringify(dailyPlanner));
      }
    }
}

