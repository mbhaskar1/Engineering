url = "http://latex.codecogs.com/svg.latex? ";

LEFT = -1;
RIGHT = 1;

function update(){
    math.src = latexifyString(input.value);
}

function evaluateString(str){
    //Replace a^b with Math.pow(a, b)
    while(str.indexOf("^") != -1){
        res = latexReplaceOperator(str, "^")
        str = res[0].replace("^", "Math.pow(" + res[1] + "," + res[2] + ")")
    }
    //Replace typical math functions with appropriate js functions
    str = str.replace(/arcsin/g, "arcs");
    str = str.replace(/arccos/g, "arcc");
    str = str.replace(/arctan/g, "arct");
    str = str.replace(/sin/g, "Math.sin");
    str = str.replace(/cos/g, "Math.cos");
    str = str.replace(/tan/g, "Math.tan");
    str = str.replace(/arcs/g, "Math.asin");
    str = str.replace(/arcc/g, "Math.acos");
    str = str.replace(/arct/g, "Math.atan");
    str = str.replace(/log/g, "Math.log10");
    str = str.replace(/ln/g, "Math.log");
    //Replace typical math constants with their value
    str = str.replace(/pi/g, "Math.PI");
    str = str.replace(/e/g, "Math.E");
    evaluate.innerHTML = "Eval: " + str;
    try{
        return Math.round(eval(str)*Math.pow(10, 12))/Math.pow(10, 12);
    }catch(error){
        return "NaN";
    }
}

var delOuter = false;

function latexifyString(str){
    strLatex = str;

    //Temporarily replace pi with # to represent it as a number
    strLatex = strLatex.replace(/pi/g, "#")
    //Replace * with x
    strLatex = strLatex.replace(/\*/g, "\\times")
    //Replace / with fraction
    while(strLatex.indexOf("/") != -1){
        res = latexReplaceOperator(strLatex, "/");
        strLatex = res[0].replace("/", "\\frac{" + res[1] + "}{" + res[2] + "}")
    }
    //Replace ( and ) with appropriately sized brackets
    strLatex = strLatex.replace(/\(/g, "{\\left(");
    strLatex = strLatex.replace(/\)/g, "\\right)}");
    //Replace typical math functions with roman font versions of themselves
    strLatex = strLatex.replace(/arcsin/g, "arcs");
    strLatex = strLatex.replace(/arccos/g, "arcc");
    strLatex = strLatex.replace(/arctan/g, "arct");
    strLatex = strLatex.replace(/sin/g, "\\sin");
    strLatex = strLatex.replace(/cos/g, "\\cos");
    strLatex = strLatex.replace(/tan/g, "\\tan");
    strLatex = strLatex.replace(/arcs/g, "\\arcsin");
    strLatex = strLatex.replace(/arcc/g, "\\arccos");
    strLatex = strLatex.replace(/arct/g, "\\arctan");
    strLatex = strLatex.replace(/log/g, "\\log");
    strLatex = strLatex.replace(/ln/g, "\\ln");
    //Replace pi with appropriate symbol
    strLatex = strLatex.replace(/#/g, "\\pi");
    latex.innerHTML = "Latex: " + strLatex;
    return url + strLatex + " = " + evaluateString(str);
}

function latexReplaceOperator(str, operator){
    index = str.indexOf(operator);
    left = parameter(str, index, LEFT);
    if(delOuter){
        str = removeChar(str, index - 1);
        index--;
    }
    for(var i = 0; i < left.length; i++){
        str = removeChar(str, index - 1);
        index--;
    }
    if(delOuter){
        str = removeChar(str, index - 1);
        index--;
    }
    right = parameter(str, index, RIGHT);
    if(delOuter){
        str = removeChar(str, index + 1);
    }
    for(var i = 0; i < right.length; i++){
        str = removeChar(str, index + 1);
    }
    if(delOuter){
        str = removeChar(str, index + 1);
    }
    return [str, left, right];
}

var skipOver = ['^', '#', 'e', '!']
function parameter(str, indexStart, dir){
    var complete = false;
    var index = indexStart;
    var parentheses = 0;
    while(!complete){
        index = indexOfFirstNaN(str, index, dir);
        if(skipOver.includes(str.charAt(index))){
            //Move On
        }else if(str.charAt(index) == (dir == RIGHT ? '(' : ')')){
            parentheses++;
        }else if(str.charAt(index) == (dir == RIGHT ? ')' : '(')){
            if(parentheses <= 1){
                complete = true;
            }else{
                parentheses--;
            }
        }else if(parentheses == 0){
            complete = true;
        }
        if(index == -1 || index == str.length){
            complete = true;
        }
    }
    if(parentheses == 1){
        delOuter = true;
        return dir == RIGHT ? str.substring(indexStart + 2, index) : str.substring(index + 1, indexStart - 1)
    }else{
        delOuter = false;
        return dir == RIGHT ? (index == str.length ? str.substring(indexStart + 1) : str.substring(indexStart + 1, index)) : str.substring(index + 1, indexStart);
    }
}

function indexOfFirstNaN(str, indexStart, dir){
    for(var i = indexStart + dir; (dir == RIGHT) ? (i < str.length) : (i >= 0); i += dir){
        if(isNaN(parseInt(str.charAt(i, 10)))){
            return i;
        }
    }
    return (dir == RIGHT) ? str.length : -1;
}

function removeChar(str, index){
    return str.slice(0, index) + str.slice(index + 1);
}