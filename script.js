const timeInaDay = 8;
const maxDriveTime = 31;
let calendar = [
  [[], [], [], []],
  [[], [], [], []],
  [[], [], [], []],
  [[], [], [], []],
  [[], [], [], []],
];
let overflow = [];

function clearData() {
  for (let k = 0; k < 5; k++) {
    //check prerequisites
    for (let j = 0; j < 4; j++) {
      document.getElementById(`${k}${j}`).innerHTML = "";
      document.getElementById("jobs").innerHTML = "";
      document.getElementById("techs").innerHTML = "";
      document.getElementById("overflow").innerHTML = "";
    }
  }
}

function fillCalendar() {
  document.getElementById("fillButton").disabled = true;
  fetch("./jobs.json")
    .then((response) => response.json())
    .then((jobs) => {
      fetch("./techs.json")
        .then((response) => response.json())
        .then((techs) => {
          // Randomize Job Order
          let jobsRandom = "";
          for (let i = jobs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = jobs[i];
            // Swap
            jobs[i] = jobs[j];
            jobs[j] = temp;
          }
          jobsRandom = jobs[0];

          function schedualJob(job) {
            // Conditions
            function isSkilled(j) {
              return techs[j].skill_level >= job.skill_level;
            }
            function isTimeInDay(j, k, job) {
              if (calendar[k][j].length == 0) {
                return true;
              }

              let timeTotal = 0;
              calendar[k][j].forEach((element) => (timeTotal += element.time));
              if (timeTotal + job.time <= timeInaDay) {
                return true;
              }
            }
            function isDriveTime(j, k, job) {
              if (calendar[k][j].length == 0) {
                return true;
              }
              return true;
            }

            console.log(job);
            //loop over techs and days of week

            daysLoop: for (let k = 0; k < 5; k++) {
              //check prerequisites
              techsLoop: for (let j = 0; j < techs.length; j++) {
                if (isSkilled(j) && isTimeInDay(j, k, job)) {
                  if (calendar[k][j].length == 0) {
                    calendar[k][j].push(job);
                    document.getElementById(`${k}${j}`).innerHTML =
                      JSON.stringify(calendar[k][j]);
                    break daysLoop;
                  }

                  //check to see if job is close to another previous schedualed job
                  else if (calendar[k][j].length != 0) {
                    if (
                      Math.abs(calendar[k][j][0].location - job.location) <= 15
                    ) {
                      calendar[k][j].push(job);

                      document.getElementById(`${k}${j}`).innerHTML =
                        JSON.stringify(calendar[k][j]);

                      break daysLoop;
                    } else if (
                      Math.abs(calendar[k][j][0].location - job.location) <=
                      maxDriveTime
                    ) {
                      calendar[k][j].push(job);

                      break daysLoop;
                    }
                  }
                }
                //draw callendar
                document.getElementById(`${k}${j}`).innerHTML = JSON.stringify(
                  calendar[k][j]
                )
                  //   .replace(/[{]+/g, " ")
                  .replace(/"key"+/g, "");
                document.getElementById("overflow").innerHTML = JSON.stringify(
                  overflow
                )
                  .replace(/[{]+/g, "<br>")
                  .replace(/"key"+/g, "<hr>")
                  .replace(/['",:{}[]+/g, "");
                document.getElementById("jobs").innerHTML = JSON.stringify(
                  jobs,
                  null,
                  "\t"
                )
                  .replace(/[{]+/g, "<br>")
                  .replace(/"key"+/g, "<p>")
                  .replace(/job+/g, "<strong>Name&#58;</strong> Job")
                  .replace(/location+/g, "<strong>Location&#58;</strong>")
                  .replace(/skill_level+/g, "<strong>Skill Level&#58;</strong>")
                  .replace(/time+/g, "<strong>Time&#58;</strong>")

                  .replace(/['":{}[]+/g, "")
                  .replace(/,+/g, "<br>");

                document.getElementById("techs").innerHTML = JSON.stringify(
                  techs,
                  null,
                  "\t"
                )
                  .replace(/[{]+/g, "<br>")
                  .replace(/"key"+/g, "<hr>")
                  .replace(/['",:{}[]+/g, "");
              }
              //see if  extra jobs
              if (k == 4) {
                overflow.push(job);
              }
            }
          }

          for (let i = 0; i < jobs.length; i++) {
            schedualJob(jobs[i]);
          }
        });
    });
}
