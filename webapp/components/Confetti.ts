// overly simple animation, won't scale but ok for this small project
// requires a div with styling in the root index.html file
export function throwConfetti() {
    const confettiColors = ["#ff0000", "#ffff00", "#00ff00"];
  
    let cont = document.querySelector("#confettiDiv");
    function spawnConfetti() {
      const cnfti = document.createElement("div");
      cnfti.textContent = "█";
      cnfti.classList.add("confetti");
      cnfti.style.color =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      cnfti.style.left = Math.random() * innerWidth + "px";
      cont?.appendChild(cnfti);
  
      setTimeout(() => {
        cnfti.remove();
      }, 5000);
    }
  
    for (let i = 0; i < 10; i++) {
      setTimeout(spawnConfetti, Math.random() * 1500);
    }
  }
  