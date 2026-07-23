// Sélectionne tous les liens de la barre latérale
const navLinks = document.querySelectorAll('.second-container nav ul li a');
const mainContainer = document.getElementById('pages');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le rechargement classique de la page
        
        // Récupère le texte ou le nom du lien pour cibler la page (ex: dashboard, students...)
        const pageName = link.textContent.trim().toLowerCase();
        
        // Simule le chargement du fichier HTML correspondant depuis le dossier pages/
        // (Tu pourras utiliser fetch() plus tard, ou injecter un contenu de test)
        fetch(`pages/${pageName}.html`)
            .then(response => {
                if (!response.ok) throw new Error("Page introuvable");
                return response.text();
            })
            .then(html => {
                mainContainer.innerHTML = html; // Remplace le contenu de la zone de droite
            })
            .catch(error => {
                mainContainer.innerHTML = `<h2>Chargement de ${pageName} en cours...</h2><p>Le fichier sera bientôt disponible.</p>`;
            });
    });
});