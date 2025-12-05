// This is our main "database" of lessons. It's an array of objects,
// where each object represents a single lesson with its details.
const lessons = [
  {
    title: "HTML Basics",
    description: "Learn how to structure a webpage using HTML5.",
    image: "assets/images/html.png",
    videoUrl: "https://www.youtube.com/watch?v=kUMe1FH4CHE"
  },
  {
    title: "CSS Essentials",
    description: "Master modern layouts with Flexbox, Grid, and more.",
    image: "assets/images/css.png",
    videoUrl: "https://www.youtube.com/watch?v=OEV8gHsW_hY"
  },
  {
    title: "JavaScript Essentials",
    description: "Understand JS from basics to DOM.",
    image: "assets/images/js.png",
    videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5eDE"
  },
  {
    title: "React Fundamentals",
    description: "Basics of the popular React library",
    image: "assets/images/react.png",
    videoUrl: "https://www.youtube.com/watch?v=SqcY0GlETPk"
  },
  {
    title: "Node.js Backend",
    description: "Build fast and scalable server-side applications.",
    image: "assets/images/nodejs.jpg",
    videoUrl: "https://www.youtube.com/watch?v=f2EqECiTBL8"
  },
  {
    title: "Git & GitHub",
    description: "Master version control from scratch.",
    image: "assets/images/git.jpg",
    videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk"
  },
  {
    title: "Prompt Engineering",
    description: "Learn to communicate effectively with AI models.",
    image: "assets/images/promt.jpg",
    videoUrl: "https://www.youtube.com/watch?v=dOxUroR57xs"
  }
];

// We wrap our entire script in this event listener for "DOMContentLoaded".
// This is a best practice to make sure our JavaScript code only runs *after* the whole HTML page has been loaded and is ready.
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  // Grabbing the elements from our HTML that we'll need to work with.
  const lessoncontainer = document.getElementById("lesson-container");
  const searchInput = document.getElementById("searchinput");
  
  // --- State Management ---
  // We load the user's progress from the browser's localStorage.
  // The `JSON.parse()` converts the stored string back into a JavaScript array.
  // The `|| []` is a neat trick: if there's nothing in localStorage (like for a first-time visitor), it just gives us an empty array to start with.
  let completedLessons = JSON.parse(localStorage.getItem("completed_lessons")) || [];
  let startedLessons = JSON.parse(localStorage.getItem("started_lessons")) || [];
  let favoritedLessons = JSON.parse(localStorage.getItem("favorite_lessons")) || [];
  let currentFilter = "all";
  
  // Whenever the user types in the search bar, we'll re-render the lessons to match the search.
  searchInput.addEventListener("input", renderLessons);
  
  // This function is for the filter buttons (All, Started, etc.).
  // We have to attach it to the `window` object so the `onclick` attribute in the HTML can find and run it.
  window.filterLessons = function (filterType) {
    currentFilter = filterType;
    renderLessons();
  };
  
  // --- Core Functions ---

  function startLesson(title) {
    // Find the specific lesson object from our array that matches the title.
    const lesson = lessons.find(l => l.title === title);
    if (!lesson) return; // If for some reason it's not found, we stop here.

    // This is the key part: open the video URL in a new browser tab.
    window.open(lesson.videoUrl, '_blank');

    // We still mark the lesson as "started" to track progress.
    if (!startedLessons.includes(title)) {
      startedLessons.push(title);
      localStorage.setItem("started_lessons", JSON.stringify(startedLessons));
    }
    renderLessons();
  }
  
  function completedlesson(title) {
    if (!completedLessons.includes(title)) {
      completedLessons.push(title);
      localStorage.setItem("completed_lessons", JSON.stringify(completedLessons));
      alert(`Lesson marked as completed: ${title}`);
    }
    renderLessons();
  }

  // This function adds or removes a lesson from the user's favorites.
  function toggleFavorite(title) {
    const index = favoritedLessons.indexOf(title);
    if (index === -1) {
      favoritedLessons.push(title);
      alert(`Added to Favorites: ${title}`);
    } else {
      favoritedLessons.splice(index, 1);
      alert(`Removed from Favorites: ${title}`);
    }
    localStorage.setItem("favorite_lessons", JSON.stringify(favoritedLessons));
    renderLessons();
  }

  // This is the main function that draws all the lesson cards on the screen.
  function renderLessons() {
    if (!lessoncontainer) return;

    // First, we wipe the slate clean. This prevents duplicate cards from showing up.
    lessoncontainer.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();

    lessons.forEach((lesson) => {
      // For each lesson, we check its status (started, completed, favorite).
      const isStarted = startedLessons.includes(lesson.title);
      const isCompleted = completedLessons.includes(lesson.title);
      const isFavorite = favoritedLessons.includes(lesson.title);

      if (!lesson.title.toLowerCase().includes(searchTerm)) return;
      if (currentFilter === "started" && !isStarted) return;
      if (currentFilter === "completed" && !isCompleted) return;
      if (currentFilter === "favorites" && !isFavorite) return;

      // Create a new <section> element for the card.
      const lessonCard = document.createElement("section");
      lessonCard.className = "lesson-card";
      // Here we build the card's HTML using a template literal (the backticks ``). It's way cleaner than concatenating strings with '+'.
      lessonCard.innerHTML = `
        <div class="lesson-card-inner">
          <img src="${lesson.image}" alt="${lesson.title}">
          <h2>${lesson.title}</h2>
          <p>${lesson.description}</p>
          <div class="badges">
            ${isStarted ? '<span class="badge started">Started</span>' : ""}
            ${isCompleted ? '<span class="badge completed">Completed</span>' : ""}
            ${isFavorite ? '<span class="badge favorite">Favorite</span>' : ""}
            </div>
          <div class="button-wrap">
            <!-- We're using onclick here to call our functions. We pass the lesson title so the function knows which lesson to act on. -->
            <button onclick="startLesson('${lesson.title}')" id="startbtn">Start Lesson</button>
            <button onclick="completedlesson('${lesson.title}')" id="completedbtn">Mark as completed</button>
            <button onclick="openLessonModal(${JSON.stringify(lesson).replace(/"/g, '&quot;')})">Preview</button>
            <button onclick="toggleFavorite('${lesson.title}')">
            <!-- This is a ternary operator: a compact if/else statement. If it's a favorite, show "unfavorite", otherwise show "Favorite". -->
            ${isFavorite?"unfavorite":"Favorite"}
          </div>
        </div>
      `;
      lessoncontainer.appendChild(lessonCard);
    });

    // If, after all the filtering, no lessons are left to show, we display a friendly message.
    if (lessoncontainer.children.length === 0) {
      lessoncontainer.innerHTML = `<p style="text-align:center;">No lessons found.</p>`;
    }
  }

  // --- Modal Handling ---
  // Getting all the parts of our popup modal.
  const modal = document.getElementById("lessonModal");
  const ModalTitle = document.getElementById("modalTitle");
  const ModalDesc = document.getElementById("modalDesc");
  const ModalImage = document.getElementById("modalImage");
  const modalstartBtn = document.getElementById("modalstartbtn");
  const modalcompletedBtn = document.getElementById("modalcompletebtn");
  const closeModal = document.getElementById("closeModal");

  let currentLesson = null;

  // This function takes a lesson object and populates the modal with its data, then shows it.
  function openLessonModal(lesson) {
    currentLesson = lesson;
    ModalTitle.textContent = lesson.title;
    ModalDesc.textContent = lesson.description;
    ModalImage.src = lesson.image;
    modal.classList.remove("hidden");
  }

  // When the 'x' is clicked, hide the modal.
  closeModal.onclick = () => {
    modal.classList.add("hidden");
  };

  // Hooking up the "Start" button inside the modal.
  modalstartBtn.onclick = () => {
    if (currentLesson) {
      startLesson(currentLesson.title);
      modal.classList.add("hidden");
    }
  };

  // Hooking up the "Complete" button inside the modal.
  modalcompletedBtn.onclick = () => {
    if (currentLesson) {
      completedlesson(currentLesson.title);
      modal.classList.add("hidden");
    }
  };

  // --- Initial Setup ---
  // We expose our functions to the global `window` object. This is necessary so the `onclick` attributes in the HTML can find them.
  window.startLesson = startLesson;
  window.completedlesson = completedlesson;
  window.openLessonModal = openLessonModal;
  window.toggleFavorite = toggleFavorite;
  
  
  // This is the first-time call to draw the lessons when the page loads.
  renderLessons();
  // This part updates the progress stats and the progress bar when the page first loads.
  const total = lessons.length;
  const started = startedLessons.length;
  const completed = completedLessons.length;
  
  document.getElementById("total-count").textContent = total;
  document.getElementById("started-count").textContent = started;
  document.getElementById("completed-count").textContent = completed;
  
  // Calculate the completion percentage for the progress bar.
  const fillPercent = Math.floor((completed / total) * 100);
  document.getElementById("progress-fill").style.width = `${fillPercent}%`;
  
});
