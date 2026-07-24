document.addEventListener("DOMContentLoaded", () => {
    // URL de ton fichier de données ou point d'API (adapte selon ton arborescence)
    const dataUrl = "../data/students.json"; 

    // ID de l'étudiant actif (tu peux le récupérer dynamiquement ou en dur pour le test)
    const studentIdToLoad = "1"; 

    fetch(dataUrl)
        .then(response => {
            if (!response.ok) throw new Error("Erreur lors du chargement des données.");
            return response.json();
        })
        .then(data => {
            // Recherche de l'étudiant (par ID)
            const student = data.find(s => s.id === studentIdToLoad) || data[0];
            if (!student) return;

            // 1. Injection des informations personnelles dans la barre du haut
            document.getElementById("student-id").textContent = student.id || "--";
            document.getElementById("email").textContent = student.email || "--";
            document.getElementById("phone").textContent = student.phone || "--";
            document.getElementById("address").textContent = student.address || "--";

            // Injection du nom dans le bloc de la photo (si besoin)
            const nameEl = document.getElementById("name");
            if (nameEl) nameEl.textContent = student.name || "Étudiant";

            // Photo de profil
            const photoEl = document.querySelector(".photo");
            if (photoEl && student.photo) {
                photoEl.style.backgroundImage = `url('${student.photo}')`;
            }

            // 2. Gestion du menu déroulant des classes et de l'historique académique
            const classSelect = document.getElementById("class-select");
            if (classSelect && student.academicHistory) {
                classSelect.innerHTML = ""; // Nettoyage

                // Remplissage du select avec les classes de l'étudiant
                student.academicHistory.forEach((record, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = record.className;
                    classSelect.appendChild(option);
                });

                // Fonction pour afficher les stats d'une classe sélectionnée
                const updateDisplay = (index) => {
                    const record = student.academicHistory[index];
                    if (!record) return;

                    document.getElementById("stat-diploma").textContent = record.diploma || "--";
                    document.getElementById("stat-level").textContent = record.level || "--";
                    document.getElementById("stat-average").textContent = record.average ? record.average + " / 20" : "--";
                    document.getElementById("stat-rank").textContent = record.rank || "--";

                    // Activités récentes
                    const activitiesList = document.getElementById("activities-list");
                    activitiesList.innerHTML = "";
                    if (record.activities && record.activities.length > 0) {
                        record.activities.forEach(act => {
                            const li = document.createElement("li");
                            li.textContent = act;
                            activitiesList.appendChild(li);
                        });
                    } else {
                        activitiesList.innerHTML = "<li>Aucune activité récente.</li>";
                    }

                    // Trophées
                    const trophiesContainer = document.getElementById("trophies-container");
                    trophiesContainer.innerHTML = "";
                    if (record.trophies && record.trophies.length > 0) {
                        record.trophies.forEach(trophy => {
                            const badge = document.createElement("span");
                            badge.className = "trophy-badge";
                            badge.textContent = trophy;
                            trophiesContainer.appendChild(badge);
                        });
                    } else {
                        trophiesContainer.innerHTML = '<span class="no-trophy">Aucun trophée pour le moment</span>';
                    }
                };

                // Afficher par défaut la dernière classe (la plus récente)
                const lastIndex = student.academicHistory.length - 1;
                classSelect.value = lastIndex;
                updateDisplay(lastIndex);

                // Écouteur sur le changement de classe dans le menu déroulant
                classSelect.addEventListener("change", (e) => {
                    updateDisplay(e.target.value);
                });
            }
        })
        .catch(error => {
            console.error("Erreur JS :", error);
        });
});