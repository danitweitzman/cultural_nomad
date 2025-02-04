document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("stickerContainer");
    const stickers = container.querySelectorAll(".draggable");

    let activeSticker = null;
    let offsetX = 0;
    let offsetY = 0;

    function getRandomPosition(container) {
        let rect = container.getBoundingClientRect();
        let maxX = rect.width - 100;
        let maxY = rect.height - 100;
        let x = Math.random() * maxX;
        let y = Math.random() * maxY;
        return { x, y };
    }

    stickers.forEach(sticker => {
        let pos = getRandomPosition(container);
        sticker.style.left = pos.x + "px";
        sticker.style.top = pos.y + "px";

        sticker.addEventListener("mousedown", function (e) {
            e.preventDefault();
            activeSticker = sticker;
            const rect = sticker.getBoundingClientRect();

            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;

            sticker.style.zIndex = 1000;
        });
    });

    document.addEventListener("mousemove", function (e) {
        if (!activeSticker) return;

        const containerRect = container.getBoundingClientRect();
        const stickerRect = activeSticker.getBoundingClientRect();

        let newLeft = e.clientX - containerRect.left - offsetX;
        let newTop = e.clientY - containerRect.top - offsetY;

        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - stickerRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - stickerRect.height));

        activeSticker.style.left = newLeft + "px";
        activeSticker.style.top = newTop + "px";
    });

    document.addEventListener("mouseup", function () {
        if (activeSticker) {
            activeSticker.style.zIndex = "auto";
            activeSticker = null;
        }
    });

    document.querySelector(".styled-button").addEventListener("click", function () {
        html2canvas(container, { backgroundColor: "#ffffff" }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const { jsPDF } = window.jspdf;
            let pdf = new jsPDF("p", "mm", "a4");
            let imgWidth = 210; 
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("ad-collage.pdf");
        });
    });

});
