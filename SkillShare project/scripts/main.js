const lessons = [
  {
    title: "HTML Basics",
    description: "Learn how to structure a webpage using HTML5",
    image: "assets/images/html.png"
  },
  {
    title: "CSS Flexbox",
    description: "Master modern layout with Flexbox",
    image: "assets/images/css.png"
  },
  {
    title: "JavaScript Essentials",
    description: "Understand JS from basics to DOM",
    image: "assets/images/js.png"
  },
  {
    title: "React Fundamentals",
    description: "Basics of the popular React library",
    image: "assets/images/react.png"
  },
   {
    title: "HTML Basics",
    description: "Learn how to structure a webpage using HTML5",
    image: "assets/images/html.png"
  },
  {
    title: "CSS Flexbox",
    description: "Master modern layout with Flexbox",
    image: "assets/images/css.png"
  },
  {
    title: "JavaScript Essentials",
    description: "Understand JS from basics to DOM",
    image: "assets/images/js.png"
  },
  {
    title: "React Fundamentals",
    description: "Basics of the popular React library",
    image: "assets/images/react.png"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const lessoncontainer = document.getElementById("lesson-container");
  const searchInput = document.getElementById("searchinput");
  
  let completedlessons = JSON.parse(localStorage.getItem("completed_lessons")) || [];
  let startedlessons = JSON.parse(localStorage.getItem("started_lessons")) || [];
  let favroitedLessons=JSON.parse(localStorage.getItem("favroite_lessons"))||[];
  let currentFilter = "all";
  
  searchInput.addEventListener("input", renderLessons);
  
  window.filterLessons = function (filterType) {
    currentFilter = filterType;
    renderLessons();
  };
  
  function startLesson(title) {
    if (!startedlessons.includes(title)) {
      startedlessons.push(title);
      localStorage.setItem("started_lessons", JSON.stringify(startedlessons));
      alert(`Lesson Started: ${title}`);
    }
    renderLessons();
  }
  
  function completedlesson(title) {
    if (!completedlessons.includes(title)) {
      completedlessons.push(title);
      localStorage.setItem("completed_lessons", JSON.stringify(completedlessons));
      alert(`Lesson marked as completed: ${title}`);
    }
    renderLessons();
  }
  window.toggleFavorite = toggleFavorite;
function toggleFavorite(title){
  const index =favroitedLessons.indexOf(title);
  if(index===-1){
    favroitedLessons.push(title);
    alert(`Added to Favroite:${title}`);
  }
  else{
    favroitedLessons.splice(index,1);
    alert(`Removed from Favorite:${title}`);
  }
  localStorage.setItem("favroite_lessons",JSON.stringify(favroitedLessons));

renderLessons()
}

  function renderLessons() {
    if (!lessoncontainer) return;

    lessoncontainer.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();

    lessons.forEach((lesson) => {
      const isStarted = startedlessons.includes(lesson.title);
      const isCompleted = completedlessons.includes(lesson.title);
      const isFavorite=favroitedLessons.includes(lesson.title);

      if (!lesson.title.toLowerCase().includes(searchTerm)) return;
      if (currentFilter === "started" && !isStarted) return;
      if (currentFilter === "completed" && !isCompleted) return;
      if (currentFilter==="favroites" && !isFavorite)return;

      const lessonCard = document.createElement("section");
      lessonCard.className = "lesson-card";
      lessonCard.innerHTML = `
        <div class="lesson-card-inner">
          <img src="${lesson.image}" alt="${lesson.title}">
          <h2>${lesson.title}</h2>
          <p>${lesson.description}</p>
          <div class="badges">
            ${isStarted ? '<span class="badge started">Started</span>' : ""}
            ${isCompleted ? '<span class="badge completed">Completed</span>' : ""}
            ${isFavorite?'<span class="badge favroite">Favorite</span>':""}
            </div>
          <div class="button-wrap">
            <button onclick="startLesson('${lesson.title}')" id="startbtn">Start Lesson</button>
            <button onclick="completedlesson('${lesson.title}')" id="completedbtn">Mark as completed</button>
            <button onclick="openLessonModal(${JSON.stringify(lesson).replace(/"/g, '&quot;')})">Preview</button>
            <button onclick="togleFavroite('${lesson.title}')">
            ${isFavorite?"unfavorite":"Favorite"}
          </div>
        </div>
      `;
      lessoncontainer.appendChild(lessonCard);
    });

    if (lessoncontainer.children.length === 0) {
      lessoncontainer.innerHTML = `<p style="text-align:center;">No lessons found.</p>`;
    }
  }

  const modal = document.getElementById("lessonModal");
  const ModalTitle = document.getElementById("modalTitle");
  const ModalDesc = document.getElementById("modalDesc");
  const ModalImage = document.getElementById("modalImage");
  const modalstartBtn = document.getElementById("modalstartbtn");
  const modalcompletedBtn = document.getElementById("modalcompletebtn");
  const closeModal = document.getElementById("closeModal");

  let currentLesson = null;

  function openLessonModal(lesson) {
    currentLesson = lesson;
    ModalTitle.textContent = lesson.title;
    ModalDesc.textContent = lesson.description;
    ModalImage.src = lesson.image;
    modal.classList.remove("hidden");
  }

  closeModal.onclick = () => {
    modal.classList.add("hidden");
  };

  modalstartBtn.onclick = () => {
    if (currentLesson) {
      startLesson(currentLesson.title);
      modal.classList.add("hidden");
    }
  };

  modalcompletedBtn.onclick = () => {
    if (currentLesson) {
      completedlesson(currentLesson.title);
      modal.classList.add("hidden");
    }
  };

  window.startLesson = startLesson;
  window.completedlesson = completedlesson;
  window.openLessonModal = openLessonModal;
  
  
  
  renderLessons();
  // Update progress tracking
  const total = lessons.length;
  const started = startedlessons.length;
  const completed = completedlessons.length;
  
  document.getElementById("total-count").textContent = total;
  document.getElementById("started-count").textContent = started;
  document.getElementById("completed-count").textContent = completed;
  
  const fillPercent = Math.floor((completed / total) * 100);
  document.getElementById("progress-fill").style.width = `${fillPercent}%`;
  
});


