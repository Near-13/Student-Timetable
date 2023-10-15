let dailyPlanner = JSON.parse(localStorage.getItem('daily-planner')) ||  [
  {taskName: 'Fundamentals of Research', 
  taskInfo: 'Read unit 2. Page 44-52.', 
  priority: 48,
  taskDuration: 60,
  taskLength: {
    hour: 0,
    minute: 27,
    seconds: 0
  },
  intervalId: 0,
  primaryKey: 0},

  {taskName: 'Fundamentals of Research', 
  taskInfo: 'Answer unit 1 questions',
  priority: 32,
  taskDuration: 60, 
  taskLength: {
    hour: 1,
    minute: 0,
    seconds: 0
  },
  intervalId: 0,
  primaryKey: 1},

  {taskName: 'Fundamentals of Research', 
  taskInfo: 'Answer unit 2 questions',
  priority: 32,
  taskDuration: 60, 
  taskLength: {
    hour: 1,
    minute: 0,
    seconds: 0
  },
  intervalId: 0,
  primaryKey: 2},

  {taskName: 'Python Full Course', 
  taskInfo: 'Watch intro to while loops',
  priority: 32,
  taskDuration: 175, 
  taskLength: {
    hour: 2,
    minute: 55,
    seconds: 0
  },
  intervalId: 0,
  primaryKey: 3},

  {taskName: 'Python Full Course', 
  taskInfo: 'Watch from building a guessing game to emoji converter',
  priority: 32,
  taskDuration: 175, 
  taskLength: {
    hour: 2,
    minute: 55,
    seconds: 0
  },
  intervalId: 0,
  primaryKey: 4}
] 

let intervalId = 0;
let primaryKey = JSON.parse(localStorage.getItem('primaryKey')) || 
(dailyPlanner.length + 2);

function checkInput(opMinute, opHour, moMinute, moHour, psMinute, psHour) {
  if (opMinute > 59  || moMinute>59 || psMinute>59) {
    alert("Please do not input minutes higher than 59");
    return false}
  if (opHour>8 || moHour>8 || psHour>8) {
    alert("Please do not input hours higher than 8"); 
    return false}
  if (opMinute <= 0  && opHour <= 0 || moMinute <= 0 && moHour <= 0 || psMinute <= 0 && psHour <= 0) {
    alert("Please input values greater than or equal to 1 in one of the fields.");
    return false}
  else
    return true
}

function computeEstimatedTime() {
  // Optimistic Estimation of Time
  const opMinuteElement = document.querySelector('.js-op-minute');
  const opHourElement = document.querySelector('.js-op-hour');

  const opMinute = Number(opMinuteElement.value);
  const opHour = Number(opHourElement.value)
  const opTimeLength = opHour * 60 + opMinute;

  // Most Likely Estimation of Time
  const moMinuteElement = document.querySelector('.js-mo-minute');
  const moHourElement = document.querySelector('.js-mo-hour');

  const moMinute = Number(moMinuteElement.value);
  const moHour = Number(moHourElement.value);
  const moTimeLength = moHour * 60 + moMinute;

  // Pessimistic Estimation of Time
  const psMinuteElement = document.querySelector('.js-ps-minute');
  const psHourElement = document.querySelector('.js-ps-hour');

  const psMinute = Number(psMinuteElement.value);
  const psHour = Number(psHourElement.value);
  const psTimeLength = psHour * 60 + psMinute;

  const computeEstTime = checkInput(opMinute, opHour, moMinute, moHour, psMinute, psHour);

  // Project Evaluation and Review Technique (PERT) formula
  if (computeEstTime) {
    const estimatedTime = (opTimeLength + 4*moTimeLength + psTimeLength) / 6;
    let estTimeObject = []
    
    estTimeObject.push(
      taskLength = {
        hour: Math.floor(estimatedTime/60),
        minute: Math.ceil(estimatedTime%60),
        seconds: 0
      }
    )

    opMinuteElement.value = '';
    opHourElement.value = '';

    moMinuteElement.value = '';
    moHourElement.value = '';

    psMinuteElement.value = '';
    psHourElement.value = '';
    return estTimeObject;}
}

function computePriority() {
  const easinessElement = document.querySelector('.js-easiness');
  const importanceElement = document.querySelector('.js-importance');
  const urgencyElement = document.querySelector('.js-urgency');

  easiness = Number(easinessElement.value);
  importance = Number(importanceElement.value);
  urgency = Number(urgencyElement.value);

  const priority = easiness * importance * urgency;
  return priority;
}

function addPlanner () {
  const taskNameElement = document.querySelector('.js-task-title-input')
  const taskInfoElement = document.querySelector('.js-task-description-input')

  const taskName = taskNameElement.value;
  const taskInfo = taskInfoElement.value;

  const priority = Math.round(computePriority());
  const taskLength = computeEstimatedTime();
  const duration = taskLength[0].hour*60 + taskLength[0].minute;
  const hour = taskLength[0].hour;
  const minute = taskLength[0].minute;
  const seconds = taskLength[0].seconds;

  console.log(taskName, taskLength, 'addPlanner');

  dailyPlanner.push({
    taskName,
    taskInfo,
    priority,
    taskDuration: duration,
    taskLength: {
      hour,
      minute,
      seconds
    },
    intervalId: 0,
    primaryKey: primaryKey
  })

  primaryKey++;
  localStorage.setItem('primary-key', JSON.stringify(primaryKey));
  localStorage.setItem('daily-planner', JSON.stringify(dailyPlanner));

  sortByPriority(dailyPlanner);
  generateSchedule();

  taskNameElement.value = '';
  taskInfoElement.value = '';
}

function sortByPriority(dailyPlanner) {

  let temp = [];
  const arrayLength = dailyPlanner.length;

  for (let i=0; i<arrayLength; i++)
  { 
    for (let j=0; j<arrayLength-1; j++)
      if (dailyPlanner[i].priority > dailyPlanner[j].priority) {
        temp = dailyPlanner[i];
        dailyPlanner[i] = dailyPlanner[j];
        dailyPlanner[j] = temp;}
  }
}

function greedyAlgo (sortedPlanner = []) {

  let dailyPlannerCopy = dailyPlanner.map(u => Object.assign({}, u, { approved: true }));
  let length=dailyPlanner.length;
  let length2=dailyPlannerCopy.length;

  let dailyLimit = 540;

  for (let i=0; i<length; i++) {

    for(let j=0; j<length2; j++) {

      const hour  = dailyPlannerCopy[j].taskLength.hour*60;
      const minute = Number(dailyPlannerCopy[j].taskLength.minute);
      let taskLength = Number(hour + minute);

      if (dailyLimit - taskLength >= 0) {

        dailyLimit-=taskLength;
        length2--;

        sortedPlanner.push(dailyPlannerCopy[j]);
        dailyPlannerCopy.splice(j, 1);

        if (length2 == 1)
          j=-1;
      }
    }
    
    dailyLimit = 540;
  }
  return sortedPlanner;
}

document.querySelector('.js-add-task')
  .addEventListener('click', () => addPlanner());

document.querySelector('.generate-button')
  .addEventListener('click', () => {

    const length = dailyPlanner.length

    if (length == 0) {
      const paragraphElement = document.querySelector('.js-empty-schedule');
      paragraphElement.innerHTML = "Add a task to generate a schedule"
    } else
      generateSchedule();
})

// I will include this to the coundown timer function instead
// Breaktime na lang yung nakalagay sa separator

function includeBreak (taskLength) {
  let breakTime;

  if (taskLength > 0 && taskLength <= 30) {
    breakTime = 'Take at least 5 minute break'
  } if (taskLength > 30 && taskLength <= 60) {
    breakTime = 'Take at least 10 minute break'
  } if (taskLength > 60 && taskLength <= 90) {
    breakTime = 'Take at least 15 minute break'
  } if (taskLength > 90 && taskLength <= 120) {
    breakTime = 'Take at least 20 minute break'
  } if (taskLength > 120 && taskLength <= 150) {
    breakTime = 'Take at least 30 minute break'
  } if (taskLength > 150 && taskLength <= 180) {
    breakTime = 'Take up to 45 minute break'
  } if (taskLength > 180 && taskLength <= 240) {
    breakTime = 'Take up to 1 hour break'
  } if (taskLength > 240 && taskLength <= 300) {
    breakTime = 'Take up to 45 minute break every 2-3 hours'
  } if (taskLength > 300 && taskLength <= 420) {
    breakTime = 'Take up to 1 hr break every 2-3 hours'
  } if (taskLength > 420 && taskLength <= 516) {
    breakTime = 'Have up to 1 hr and 30 minute break every 4 hrs'
  }
  return breakTime;
}