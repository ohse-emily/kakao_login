function solution(nums){
    let newArr=[];
    nums.forEach((ele)=>{
        if(newArr.length<nums.length/2 && newArr.indexOf(ele)==false) newArr.push(ele);
    })
    return newArr.length;
}