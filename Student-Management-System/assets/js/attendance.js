function initAttendancePage() {

    const classFilter = document.getElementById("classFilter");
    const dateFilter = document.getElementById("dateFilter");

    if (!classFilter || !dateFilter) return;

    const rows = document.querySelectorAll("#attendanceTable tr");

    function applyFilters() {

        const selectedClass = classFilter.value;
        const selectedDate = dateFilter.value;

        rows.forEach(function (row) {

            const studentClass = row.cells[1].textContent;
            const studentDate = row.dataset.date;

            const classMatch = selectedClass === "All" || studentClass === selectedClass;
            const dateMatch = selectedDate === "" || studentDate === selectedDate;

            row.style.display = classMatch && dateMatch ? "" : "none";

        });

        updateSummary();

    }

    function updateSummary() {

        let present = 0;
        let absent = 0;
        let late = 0;

        rows.forEach(function (row) {

            if (row.style.display === "none") return;

            if (row.querySelector(".present")) present++;
            if (row.querySelector(".absent")) absent++;
            if (row.querySelector(".tardy")) late++;

        });

        document.getElementById("totalPresent").textContent = present;
        document.getElementById("totalAbsent").textContent = absent;
        document.getElementById("totalLate").textContent = late;

    }

    classFilter.addEventListener("change", applyFilters);
    dateFilter.addEventListener("change", applyFilters);

    updateSummary();

}

initAttendancePage();

window.initAttendancePage = initAttendancePage;