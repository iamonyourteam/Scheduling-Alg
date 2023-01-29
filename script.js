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
function fillCalendar() {
  fetch("./jobs.json")
    .then((response) => response.json())
    .then((jobs) => {
      // console.table(jobs);

      fetch("./techs.json")
        .then((response) => response.json())
        .then((techs) => {
          // console.table(techs);

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
                  .replace(/"key"+/g, "<hr>")
                  .replace(/['",:{}[]+/g, "");

                document.getElementById("techs").innerHTML = JSON.stringify(
                  techs,
                  null,
                  "\t"
                )
                  .replace(/[{]+/g, "<br>")
                  .replace(/"key"+/g, "<hr>")
                  .replace(/['",:{}[]+/g, "");
              }
              //see if any extra jobs
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
