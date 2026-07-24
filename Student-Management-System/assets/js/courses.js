document.addEventListener("DOMContentLoaded", () => {
    const cycleSelect = document.getElementById("cycle-select");
    const tableBody = document.getElementById("cours-table-body");
    const searchInput = document.getElementById("search-input");

    let currentCourses = [];

    function sortCoursesAlphabetically(courses) {
        return courses.sort((a, b) => {
            const titleA = (a.title || "").toLowerCase();
            const titleB = (b.title || "").toLowerCase();
            return titleA.localeCompare(titleB);
        });
    }

    async function loadCourses(cycle) {
        try {
            if (cycle === "all") {
                const files = ["cours_college.json", "cours_lycee.json", "cours_universite.json"];
                let allCombined = [];

                for (const file of files) {
                    try {
                        const response = await fetch(`../data/${file}`);
                        if (response.ok) {
                            const data = await response.json();
                            allCombined = allCombined.concat(data);
                        }
                    } catch (err) {
                        console.warn(`Impossible de charger ${file}`, err);
                    }
                }
                currentCourses = allCombined;
            } else {
                let fileName = "cours.json";
                if (cycle === "college") {
                    fileName = "cours_college.json";
                } else if (cycle === "lycee") {
                    fileName = "cours_lycee.json";
                } else if (cycle === "universite") {
                    fileName = "cours_universite.json";
                }

                const response = await fetch(`../data/${fileName}`);
                if (!response.ok) {
                    throw new Error(`Erreur lors du chargement de ${fileName}`);
                }
                currentCourses = await response.json();
            }

            sortCoursesAlphabetically(currentCourses);
            displayCourses(currentCourses);
        } catch (error) {
            console.error("Erreur:", error);
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">Impossible de charger les données pour ce cycle.</td></tr>`;
        }
    }

    function displayCourses(courses) {
        tableBody.innerHTML = "";

        if (!courses || courses.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center;">Aucun cours trouvé.</td></tr>`;
            return;
        }

        courses.forEach(course => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${course.code || ""}</td>
                <td>${course.title || ""}</td>
                <td>${course.cycle || ""}</td>
                <td>${course.hours ? course.hours + "h" : ""}</td>
                <td>${course.teacher || ""}</td>
                <td>
                    <button class="btn-action btn-edit" data-id="${course.id}">Modifier</button>
                    <button class="btn-action btn-delete" data-id="${course.id}">Supprimer</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function filterAndSearch() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        
        const filtered = currentCourses.filter(course => {
            const code = (course.code || "").toLowerCase();
            const title = (course.title || "").toLowerCase();
            return code.includes(query) || title.includes(query);
        });

        displayCourses(filtered);
    }

    cycleSelect.addEventListener("change", (e) => {
        const selectedCycle = e.target.value;
        if (searchInput) searchInput.value = "";
        loadCourses(selectedCycle);
    });

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            filterAndSearch();
        });
    }

    loadCourses("all");
});