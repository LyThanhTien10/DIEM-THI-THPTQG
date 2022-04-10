const modules = require('./modules');
const axios = require('axios').default;
const fs = require('fs');

const createBatch = function (array, size) {
    var results = [];
    while (array.length) {
        const batch = array.splice(0,size).map((ID)=>{
            return [modules.getData, ID];
        });
        results.push(batch);
    }
    return results;
};

async function getAllData(batches){
    var database = [];
    for(const batch of batches){
        try{
            await Promise.all(batch.map(async(item)=>{
                const ID = item[1];
                const getDataFunc = item[0];
                const result = await getDataFunc(ID)
                    .then((result)=>{
                        if (result != false){
                            return result;
                        }
                    }); 
                if (result != null){
                    database.push(result);
                }
            }));
        }
        catch (err){
            console.log(err);
        }
    }
    return database;
};

function saveData(data, fileName){
    fs.writeFile(`${__dirname}/${fileName}.json`, JSON.stringify(data, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        console.log("File has been created");
    });
}

async function main(){
    /* Create cityID array */
    var cityIdArr = Array.from({length:64},(_,index) => index + 1);
    var fileName = "ĐIỂM THI THPTQG 2021";

    /* Array of number student of each city */
    capacityArr = await modules.findCapacityOfAllCity(cityIdArr);

    /* Join all studentID from all city to 1 array */
    var idArr = [];
    for (let i=0;i<capacityArr.length;i++){
        idArr = idArr.concat(Array.from({length: capacityArr[i]%1000000}, (_,index)=> modules.createStudentID((i+1)*1000000 + index + 1)));
    }

    /* Create batches of StudentID with size 1000 element each batch */
    const batches = createBatch(idArr,1000);

    /* Get mark of all student and write to file */
    const database = await getAllData(batches);
    console.log(database);
    saveData(database, fileName);
};

main();