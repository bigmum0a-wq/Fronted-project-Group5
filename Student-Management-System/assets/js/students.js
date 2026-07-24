document.addEventListener("DOMContentLoaded", () => {
    const cycleSelect = document.getElementById("cycle-select");
    const classFilter = document.getElementById("class-filter");
    const searchInput = document.getElementById("search-input");
    const tableBody = document.getElementById("students-table-body");

    // Éléments du modal
    const openModalBtn = document.getElementById("open-modal-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const modal = document.getElementById("add-student-modal");
    const addStudentForm = document.getElementById("add-student-form");

    let currentStudentsData = [];

    // Gestion de l'ouverture/fermeture du modal (CORRIGÉ)
    if (openModalBtn && modal) {
        openModalBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // Charger le fichier JSON du cycle sélectionné
    const loadCycleData = async () => {
        const selectedCycleFile = cycleSelect.value; // ex: college.json, lycee.json...
        tableBody.innerHTML = `<tr><td colspan="7" class="loading-text">Chargement des données...</td></tr>`;

        try {
            const response = await fetch(`../data/${selectedCycleFile}`);
            if (!response.ok) throw new Error("Fichier introuvable");
            currentStudentsData = await response.json();
            
            populateClassFilter(currentStudentsData);
            renderTable(currentStudentsData);
        } catch (error) {
            console.error("Erreur de chargement :", error);
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-text" style="color: red;">Erreur : Impossible de charger ${selectedCycleFile}. Vérifiez son existence dans le dossier data.</td></tr>`;
            currentStudentsData = [];
            populateClassFilter([]);
        }
    };

    // Remplir dynamiquement le filtre des classes
    const populateClassFilter = (data) => {
        classFilter.innerHTML = `<option value="all">Toutes les classes</option>`;
        const uniqueClasses = new Set();

        data.forEach(student => {
            if (student.academicHistory) {
                student.academicHistory.forEach(history => {
                    const className = history.className || history.major;
                    if (className) uniqueClasses.add(className);
                });
            }
        });

        uniqueClasses.forEach(className => {
            const option = document.createElement("option");
            option.value = className;
            option.textContent = className;
            classFilter.appendChild(option);
        });
    };

    // Rendu du tableau avec filtres de recherche et de classe
    const renderTable = (data) => {
        const selectedClass = classFilter.value;
        const searchTerm = searchInput.value.toLowerCase().trim();

        tableBody.innerHTML = "";

        const filtered = data.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) || 
                                  student.id.toLowerCase().includes(searchTerm);
            
            let matchesClass = true;
            if (selectedClass !== "all") {
                matchesClass = student.academicHistory && student.academicHistory.some(h => 
                    (h.className === selectedClass || h.major === selectedClass)
                );
            }

            return matchesSearch && matchesClass;
        });

        if (filtered.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="7" class="loading-text">Aucun étudiant trouvé.</td></tr>`;
            return;
        }

        filtered.forEach(student => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><img src="${student.photo || '../assets/images/default.jpg'}" alt="Avatar" class="table-avatar"></td>
                <td><strong>${student.id}</strong></td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.phone}</td>
                <td>${student.address}</td>
                <td><a href="profile.html?id=${student.id}" class="btn-view">Voir profil</a></td>
            `;
            tableBody.appendChild(tr);
        });
    };

    // Gestion de l'ajout d'un étudiant via le formulaire du modal
    if (addStudentForm) {
        addStudentForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const newStudent = {
                id: document.getElementById("new-id").value.trim(),
                name: document.getElementById("new-name").value.trim(),
                email: document.getElementById("new-email").value.trim(),
                phone: document.getElementById("new-phone").value.trim(),
                address: document.getElementById("new-address").value.trim(),
                photo: "../assets/images/default.jpg",
                academicHistory: [
                    {
                        className: classFilter.value !== "all" ? classFilter.value : "Classe générale",
                        level: cycleSelect.value.replace(".json", ""),
                        average: "12.0",
                        rank: "-"
                    }
                ]
            };

            currentStudentsData.unshift(newStudent); // Ajoute en haut de liste
            renderTable(currentStudentsData);
            modal.style.display = "none";
            addStudentForm.reset();
            alert("Étudiant ajouté avec succès à l'affichage local !");
        });
    }

    // Écouteurs d'événements
    cycleSelect.addEventListener("change", loadCycleData);
    classFilter.addEventListener("change", () => renderTable(currentStudentsData));
    searchInput.addEventListener("input", () => renderTable(currentStudentsData));

    // Lancement initial
    loadCycleData();
});