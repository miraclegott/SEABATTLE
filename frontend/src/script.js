const app = new Application({
	preparation: PreparationScene,
	computer: ComputerScene,
	online: OnlineScene,
});

function toggleTheme() {
	const body = document.body;
  
	if (body.classList.contains("light-theme")) {
	  body.classList.remove("light-theme");
	  body.classList.add("dark-theme");
	} else {
	  body.classList.remove("dark-theme");
	  body.classList.add("light-theme");
	}
  }
  
app.start("preparation");

// document.querySelector('[data-action="randomize"]').click();
// document.querySelector('[data-type="random"]').disable = false;
// document.querySelector('[data-type="random"]').click();
// document.querySelector('[data-computer="hard"]').disabled = false;
// document.querySelector('[data-computer="hard"]').click();

// for (let y = 0; y < 10; y++) {
// 	for (let x = 0; x < 10; x++) {
// 		const shot = new ShotView(x, y);
// 		app.opponent.addShot(shot);
// 	}
// }
