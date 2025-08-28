async function loadSongs() {
  const res = await fetch("songs.json");
  const songs = await res.json();

  const sidebar = document.getElementById("song-list");
  const mobileMenu = document.getElementById("mobile-menu");

  songs.forEach(song => {
    const link = document.createElement("a");
    link.href = `#${song.id}`;
    link.textContent = song.title;

    // desktop list
    sidebar.appendChild(link.cloneNode(true));

    // mobile menu
    mobileMenu.appendChild(link);
  });

  // Handle navigation
  window.addEventListener("hashchange", () => loadSongFromHash(songs));
  loadSongFromHash(songs); // load default
}

async function loadSongFromHash(songs) {
  let songId = location.hash.replace("#", "");
  if (!songId) songId = songs[0].id; // default first song

  const song = songs.find(s => s.id === songId);
  if (!song) return;

  // Update page title
  document.title = song.title + " - Lyrics Hub";

  // Highlight active link
  document.querySelectorAll("#song-list a, #mobile-menu a").forEach(a => {
    a.classList.toggle("active", a.getAttribute("href") === `#${song.id}`);
  });

  // Load video
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = `
    <iframe 
      src="${song.youtube}" 
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  `;

  // Load lyrics
  const lyricsContainer = document.getElementById("lyrics-container");
  const res = await fetch(`songs/${song.file}`);
  lyricsContainer.innerHTML = await res.text();

  // instantly reset scroll position to top
  window.scrollTo(0, 0);

  // Close mobile menu after selection
  document.getElementById("mobile-menu").classList.remove("show");
}

// Mobile menu toggle
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("mobile-menu").classList.toggle("show");
});

loadSongs();
