document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const generateBtn = document.getElementById("generate-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const buttonText = generateBtn.querySelector(".button-text");
  const feedbackResult = document.getElementById("feedback-result");
  const copyBtn = document.getElementById("copy-btn"); // Nút sao chép
  const apiKeyInput = document.getElementById("api-key");
  const responseTimeDisplay = document.getElementById("response-time"); // Phần hiển thị thời gian phản hồi
  const savedApiKey = localStorage.getItem("api-key-storage");
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey;
  }

  let isCancelled = false;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Xóa nội dung feedback cũ trước khi tải dữ liệu mới
    feedbackResult.innerHTML = "";
    responseTimeDisplay.textContent = "";
    document.getElementById("copied").textContent = "";
    // feedbackContainer.style.display = "none";

    // Lấy dữ liệu từ form1
    const confidence = document.getElementById("confidence");
    const comprehension = document.getElementById("comprehension");
    const comunication = document.getElementById("comunication");
    const practice = document.getElementById("practice");
    const creativity = document.getElementById("creativity");
    const patience = document.getElementById("patience");
    const attitude = document.getElementById("attitude");
    const focus = document.getElementById("focus");
    const independence = document.getElementById("independence");
    const apikey = document.getElementById("api-key").value || "";

    if (apikey) {
      localStorage.setItem("api-key-storage", apikey);
    }

    // Khóa nút, hiển thị spinner và nút hủy
    generateBtn.disabled = true;
    apiKeyInput.disabled = true;
    generateBtn.classList.add("loading");
    buttonText.textContent = "Đang tạo...";
    cancelBtn.style.display = "inline-block";

    const feedbackObject = {
      attitude: document.getElementById("attitude").value,
      comprehension: document.getElementById("comprehension").value,
      comunication: document.getElementById("comunication").value,
      practice: document.getElementById("practice").value,
      creativity: document.getElementById("creativity").value,
      patience: document.getElementById("patience").value,
      focus: document.getElementById("focus").value,
      independence: document.getElementById("independence").value,
      confidence: document.getElementById("confidence").value,
    };

    const feedbackString = Object.entries(feedbackObject).filter(([_,value]) => value!=="").map(([key,value])=> `${key}:${value}`).join(", ")

    const prompt = `Write a details and objective performance review for a programming student on lesson based on the following evaluation criteria, each rated on a scale from 1 to 5: ${feedbackString}. The response should be a short paragraph with 3 natural and grammatically correct sentences in Vietnamese. Address the student using 'thầy' and 'con'. Keep the feedback concise, neutral, and uniquely reworded.`;
    console.log(prompt);
    const startTime = new Date().getTime();

    try {
      const response = await fetch("/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promt: prompt,
          api_key_user: apikey,
        }),
      });

      const data = await response.json();

      if (isCancelled == false) {
        document.getElementById("feedback-result").innerHTML = formatFeedback(
          data.feedback
        );
        document.getElementById("generated-feedback").style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("feedback-result").textContent =
        "Có lỗi xảy ra khi tạo nhận xét.";
      document.getElementById("generated-feedback").style.display = "block";
    } finally {
      resetButton();
    }

    const endTime = new Date().getTime();
    const responseTime = endTime - startTime;
    if (!isCancelled)
      responseTimeDisplay.textContent = `Thời gian phản hồi: ${responseTime} ms`;
  });

  // Xử lý khi nhấn "Hủy tạo"
  cancelBtn.addEventListener("click", () => {
    isCancelled = true;
    resetButton();
  });

  document.getElementById("go-to-class-btn").addEventListener("click", () => {
    window.location.href = "/class"; // Chuyển hướng sau 500ms
  });

  // Xử lý khi nhấn "Copy"
  copyBtn.addEventListener("click", () => {
    const feedbackText = feedbackResult.innerText || feedbackResult.textContent; // Lấy nội dung feedback
    if (navigator.clipboard) {
      if (feedbackText) {
        // Sao chép nội dung vào bộ nhớ tạm
        navigator.clipboard
          .writeText(feedbackText)
          .then(() => {
            // alert("Đã sao chép vào bộ nhớ tạm!");
            document.getElementById("copied").textContent = "Copied";
            document.getElementById("copied").style.color = "green";
          })
          .catch((err) => {
            document.getElementById("copied").textContent = "Error copied";
            copiedStatusElement.style.color = "red";
            console.error("Không thể sao chép: ", err);
          });
      } else {
        document.getElementById("copied").textContent = "Nothing to copy";
        document.getElementById("copied").style.color = "orange"; // Thông báo không có nội dung
        // alert("Chưa có phản hồi để sao chép!");
      }
    }else{
      document.getElementById("copied").textContent = "Error copied";
      document.getElementById("copied").style.color = "red"; // Thông báo không có nội dung
    }
  });
  function resetButton() {
    apiKeyInput.disabled = false;
    generateBtn.disabled = false;
    generateBtn.classList.remove("loading");
    buttonText.textContent = "Generate Feedback";
    cancelBtn.style.display = "none";
  }

  function formatFeedback(feedback) {
    return feedback
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }
});
