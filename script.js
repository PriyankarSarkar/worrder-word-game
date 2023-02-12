import { dictionary, answer_words } from './database.js';

const outmost_element = document.querySelector(".main");
const keys = document.querySelectorAll(".each_key");
const cells = document.querySelectorAll(".each_cell");
const enter = document.querySelector(".enter");
const delete_key = document.querySelector(".delete");
const custom_alert = document.querySelector(".alert");
const alpha_keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
let Obj = {col:0, row_start:0, curr_word:""};
let stop_interaction = false;

// picks target word
let answer = answer_words[Math.floor(Math.random()*answer_words.length)];

// value of clicked key goes to grid-cell
keys.forEach((key) => {
  key.addEventListener("click", () => {
    put_value_in_cell(key.innerText, Obj.col);
  });
});

enter.addEventListener("click", () =>main());

delete_key.addEventListener("click", ()=>{ 
    if(stop_interaction == false) delete_function();
});

// mapping keyboard keys
window.addEventListener("keydown", (event)=>{

    if(event.key === "Enter") main();
    else if((event.key === "Backspace" || event.key === "Delete") && stop_interaction == false) delete_function();
    else if(alpha_keys.includes(event.key.toUpperCase()))
      put_value_in_cell(event.key);
})

// functions
async function main(){

    if(stop_interaction == false)
    {
        if(Obj.curr_word.toLowerCase() == answer)
        {
            await flip_row(answer, Obj.curr_word);
            make_wave_animation(Obj.row_start);
            stop_interaction = true;
        }
        else if(Obj.curr_word.length == 5 && dictionary.includes(Obj.curr_word.toLowerCase()) == true) // wrong word
        {
            await flip_row(answer, Obj.curr_word);
            Obj.row_start = Obj.col;
            Obj.curr_word = "";

            if(Obj.row_start == 30)
            {
                stop_interaction = true;
                call_alert(answer);
            }
        }
        else await shake_func(Obj.row_start, Obj.curr_word);
    }
}

function put_value_in_cell(val) {
    if ((Obj.col == Obj.row_start && Obj.row_start < 30) || Obj.col % 5 != 0) {
        cells[Obj.col].innerHTML = `<div class="cell_val">` + val + `</div>`;
        cells[Obj.col].style.outline = "1px solid white";
        Obj.curr_word += val;
        Obj.col = Obj.col+1;
    }
}

function delete_function(){

    Obj.curr_word = Obj.curr_word.substring(0, Obj.curr_word.length-1);
    if(Obj.col == Obj.row_start) return;
    cells[Obj.col-1].innerHTML = ``;
    cells[Obj.col-1].style.outline = "2px solid rgba(128, 128, 128, 0.361)";
    Obj.col = Obj.col - 1;
}

async function make_wave_animation(){

    for(let i=0; i<5; i++)
    {
        await sleep(80);
        cells[Obj.row_start+i].classList.add("wave");
    }

    await sleep(1000);
    call_alert("Genius");
}

function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

async function shake_func(){

    for(let i=0;i<5;i++)
        cells[Obj.row_start+i].classList.remove("vibrate");
    await sleep(100);

    for(let i=0;i<5;i++)
        cells[Obj.row_start+i].classList.add("vibrate");

    if(Obj.curr_word.length == 5) call_alert("Not in word list");
    else call_alert("Not enough letters");
}

async function flip_row(target, current){
    
    for(let i=0; i<5; i++)
    {
        cells[Obj.row_start+i].classList.add("flip");
        await sleep(500);

        if(current.charAt(i).toLowerCase() == target.charAt(i).toLowerCase())
            cells[Obj.row_start+i].style.backgroundColor = "#538d4e";

        else if(target.includes(""+current.charAt(i).toLowerCase()))
            cells[Obj.row_start+i].style.backgroundColor = "#b59f3b";

        else
            cells[Obj.row_start+i].style.backgroundColor = "#3a3a3c";

        cells[Obj.row_start+i].style.outline = "none";
        cells[Obj.row_start+i].style.transform = "rotateX(0deg)";
    }
}

function call_alert(string){
    custom_alert.innerText = string;
    custom_alert.style.display = "flex";

    if(answer == string || string == "Genius")
        custom_alert.style.animation = "none";

    else setTimeout(()=>custom_alert.style.display = "none", 900);
}