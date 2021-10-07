const ftp = require('basic-ftp');
const fs = require('fs');
const login = require('./nordpool.js');
const readline  = require('readline');

const myFile = './spotprice-downloaded.sdv';
const delimiter = ';';
const dateHeaderLine = 2;
const dateValueLine = 6;
const priceHeaderLine = 3;
const se3ValueLine = 69;
const priceColStart = 8;
const priceColEnd = 33;
const createdHeader = ["DataType", "TimeMade", "DateMade"];
const priceHeader = ["Data_type", "Code", "Year", "Week", "Day", "Date", "Area", "Currency", "Hour1", "Hour2", "Hour3A", "Hour3B", "Hour4", "Hour5", "Hour6", "Hour7", "Hour8", "Hour9", "Hour10", "Hour11", "Hour12", "Hour13", "Hour14", "Hour15", "Hour16", "Hour17", "Hour18", "Hour19", "Hour20", "Hour21", "Hour22", "Hour23", "Hour24", "Average" ];


/*//////////////////////////////////
obj innehåller hela sdv filen i JS-objektform

obj.Made - filhämtningsdatum
  {
    DataType: "ST",
    TimeMade: "16:00",
    DateMade: "06.10.2021",
  }

obj.Meta - prisrubriker 
  {
    Data_type: "PR",
    Code: "SO",
    Year: "2021",
    Week: "40",
    Day: "4",
    Date: "07.10.2021",
    Area: "SE3",
    Currency: "SEK",
  }

obj.Price - pris per timme
{
  Hour1: 451.9,
  Hour2: 407.73,
  Hour3A: 363.45,
  Hour4: 308.49,
  Hour5: 356.12,
  etc...
}
//////////////////////////////////*/
getSpotPrice()
//main();


/*//////////////////////////////////
Laddar ned fil med aktuella spotpriser

inparametrar: inga
ut: "spotprice-downloaded.sdv" via FTP från nordpoolspot.com
Funkis
//////////////////////////////////*/
async function getSpotPrice() {
  const client = new ftp.Client()
  client.ftp.verbose = false

  try {
    await client.access({
      host: login.host,
      user: login.user,
      password: login.password,
      secure: login.secure
    })
    await client.downloadTo("spotprice-downloaded.sdv", "spotprice.sdv")
    await main()
  } 
  catch (err) { console.log(err) }
  client.close()
}


/*//////////////////////////////////
async function
in: fil med semikolonseparerad osymmetrisk värden
out: objekt med namngivna värden
//////////////////////////////////*/
function getObj(callback) {
  //let myArr = [];
  fs.readFile(myFile, function (err, result) {
    if (err) {
      return console.log(err);
    }
    str = result.toString();
    res = str.replace(/,/g, '.');
    myArr = res.split('\n');
    callback(myArr);
  })
}

/*//////////////////////////////////
Återanvänd funktion
in: radnummer på infil
ut: array av element på given rad 
/*//////////////////////////////////
function getLine(lineNum){
  return arr[lineNum].split(delimiter);
}


/*//////////////////////////////////
Read from file
//////////////////////////////////*/
function main(){
  fs.readFile('./spotprice-downloaded.sdv',function (err, data) {
    let obj = {};

    let str = data.toString();
    let res = str.replace(/,/g, '.');
    arr = res.split('\n');  

    //date part
    //create head-object
    //Funkis
    obj['Made'] = {};
    let items = getLine(dateValueLine);
    for(item in items) {
      obj.Made[createdHeader[item]] = items[item];
    }

    /*//////////////////////////////////
    price part
    create price-object
    adderar pristalen som array i objekt
    varför? -därför key varierar "Hour1, Hour2..."
    Funkis
    /////////////////////////////////*/
    obj['Price'] = [];

    items = getLine(se3ValueLine);
    i = 0;
    for (let col = priceColStart; col < priceColEnd; col++) {
      if(isNaN(items[col])) {
        //NOP
      } else if(items[col] === null) {
        //NOP
      } else {
        obj.Price[i] = parseFloat(items[col]).toFixed(2);
      }

      /* if(items[item] == "") {
        //dont add to obj
      } //else if(isNaN(items[item])) {
        obj.Price[priceHeader[item]] = items[item].toString();
      } else {
        obj.Price[priceHeader[item]] = parseFloat(items[item]);
      } */

      i++;
    }

    /*//////////////////////////////////
    meta part
    create meta-object
    funkis
    /////////////////////////////////*/
    obj['Meta'] = {};
    for (let item=0; item < 8; item++) {
      obj.Meta[priceHeader[item]] = items[item];
    }
    


    /*//////////////////////////////////
    medelvärde
    in: arr
    ut: avg
    funkis
    /////////////////////////////////*/
    function average(start, stop) {
      let mySum = 0;
      let count = 0;
      for(let i = start; i <= stop; i++) {
        if(isNaN(obj.Price[i])) {
          //NOP
        } else if(obj.Price[i] === null) {
          //NOP
        } else {
          mySum = mySum + parseFloat(obj.Price[i]);
          count++
        }
      } 
      avg = parseFloat(mySum / count).toFixed(2);
      return avg;
    }

   
    //stats part
    //create stats object
    //funkis
    obj['Stats'] = {};
    let sum = 0, count = 0, avg = 0, dif = 0;
    let hourPrice = [];
    let offPeak1 = [];
    let offPeak2 = [];
    let peak = [];
    let day = [];

    for(let i=priceColStart; i < priceColEnd; i++) {
      if (items[i] > 0) {
        hourPrice.push(parseFloat(items[i]));
      }
    }


    //calculate day, peakhour, offpeak1, offpeak2
    for(i=0; i<hourPrice.length; i++){
      if (i<7){    //korrekt 00-08
        offPeak1.push(parseFloat(hourPrice[i]));
      } else if (i > 18) { //korrekt 20-24
        offPeak2.push(parseFloat(hourPrice[i]));
      } else if (i>8 && i<20 ) { 
        day.push(parseFloat(hourPrice[i]));
      } else if (i>6 && i < 20) {  //korrekt
        peak.push(parseFloat(hourPrice[i]));
      }
    }

    //All hours are in CET/CEST
    //avg = sum / count;
    //avg = parseFloat(avg.toFixed(2));
    obj.Stats.Min = Math.min.apply(null, hourPrice);
    obj.Stats.Max = Math.max.apply(null, hourPrice);
    obj.Stats.Dif = obj.Stats.Max - obj.Stats.Min;
    obj.Stats.Avg = average(1, 23);
    obj.Stats.Peak = average(9, 20); //09-20
    obj.Stats.offPeak1 = average(0, 8); //00-08
    obj.Stats.offPeak2 = average(21, 24); //21-24
    

    
    //testa JSON parse
    //funkis
    let myJson = JSON.stringify(obj);
    let myObj = JSON.parse(myJson);


    //generera lite output
    //funkis
    console.log(`Day ahead prices tariff ${myObj.Made.DateMade}, ${myObj.Made.TimeMade}`);
    console.log(`(All hours are in CET/CEST)`);
    console.log(` Min: ${myObj.Stats.Min}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Max: ${myObj.Stats.Max}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Dif: ${myObj.Stats.Dif.toFixed(2)}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Avg day (01-24): ${myObj.Stats.Avg}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Peak Hours (09-20): ${obj.Stats.Peak}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Off-peak 1 (01-08): ${obj.Stats.offPeak1}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
    console.log(` Off-peak 2 (21-24): ${obj.Stats.offPeak2}${myObj.Meta.Currency} (${myObj.Meta.Area})`);
   

    if (err) {
      return console.log(err);
    }

  })
}