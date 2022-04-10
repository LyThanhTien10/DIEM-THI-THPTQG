const axios = require('axios').default;

var obj = {

    /* Function to create CityID like 01,02,03,04,...,64,65 */
    createCityID: function(index){
        var cityID = new Array(3 - index.toString().length).join("0").toString() + index.toString();
        return cityID;
    },
    
    /* Function to create StudentID like 01xxxxxx, 02xxxxxx, ..., 65xxxxxx */
    createStudentID: function(index){
        var ID = new Array(9 - index.toString().length).join("0").toString() + index.toString();
        return ID;
    },

    /* Function to get Student Mark with StudentID as parameter */
    getData: async function(ID){
        var result;
        console.log(`Fetch: https://d3ewbr0j99hudd.cloudfront.net/search-exam-result/2021/result/${ID}.json`);
        await axios.get(`https://d3ewbr0j99hudd.cloudfront.net/search-exam-result/2021/result/${ID}.json`)
            .then((res)=>{
                result = res.data;
            })
            .catch((err)=>{
                result = false;
            });
        return result;
    },

    /* Function to find the biggest StudentID which data from function getData is valid  */
    findMaxStudentOfCity: async function(min, max){
        if ((min-max)**2 == 1){
            return min;
        } 
        let mid = parseInt((max+min)/2);

        var ID1 = obj.createStudentID(mid);
        var ID2 = obj.createStudentID(mid+1);

        var result1 = await obj.getData(ID1).then((result) =>{return result});
        var result2 = await obj.getData(ID2).then((result) =>{return result});
    
        if(result1 == false && result2 == false){
            max = mid;
            return await obj.findMaxStudentOfCity(min,max).then(result =>{return result});
        }else{
            min = mid;
            return await obj.findMaxStudentOfCity(min,max).then(result =>{return result});
        }
    },

    /* Function to find and return an array of number studentID of each city */
    findCapacityOfAllCity: async function(arr){
        const requests = arr.map((item)=>{
            let min = item*1000000 + 0;
            let max = item*1000000 + 999999;
            return obj.findMaxStudentOfCity(min,max).then(result =>{return result});
        });
        return Promise.all(requests);
    }
}

module.exports = obj;