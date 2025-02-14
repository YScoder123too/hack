document.addEventListener("DOMContentLoaded", function () {
    console.log("Forum page loaded");

    // Make psychologist phone numbers clickable
    const phoneNumbers = document.querySelectorAll(".psychologist-card p");
    phoneNumbers.forEach(phone => {
        const number = phone.textContent.replace("Contact: ", "");
        phone.innerHTML = `<a href="tel:${number}">${phone.textContent}</a>`;
    });

    // Smooth scroll to sections
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
