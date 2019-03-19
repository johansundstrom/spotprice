var results = [
    ["Luke May", 43, "male", "married"],
    ["Sarah Saw", 54, "female", "single"],
    ["Magac gose", 51, "male", "single"]
  ];
  var keys = ["name", "age", "gender", "status"];
  
  var objectArray = []; // your result
  
  results.forEach(r => {
    let obj = {};
    r.forEach((r, i) => {
  obj[keys[i]] = r;
    });
    objectArray.push(obj);
  });
  
  console.log(objectArray);