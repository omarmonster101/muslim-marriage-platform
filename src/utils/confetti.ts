import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  // Fire dual festive bursts
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6, x: 0.3 },
    colors: ['#000000', '#f8c4ff', '#85dadc', '#d9c58b', '#ffffff'],
    ticks: 200,
    gravity: 1.1,
    scalar: 1.2
  });

  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6, x: 0.7 },
    colors: ['#000000', '#f8c4ff', '#96c4ff', '#d9c58b', '#31c431'],
    ticks: 200,
    gravity: 1.1,
    scalar: 1.2
  });
}

export function fireKhitbahBlessingConfetti() {
  confetti({
    particleCount: 120,
    spread: 100,
    origin: { y: 0.5 },
    colors: ['#31c431', '#d9c58b', '#000000', '#f8c4ff'],
    ticks: 250,
  });
}
