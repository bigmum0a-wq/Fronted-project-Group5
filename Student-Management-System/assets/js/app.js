const navLinks = document.querySelectorAll('.second-container nav ul li a');
const mainContainer = document.getElementById('pages');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Récupérer l'attribut href ou formater le texte proprement pour correspondre aux fichiers de /pages/
        const href = link.getAttribute('href'); // Ex: "pages/students.html"
        const pageName = href.replace('pages/', '').replace('.html', '');

        fetch(href)
            .then(response => {
                if (!response.ok) throw new Error("Page introuvable");
                return response.text();
            })
            .then(html => {
                mainContainer.innerHTML = html;
                
                // Optionnel : Déclencher une fonction d'initialisation spécifique si elle existe
                // Par exemple, si on charge students.html, relancer l'initialisation du tableau des étudiants
                if (pageName === 'students' && typeof loadStudents === 'function') {
                    loadStudents();
                }
            })
            .catch(error => {
                mainContainer.innerHTML = `<h2>Chargement de ${pageName} en cours...</h2><p>Le fichier sera bientôt disponible.</p>`;
            });
    });
});