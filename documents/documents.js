document.addEventListener("DOMContentLoaded", function () {
  const uploadForm = document.getElementById("uploadForm");
  const fileInput = document.getElementById("fileInput");
  const documentList = document.getElementById("documentList");

  async function fetchDocuments() {
    const res = await fetch("/api/documents");
    const data = await res.json();
    renderDocuments(data);
  }

  function renderDocuments(docs) {
    documentList.innerHTML = "";
    docs.forEach((doc, index) => {
      const item = document.createElement("div");
      item.className = "document-item";
      item.innerHTML = `
        ${index + 1}. ${doc.name}
        <div class="document-actions">
          <a href="/uploads/${doc.storedName}" download>
            <button class="download-btn">Download</button>
          </a>
          <button class="delete-btn" data-id="${doc.storedName}">Delete</button>
        </div>
      `;
      documentList.appendChild(item);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        await fetch(`/api/documents/${id}`, { method: "DELETE" });
        fetchDocuments();
      });
    });
  }

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      uploadForm.reset();
      fetchDocuments();
    } else {
      alert("Upload failed.");
    }
  });

  fetchDocuments();


  
});


