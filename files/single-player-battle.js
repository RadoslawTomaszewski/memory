const win = new Audio("audio/win_battle.mp3");
const lose = new Audio("audio/lose_battle.mp3");
const backgroundMusic = new Audio('audio/background.mp3');

let cards = ["1b.png", "1b.png", "2b.png", "2b.png", "3b.png", "3b.png", "4b.png", "4b.png", "5b.png", 
			"5b.png", "6b.png", "6b.png", "7b.png", "7b.png", "8b.png", "8b.png"];
let c_ = new Array(16);

for(i=0; i<cards.length; i++)
{
	c_[i] = document.getElementById("c" + i);
}

c_[0].addEventListener("click", function() {revealCard(0);});
c_[1].addEventListener("click", function() {revealCard(1);}); 
c_[2].addEventListener("click", function() {revealCard(2);}); 
c_[3].addEventListener("click", function() {revealCard(3);}); 

c_[4].addEventListener("click", function() {revealCard(4);}); 
c_[5].addEventListener("click", function() {revealCard(5);}); 
c_[6].addEventListener("click", function() {revealCard(6);}); 
c_[7].addEventListener("click", function() {revealCard(7);}); 

c_[8].addEventListener("click", function() {revealCard(8);}); 
c_[9].addEventListener("click", function() {revealCard(9);}); 
c_[10].addEventListener("click", function() {revealCard(10);}); 
c_[11].addEventListener("click", function() {revealCard(11);}); 

c_[12].addEventListener("click", function() {revealCard(12);}); 
c_[13].addEventListener("click", function() {revealCard(13);}); 
c_[14].addEventListener("click", function() {revealCard(14);}); 
c_[15].addEventListener("click", function() {revealCard(15);}); 

shuffle(cards);
function shuffle(array) {
	let currentIndex = array.length
	let randomIndex;

  	while (currentIndex != 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];

	}
  }

let oneVisible = false;		//zmienna: bool		pozwala ustalic, czy jedna karta juz zostala odslonieta
let turnCounter = 0;		//zmienna: liczba	zlicza liczbe wykonanych tur
let visibleNr;				//zmienna: liczba	przechowuje numer odslonietej na poczatku tury karty 
let lock = false;			//zmienna: bool		zabezpieczenie zapobiegajace odslonieciu wiecej niz dwoch kart
let pairsLeft = 8;			//zmienna: liczba	przechowje liczbe pozostalych na planszy par
let card;					//zmienna: obiekt	przechowuje element karty (getElementById)
let opacityValue;			//zmienna: obiekt	przechowuje wartosc css opacity dla danego elementu karty (jesli wartosc wynosi 0, to karta zniknela z planszy)


//funkcja odslaniajaca karte
function revealCard(nr) {
	backgroundMusic.play();
	card = document.getElementById("c" + nr);
	opacityValue = window.getComputedStyle(card).getPropertyValue('opacity');

	if(opacityValue !=0 && lock == false){
		lock = true;
		card.style.backgroundImage = "url(img/" + cards[nr] + ")";
		if(nr!=visibleNr) card.classList.toggle('cardA');

		//Pierwsza karta w turze
		if(oneVisible == false){
			oneVisible = true;
			visibleNr = nr;
			lock = false;
			return;
		}

		//Druga karta w turze
		if(nr != visibleNr){
			//identyczne karty w parze
			if(cards[nr] == cards[visibleNr]) setTimeout(function() { hide2Cards(nr, visibleNr)}, 750); 
			//rozne kary w parze
			else setTimeout(function() { restore2Cards(nr, visibleNr)}, 1000);
	
			turnCounter++;
			oneVisible = false;
			document.querySelector('.score').innerHTML = 'Turn counter: ' + turnCounter;
			return;
		}
		lock = false;
	}
}

//funkcja zaslaniajaca dwie karty wybrane w turze
function restore2Cards(nr1, nr2) {

	let card1 = document.querySelector('#c' + nr1);
	card1.style.backgroundImage = 'url(img/backgroundb.png)';
	card1.classList.add('card');
	card1.classList.remove('cardA');
  
	let card2 = document.querySelector('#c' + nr2);
	card2.style.backgroundImage = 'url(img/backgroundb.png)';
	card2.classList.add('card');
	card2.classList.remove('cardA');

	lock = false;
}

//funkcja usuwajaca z planszy pare identycznych kart
function hide2Cards(nr1, nr2){

	document.querySelector('#c' + nr1).style.opacity = '0';
	document.querySelector('#c' + nr2).style.opacity = '0';

	pairsLeft--;

	if(pairsLeft==0){

		if(turnCounter<20) {
			document.querySelector('.board').innerHTML = '<img src="img/winb.gif"/><h1>You win!<br/>Done in ' + turnCounter + ' turns!';
			win.play();
			return;
		}

		document.querySelector('.board').innerHTML = '<img src="img/loseb.gif"/><h1>Boomer!<br/>Done in ' + turnCounter+ ' turns!';
		lose.play();
	}

	lock = false;
}