function getTVPOutliers(mydata) {
  let highVariance = [[0, {}], [0, {}], [0, {}], [0, {}], [0, {}]];
  let lowVariance = [[1000, {}], [1000, {}], [1000, {}], [1000, {}], [1000, {}]];
  for(let groupType in mydata){ //groupType shuffles through and stores the overall catagory
    for(let group in mydata[groupType]){ //group shuffles through and stores the specific group from within grouptType
      for(let subCategory in mydata[groupType][group]){ //subCatagory shuffles through and stores the specfic results each group has
        value = parseFloat(mydata[groupType][group][subCategory]);
        for(let comparisonGroup in mydata[groupType]){//this compares the current group with the other gruops subcategory results
          if(group !== comparisonGroup && !array_value_check(highVariance, subCategory, group, comparisonGroup) && !array_value_check(lowVariance, subCategory, group, comparisonGroup)){
            value2 = parseFloat(mydata[groupType][comparisonGroup][subCategory]);
            difference = Math.abs(value - value2).toFixed(4);
            if(array_difference_check(highVariance, difference, true)){
              position = array_difference_locator(highVariance, difference, true);
              let updatedDataStorage = {"groupType": groupType, "subCategory": subCategory, [group]: value, [comparisonGroup]: value2, allOtherGroups: {}};
              for(let findAllGroups in mydata[groupType]){
                if(findAllGroups !== group && findAllGroups !== comparisonGroup){
                  updatedDataStorage.allOtherGroups[findAllGroups] = mydata[groupType][findAllGroups][subCategory];
                }
              }
              highVariance = array_value_insertion_handler(highVariance, subCategory, groupType, position, difference, updatedDataStorage, true);
            }
            if(array_difference_check(lowVariance, difference, false)){
              position = array_difference_locator(lowVariance, difference, false);
              let updatedDataStorage = {"groupType": groupType, "subCategory": subCategory, [group]: value, [comparisonGroup]: value2, allOtherGroups: {}};
                for(let findAllGroups in mydata[groupType]){
                  if(findAllGroups !== group && findAllGroups !== comparisonGroup){
                    updatedDataStorage.allOtherGroups[findAllGroups] = mydata[groupType][findAllGroups][subCategory];
                  }
                }
              lowVariance = array_value_insertion_handler(lowVariance, subCategory, groupType, position, difference, updatedDataStorage, false);
            }
          }
        }
      }
    }
  }
  let obj = {highVariance, lowVariance};
  return obj;
}

function array_difference_check(array, value, high) {
  //this function checks if the value is higher or lower than other values in the array the high variable is true for greater than and false for less than
  if (high) {
    for (let i = 0; i < array.length; i++) {
      if (parseFloat(array[i][0]) < value) {
        return true;
      }
    }
  } else {
    for (let i = 0; i < array.length; i++) {
      if (parseFloat(array[i][0]) > value) {
        return true;
      }
    }
  }
  return false;
}

/*function array_value_mover(array, value, obj, position) {
  //This shifts the elements of an array from the given position down dropping the last element
  let tempNumber = array[position][0];
  let tempObj = array[position][1];
  array[position][0] = value;
  array[position][1] = obj;
  position++;
  if(position < array.length){
    for (position; position < array.length; position++) {
      let tempNumber2 = array[position][0];
      let tempObj2 = array[position][1];
      array[position][0] = tempNumber;
      array[position][1] = tempObj;
      tempNumber = tempNumber2;
      tempObj = tempObj2
    }
  }
  return array;
}*/

function array_difference_locator(array, value, high) {
  //This finds where the new different value belongs in the array
  for (let i = 0; i < array.length; i++) {
    if (high) {
      if (parseFloat(array[i][0]) < value) {
        return parseInt(i);
      }
    } else {
      if (parseFloat(array[i][0]) > value) {
        return parseInt(i);
      }
    }
  }
  return -1;
}

function array_value_check(array, subCategory, group1, group2) {
  //This finds if 2 values are in the object
  for (let i = 0; i < array.length; i++) {
    if("subCategory" in array[i][1]){
      if (subCategory.toString() === array[i][1].subCategory.toString()) {
        if(group1 in array[i][1] && group2 in array[i][1]){
          return true;
        }
      }
    }
  }
  return false;
}


function array_value_insertion_handler(array, subCategory, groupType, position, difference, obj, sortSelecter) {
  //This checks if there is a repeat catagory group and handles all cases of value insertion into the array
  for (let i = 0; i < array.length; i++) {
    if("subCategory" in array[i][1]){
      if (subCategory.toString() === array[i][1].subCategory.toString() && array[i][1].groupType.toString() === groupType.toString()) {
        if(position <= i){
          array[i][0] = difference;
          array[i][1] = obj;
          if(sortSelecter){
            array.sort(sortFunctionHigher);
          }else{
            array.sort(sortFunctionLower);
          }
          return array;
        }else{
          return array;
        }
      }
    }
  }
  //this only runs if the inserting value is a unique group or subcategory
  array[array.length - 1][0] = difference;
  array[array.length - 1][1] = obj;
  if(sortSelecter){
    array.sort(sortFunctionHigher);
  }else{
    array.sort(sortFunctionLower);
  }
  return array;
}
//sorts by high to low
function sortFunctionHigher(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}
//sorts by low to high
function sortFunctionLower(a, b) {
  if (a[0] === b[0]) {
      return 0;
  }
  else {
      return (a[0] < b[0]) ? -1 : 1;
  }
}
