gsap.registerPlugin(ScrollTrigger);

const container = document.getElementById('star-container');
const starCount = 150;
const stars = []; // Store star references for convergence animation

// Color palette for stars (white, cream, soft blue)
const starColors = ['#FFFFFF', '#FFFCE1', '#E0F2FE'];

// 1. Generate Stars with Depth
for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Assign a random speed/depth (0.1 to 1.5)
    // Larger stars will move faster, creating a 3D effect
    const depth = Math.random() * 1.5 + 0.2;
    const size = depth * 2; // Size is tied to depth
    
    // Random color from palette
    const color = starColors[Math.floor(Math.random() * starColors.length)];
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.background = color;
    
    container.appendChild(star);
    stars.push({ element: star, initialX: star.offsetLeft, initialY: star.offsetTop });

    // Star Twinkle Animation
    gsap.to(star, {
        opacity: Math.random() * 0.7 + 0.2,
        duration: Math.random() * 3 + 1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Star Drift (Parallax) Effect
    // This moves the star vertically based on scroll position
    gsap.to(star, {
        y: depth * -500, // Move up by a factor of its depth
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 1 // This "scrub" makes the movement follow the scrollbar
        }
    });
}

// 2. Poem Reveal Logic (Same as before, but smoother)
const stanzas = document.querySelectorAll('.stanza');

stanzas.forEach((stanza) => {
    gsap.to(stanza, {
        scrollTrigger: {
            trigger: stanza,
            start: "top 85%", 
            end: "top 15%",
            toggleActions: "play reverse play reverse",
        },
        opacity: 1,
        y: 0,
        duration: 2,
        ease: "power3.out"
    });
});

// 3. Convergence Animation on Final Section
const finalSection = document.getElementById('final-section');
if (finalSection) {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    gsap.to(stars, {
        scrollTrigger: {
            trigger: finalSection,
            start: "top center",
            end: "bottom center",
            scrub: 2
        },
        x: function() {
            // Converge each star toward center
            return centerX - this.targets()[0].offsetLeft;
        },
        y: function() {
            // Converge each star toward center
            return centerY - this.targets()[0].offsetTop;
        },
        duration: 3,
        stagger: 0.01,
        ease: "power3.inOut"
    }, 0);
}

const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');

musicToggle.addEventListener('click', () => {
    // Check if the music file actually loaded
    if (music.readyState >= 2) { 
        if (music.paused) {
            music.play().then(() => {
                music.volume = 0;
                gsap.to(music, { volume: 0.5, duration: 2 });
                document.getElementById('music-icon').innerText = "Pause Music";
            }).catch(error => {
                console.error("Playback failed:", error);
                alert("Please interact with the page first to play music.");
            });
        } else {
            music.pause();
            document.getElementById('music-icon').innerText = "Play Music";
        }
    } else {
        console.error("Music file not ready. Check the file path.");
        alert("The music is still loading or the file wasn't found.");
    }
});

});
