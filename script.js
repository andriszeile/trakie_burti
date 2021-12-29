const msg = document.querySelector('.main');
const btn = document.querySelector('.btn');
const answer = document.querySelector('input');
const score = document.querySelector('.score');
let play = false;
let words = ['ābols','bumbieris','banāns','ķirsis'];
let newwords = "";
let ranwords = "";
let s = 0;

function sakt_speli() {
    let vards = document.querySelector("#vards").value
    let vecums = document.querySelector("#vecums").value
    let regions = document.querySelector("#regions").value


    console.log(regions)
    if(vards == "")
    {
        alert("Ievadi vārdu!")
    }
    else
    {
        window.location="spele.html#"+vards+","+vecums+","+regions
    }
}//beidzas skat_speli()

let adrese = window.location.hash;
adrese = decodeURI(adrese);
adrese = adrese.replace('#','');
adrese = adrese.split(",");
vards  = adrese[0]
document.querySelector('.virsraksts').innerHTML = 'Spēlē: '+vards;

let vecums  = adrese[1]
let regions = adrese[2]



const createNewwords = () =>{
	let random = Math.floor(Math.random()*words.length);
	let newword = words[random];
	return newword;
}
const scrambleword = (arr) =>{
	for(i=words.length-1; i>=0;i--){
		let temp  = arr[i];
		let j = Math.floor(Math.random()*(i+1));
		arr[i] = arr[j];
		arr[j] = temp;
	}
	return arr;
}
score.innerHTML = `Score : ${s}`;
btn.addEventListener("click",function(){
score.style.display = "block";
	if (!play) {
		play = true;
		btn.innerHTML = "Atbildēt";
		answer.style.display = "block";
		newwords = createNewwords();
		ranwords = scrambleword(newwords.split("")).join("");
		// console.log(ranwords);
		msg.innerHTML = `Izveido vārdu no: ${ranwords}`;
	}else{
		let tword = answer.value.toLowerCase();
		if (newwords == tword) {
			play = false;
			msg.innerHTML = `Pareizi: ${newwords}`;
			s++;
			answer.value = "";
			score.innerHTML = `Punkti: ${s}`;;
			answer.style.display = "none";
			btn.innerHTML = "Nākošais";
		}else{
			answer.value = "";
			msg.innerHTML = `Nepareizi, atkārto ${ranwords}`;
			s--;
			score.innerHTML = `Punkti: ${s}`;;
			
		}
	}

});
