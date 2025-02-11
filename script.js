document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("stickerContainer");
    const sidebar = document.getElementById("sidebar");
  
    // Select all .sticker.draggable in both sidebar + container
    const stickers = document.querySelectorAll(".sticker.draggable");
  
    let activeSticker = null;
    let offsetX = 0;
    let offsetY = 0;
  
    // 1) Insert remove button into each .sticker
    document.querySelectorAll(".sticker.draggable").forEach(stickerDiv => {
      // Create the 'x' button
      const removeBtn = document.createElement("span");
      removeBtn.classList.add("remove-button");
      removeBtn.innerHTML = "x";
      stickerDiv.appendChild(removeBtn);
  
      // When clicked, move this sticker back to the sidebar
      removeBtn.addEventListener("click", function(e) {
        e.stopPropagation(); // prevent drag from starting on click
        stickerDiv.style.position = "";
        stickerDiv.style.left = "";
        stickerDiv.style.top = "";
        sidebar.appendChild(stickerDiv);
      });
    });
  
    // 2) Drag logic
    stickers.forEach(sticker => {
      sticker.addEventListener("mousedown", function(e) {
        e.preventDefault();
        activeSticker = sticker;
  
        // bounding box for offset
        const rect = sticker.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
  
        // bring to front
        sticker.style.zIndex = 1000;
      });
    });
  
    document.addEventListener("mousemove", function(e) {
      if (!activeSticker) return;
  
      // bounding box for limiting movement inside container
      const containerRect = container.getBoundingClientRect();
      const stickerRect = activeSticker.getBoundingClientRect();
  
      let newLeft = e.clientX - containerRect.left - offsetX;
      let newTop = e.clientY - containerRect.top - offsetY;
  
      // keep sticker within design area
      newLeft = Math.max(0, Math.min(newLeft, containerRect.width - stickerRect.width));
      newTop = Math.max(0, Math.min(newTop, containerRect.height - stickerRect.height));
  
      // switch to absolute positioning in the design area
      activeSticker.style.position = "absolute";
      container.appendChild(activeSticker);
      activeSticker.style.left = newLeft + "px";
      activeSticker.style.top = newTop + "px";
    });
  
    document.addEventListener("mouseup", function() {
      if (activeSticker) {
        activeSticker.style.zIndex = "auto";
        activeSticker = null;
      }
    });
  
    // 3) Download button logic (unchanged)
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
  