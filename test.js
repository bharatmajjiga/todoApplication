const limit = 2000000;
let sum = 0;
for (let i = 1; i <= limit; i++) {
    c = 0;
    for (let j = 1; j <= i; j++) {
        // % modules will give the reminder value, so if the reminder is 0 then it is divisible
        if (i % j == 0) {
            //increment the value of c
            c++;
        }
    }

    //if the value of c is 2 then it is a prime number
    //because a prime number should be exactly divisible by 2 times only (itself and 1)
    if (c == 2) {
        sum += i;
        console.log(sum);
    }
}
console.log(sum);