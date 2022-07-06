const fs = require('fs');
var data = JSON.parse(fs.readFileSync("MyData.json"));

get_outliers(data);

function get_outliers(mydata){//returns an object containing arrays of the sorted data and top and bottom difference outliers
let high_scores_upper = [0, 0, 0, 0, 0, 0]; //stores the larger number of the larger difference
let high_scores_lower = [0, 0, 0, 0, 0, 0]; //stores the smaller number of the larger difference
let high_scores_names = ["", "", "", "", "", ""]; //stores the combined formatted names of the high_scores
let low_scores_lower = [1000, 1000, 1000, 1000, 1000, 1000]; //stores the smaller number of the smaller difference
let low_scores_upper = [1000, 1000, 1000, 1000, 1000, 1000]; //stores the larger number of the smaller difference
let low_scores_names = ["", "", "", "", "", ""];//stores the combined formatted names of the smaller scores
let difference_high = [0, 0, 0, 0, 0, 0]; //the 6 largest differences in the data
let difference_low = [1000, 1000, 1000, 1000, 1000, 1000]; //the 6 smallest differences in the data
  for (let key4 in mydata) { //these for loops unwrap the JSON
    for (let key3 in mydata[key4]) {
      for (let key2 in mydata[key4][key3]) {
        for (let key in mydata[key4][key3][key2]) {//key is the lowest level so mydata[key4][key3][key2][key] retrieves the data
          for (let keycheck2 in mydata[key4][key3]) { //keycheck2 allows for checking the subcatagories of key3 so k3 is color and key2 and keycheck2 are red and green
            for (let keycheck in mydata[key4][key3][keycheck2]) {//keycheck is the lower level of all the checks ie color: green: shade <-
              if(keycheck !== "count" && keycheck === key && keycheck2 !== key2 && mydata[key4][key3][keycheck2][keycheck] !== null && mydata[key4][key3][key2][key]){ //makes sure data is checking correct categories
                let difference = 0;
                if(mydata[key4][key3][keycheck2][keycheck] > mydata[key4][key3][key2][key]){
                  difference = mydata[key4][key3][keycheck2][keycheck] - mydata[key4][key3][key2][key];
                }else{
                  difference = mydata[key4][key3][key2][key] - mydata[key4][key3][keycheck2][keycheck];
                }
                if(!array_value_check(high_scores_names, key3 + ": " + keycheck2 + ": " + keycheck + " > " + key2 + ": " + key) && !array_value_check(high_scores_names, key3 + ": " + key2 + ": " + key + " > " + keycheck2 + ": " + keycheck)){ //checks if we already found this data and stored it
                  if(array_difference_check(difference_high, difference, true)){ //checks if this is a new high score
                    let position = array_difference_locator(difference_high, difference, true); //finds the spot to put the new data in
                    if(position >= 0){//this if section updates all the arrays to the new sorted scores
                      difference_high = array_value_mover(difference_high, difference, position);
                      if(mydata[key4][key3][keycheck2][keycheck] > mydata[key4][key3][key2][key]){//formatting which number is bigger
                        high_scores_names = array_value_mover(high_scores_names, key3 + ": " + keycheck2 + ": " + keycheck + " > " + key2 + ": " + key, position);
                        high_scores_upper = array_value_mover(high_scores_upper, mydata[key4][key3][keycheck2][keycheck], position);
                        high_scores_lower = array_value_mover(high_scores_lower, mydata[key4][key3][key2][key], position);
                      }else{
                        high_scores_names = array_value_mover(high_scores_names, key3 + ": " + key2 + ": " + key + " > " + keycheck2 + ": " + keycheck, position);
                        high_scores_upper = array_value_mover(high_scores_upper, mydata[key4][key3][key2][key], position);
                        high_scores_lower = array_value_mover(high_scores_lower, mydata[key4][key3][keycheck2][keycheck], position);
                      }
                    }
                  }
                }
                if(!array_value_check(low_scores_names, key3 + ": " + keycheck2 + ": " + keycheck + " > " + key2 + ": " + key) && !array_value_check(low_scores_names, key3 + ": " + key2 + ": " + key + " > " + keycheck2 + ": " + keycheck)){ //same operations as the high scores but for low differences
                   if(array_difference_check(difference_low, difference, false)){//checks if this is a new low score
                     let position = array_difference_locator(difference_low, difference, false);
                     if(position >= 0){//this if section updates all the arrays to the new sorted scores
                       difference_low = array_value_mover(difference_low, difference, position);
                       if(mydata[key4][key3][keycheck2][keycheck] > mydata[key4][key3][key2][key]){//formatting which number is bigger
                         low_scores_names = array_value_mover(low_scores_names, key3 + ": " + keycheck2 + ": " + keycheck + " > " + key2 + ": " + key, position);
                         low_scores_upper = array_value_mover(low_scores_upper, mydata[key4][key3][keycheck2][keycheck], position);
                         low_scores_lower = array_value_mover(low_scores_lower, mydata[key4][key3][key2][key], position);
                       }else{
                         low_scores_names = array_value_mover(low_scores_names, key3 + ": " + key2 + ": " + key + " > " + keycheck2 + ": " + keycheck, position);
                         low_scores_upper = array_value_mover(low_scores_upper, mydata[key4][key3][key2][key], position);
                         low_scores_lower = array_value_mover(low_scores_lower, mydata[key4][key3][keycheck2][keycheck], position);
                       }
                     }
                   }
                }
              }
            }
          }
        }
      }
    }
  }
  //elements of the object should be accessible through obj[difference_high[1]]; etc
  let obj = {difference_high, high_scores_upper, high_scores_names, high_scores_lower, difference_low, low_scores_upper, low_scores_names, low_scores_lower};

  /*for(let i = 0; i < high_scores_upper.length; i++){
    console.log(difference_high[i] + " " + high_scores_upper[i] + " " + high_scores_names[i] + " " + high_scores_lower[i]);
  }
  for(let i = 0; i < low_scores_upper.length; i++){
    console.log(difference_low[i] + " " + low_scores_upper[i] + " " + low_scores_names[i] + " " + low_scores_lower[i]);
  }//These for loops are for checking data*/
  
  return obj;
}

function array_difference_check(array, value, high){ //this function checks if the value is higher or lower than other values in the array the high variable is true for greater than and false for less than
  if(high){
    for(let key in array){
      if (array[key] < value){
        return true;
      }
    }
  }else{
    for(let key in array){
      if (array[key] > value){
        return true;
      }
    }
  }
  return false
}

function array_value_mover(array, value, position){ //This shifts the elements of an array from the given position down dropping the last element
  let temp = array[position];
  array[position] = value;
  position++;
  for(position; position < array.lenth; position++){
    let temp2 = array[position];
    array[position] = temp;
    temp = temp2;
  }
  return array;
}

function array_difference_locator(array, value, high){//This finds where the new different value belongs in the array
  let temp = 0;
  for(let key in array){
    if(high){
      if (array[key] < value){
        return parseInt(key);
      }
    }else{
      if (array[key] > value){
        return parseInt(key);
      }
    }
  }
  return -1;
}

function array_value_check(array, value){//This checks if a given value is in an array
  for(let key in array){
    if (array[key] === value){
      return true;
    }
  }
  return false;
}

function retrieve_catagories(mydata){//recursive function to run through JSON data if needed
  for (var key in mydata) {
    if(typeof mydata[key] == 'object'){
      retrieve_catagories(mydata[key]);
    }else if(!isNaN(mydata[key])){
      console.log("Key: " + key);
      console.log("Value: " + mydata[key]);
    }
  }
}
