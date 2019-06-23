var funcs = [f1, f2, f3, f4, f5, f6, f7, f8, f9, f10];

function extendTable(N){
    tbl = document.getElementById("data");
    for(var i = 1; i <= N; i++){
        tr = document.createElement("tr");
        td = document.createElement("td");
        td.innerHTML = "" + i;
        tr.appendChild(td);
        for(var j = 0; j < 10; j++){
            td = document.createElement("td");
            td.innerHTML = "" + funcs[j](i);
            tr.appendChild(td);
        }
        tbl.appendChild(tr);
    }
}

function f1(n){
    return Math.pow(n, 2);
}

function f2(n){
    return Math.pow(n, 3);
}

function f3(n){
    return Math.pow(n, n);
}

function f4(n){
    return (1/n).toFixed(3);
}

function f5(n){
    return Math.exp(n).toFixed(3);
}

function f6(n){
    return Math.log(n).toFixed(3);
}

function f7(n){
    return Math.sin(n).toFixed(3);
}

function f8(n){
    var ans = 1;
    while(n > 1){
        ans *= n;
        n--;
    }
    return ans;
}

function f9(n){
    if(n > 2){
        return f9(n-1) + f9(n-2);
    }else{
        return 1;
    }
}

function f10(n){
    var ans = n;
    var primes = primeDivisors(n);
    for(let val of primes){
        ans *= (1 - 1/val);
    }
    return Math.round(ans);
}

function primeDivisors(n, original = true){
    var s = new Set();
    for(var i = 2; i <= Math.sqrt(n); i++){
        if(n % i == 0){
            s.add(i);
            s.add(n/i);
            break;
        }
    }
    s_add = new Set();
    for(let val of s){
        s1 = primeDivisors(val, false);
        if(s1.size > 0){
            s.delete(val);
            s1.forEach(s_add.add, s_add);
        }
    }

    s_add.forEach(s.add, s);
    if(s.size == 0 && original == true){
      s.add(n);
    }
    return s;
}