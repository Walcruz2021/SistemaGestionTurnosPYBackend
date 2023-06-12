//segun el package.json este archivos e corre con npm run index

turnosOcu=[{
    day:11,
    moth:6,
    year:2023,
    hour:9
},
{
    day:11,
    moth:6,
    year:2023,
    hour:11
},
{
    day:11,
    moth:6,
    year:2023,
    hour:15
}
]

turnosEmpr=[{
    day:11,
    moth:6,
    year:2023,
    hour:9
},
{
    day:11,
    moth:6,
    year:2023,
    hour:10
},
{
    day:11,
    moth:6,
    year:2023,
    hour:11
},
{
    day:11,
    moth:6,
    year:2023,
    hour:12
},
{
    day:11,
    moth:6,
    year:2023,
    hour:13
},
{
    day:11,
    moth:6,
    year:2023,
    hour:14
},
{
    day:11,
    moth:6,
    year:2023,
    hour:15
},
{
    day:11,
    moth:6,
    year:2023,
    hour:16
},
{
    day:12,
    moth:6,
    year:2023,
    hour:16
}
]

function filterTurnos(turnosOcu,turnosEmpr){
    const distinctHours = turnosOcu.map(turnOcu => turnOcu);
    const filteredTurnos = turnosEmpr.filter(turnEmp => {  return !turnosOcu.some(turnOcu => (
        turnOcu.day === turnEmp.day &&
        turnOcu.month === turnEmp.month &&
        turnOcu.year === turnEmp.year &&
        turnOcu.hour === turnEmp.hour
      ))});
    return filteredTurnos;
}

console.log(filterTurnos(turnosOcu,turnosEmpr))