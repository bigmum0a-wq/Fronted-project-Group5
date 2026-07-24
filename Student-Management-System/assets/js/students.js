document.addEventListener("DOMContentLoaded", () => {
    const cycleSelect = document.getElementById("cycle-select");
    const classFilter = document.getElementById("class-filter");
    const searchInput = document.getElementById("search-input");
    const tableBody = document.getElementById("students-table-body");

    let currentStudents = [];

    // Fonction de tri alphabétique par nom complet
    function sortStudentsAlphabetically(students) {
        return students.sort((a, b) => {
            const nameA = (a.name || "").toLowerCase();
            const nameB = (b.name || "").toLowerCase();
            return nameA.localeCompare(nameB);
        });
    }

    // Charger les données en fonction du cycle sélectionné
    async function loadStudents() {
        const selectedValue = cycleSelect.value;
        let fileName = selectedValue;

        try {
            if (selectedValue === "students.json" || selectedValue === "all") {
                // Remplissage automatique en combinant tous les fichiers de cycles
                const files = [
                    "students_college.json", 
                    "students_lycee.json", 
                    "students_licence.json", 
                    "students_master.json", 
                    "students_doctorat.json"
                ];
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
                currentStudents = allCombined;
            } else {
                const response = await fetch(`../data/${fileName}`);
                if (!response.ok) {
                    throw new Error(`Erreur lors du chargement de ${fileName}`);
                }
                currentStudents = await response.json();
            }

            // Tri alphabétique par défaut
            sortStudentsAlphabetically(currentStudents);
            
            // Mettre à jour le filtre des classes spécifiques
            populateClassFilter(currentStudents);
            
            // Afficher les étudiants
            displayStudents(currentStudents);

        } catch (error) {
            console.error("Erreur:", error);
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-text" style="color: red; text-align: center;">Impossible de charger les données.</td></tr>`;
        }
    }

    // Remplir dynamiquement le menu déroulant des classes en fonction des données chargées
    function populateClassFilter(students) {
        if (!classFilter) return;
        
        const currentSelection = classFilter.value;
        classFilter.innerHTML = '<option value="all">Toutes les classes</option>';

        const classesSet = new Set();
        students.forEach(student => {
            if (student.academicHistory && Array.isArray(student.academicHistory)) {
                student.academicHistory.forEach(record => {
                    if (record.className) classesSet.add(record.className);
                });
            }
        });

        classesSet.forEach(className => {
            const option = document.createElement("option");
            option.value = className;
            option.textContent = className;
            classFilter.appendChild(option);
        });

        classFilter.value = currentSelection;
    }

    // Afficher les étudiants dans le tableau
    function displayStudents(students) {
        tableBody.innerHTML = "";

        if (!students || students.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-text" style="text-align: center;">Aucun étudiant trouvé.</td></tr>`;
            return;
        }

        students.forEach(student => {
            const tr = document.createElement("tr");
            
            const photoStyle = student.photo ? `background-image: url('${student.photo}'); background-size: cover; background-position: center;` : '';
            
            tr.innerHTML = `
                <td><div class="table-photo" style="width: 35px; height: 35px; border-radius: 50%; ${photoStyle}"></div></td>
                <td>${student.id || ""}</td>
                <td>${student.name || ""}</td>
                <td>${student.email || ""}</td>
                <td>${student.phone || ""}</td>
                <td>${student.address || ""}</td>
                <td>
                    <button class="btn-action btn-edit" data-id="${student.id}">Modifier</button>
                    <button class="btn-action btn-delete" data-id="${student.id}">Supprimer</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Filtrer et rechercher (par nom, ID, et classe spécifique)
    function filterAndSearch() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const selectedClass = classFilter ? classFilter.value : "all";

        const filtered = currentStudents.filter(student => {
            const id = (student.id || "").toLowerCase();
            const name = (student.name || "").toLowerCase();
            
            const matchesSearch = id.includes(query) || name.includes(query);

            let matchesClass = true;
            if (selectedClass !== "all") {
                matchesClass = student.academicHistory && student.academicHistory.some(record => record.className === selectedClass);
            }

            return matchesSearch && matchesClass;
        });

        displayStudents(filtered);
    }

    // Écouteurs d'événements
    if (cycleSelect) {
        cycleSelect.addEventListener("change", () => {
            if (searchInput) searchInput.value = "";
            loadStudents();
        });
    }

    if (classFilter) {
        classFilter.addEventListener("change", () => {
            filterAndSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", () => {
            filterAndSearch();
        });
    }

    // Chargement initial au démarrage de la page
    loadStudents();
});