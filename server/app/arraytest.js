
combine = (...xs) => {
    return param => xs.reduceRight(
        (result, x) => x(result), param
    )
}

f = (x) => (y) =>  x + y
g = (a) => (b) =>  a * b


const h = combine(f, g)

const test = (x) => (y) => y(x)
console.log(g(2)(3))
console.log(f(g(2)(3))(3))



console.log(test(2)(test)(f)(2))
console.log(test(2)(f)(2))


//test = (2) = (test) = (test) = (f) = (2)
//test(2)(f)(2)
//f(2)(2)


f = g => x => y => g(x)(y)


console.log(f(g)(2)(3))