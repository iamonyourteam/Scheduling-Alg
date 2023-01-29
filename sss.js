const timeInaDay = 8; // maximum hours a tech can work in a day
const maxDriveTime = 31; // maximum distance a tech can travel to a job
let calendar = Array.from({ length: 5 }, () => Array(4).fill([])); // create a 5x4 array filled with empty arrays
let overflow = []; // array to hold jobs that could not be assigned to a tech and location

function fillCalendar() {
  // fetch jobs data from 'jobs.json' file
  fetch("./jobs.json")
    .then((response) => response.json())
    .then((jobs) => {
      // fetch techs data from 'techs.json' file
      fetch("./techs.json")
        .then((response) => response.json())
        .then((techs) => {
          function sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
          }

          // iterate through each job

          jobs.forEach((job) => {
            for (let k = 0; k < 5; k++) {
              // iterate through each day

              for (let j = 0; j < techs.length; j++) {
                // iterate through each tech
                if (techs[j].skill_level >= job.skill_level) {
                  // check if tech's skill level is greater than or equal to job's required skill level
                  let timeTotal = calendar[k][j].reduce(
                    (acc, j) => acc + j.time,
                    0
                  ); // calculate total time assigned to tech on current day and location
                  if (timeTotal + job.time <= timeInaDay) {
                    // check if total time including the job's time is less than or equal to timeInaDay
                    if (
                      calendar[k][j].length === 0 ||
                      Math.abs(calendar[k][j][0].location - job.location) <= 15
                    ) {
                      // check if tech has no jobs assigned on current day and location or if distance between current job and first job assigned to the tech is less than 15
                      calendar[k][j].push(job); // assign job to tech and location
                      document.getElementById(`${k}${j}`).innerHTML =
                        JSON.stringify(calendar[k][j]); // update data in innerHTML of an element with the id  `${k}${j}`
                      return;
                    } else if (
                      Math.abs(calendar[k][j][0].location - job.location) <=
                      maxDriveTime
                    ) {
                      // check if distance between current job and first job assigned to the tech is less than maxDriveTime
                      calendar[k][j].push(job); // assign job to tech and location
                      return;
                    }
                  }
                }

                document.getElementById(`${k}${j}`).innerHTML = JSON.stringify(
                  calendar[k][j]
                )
                  .replace(/[{]+/g, " ")
                  .replace(/"key"+/g, "")
                  .replace(/['":{}[,]+/g, ""); // update data in innerHTML of an element with the id  `${k}${j}`

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

              if (k === 4) {
                // if all days have been iterated through
                overflow.push(job); // add job to overflow array
              }
            }
          });

          console.table(calendar); // log the calendar array to the console
          console.table(overflow);
        });
    });
}
