document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const generateBtn = document.getElementById("generate-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const buttonText = generateBtn.querySelector(".button-text");
  const feedbackResult = document.getElementById("feedback-result");
  const copyBtn = document.getElementById("copy-btn"); // Nút sao chép
  const responseTimeDisplay = document.getElementById("response-time"); // Phần hiển thị thời gian phản hồi

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Xóa nội dung feedback cũ trước khi tải dữ liệu mới
    feedbackResult.innerHTML = "";
    responseTimeDisplay.textContent = "";
    // feedbackContainer.style.display = "none";

    // Lấy dữ liệu từ form1
    const confidence = document.getElementById("confidence").value;
    const comprehension = document.getElementById("comprehension").value;
    const comunication = document.getElementById("comunication").value;
    const practice = document.getElementById("practice").value;
    const creativity = document.getElementById("creativity").value;
    const patience = document.getElementById("patience").value;
    const attitude = document.getElementById("attitude").value;
    const focus = document.getElementById("focus").value;
    const independence = document.getElementById("independence").value;
    const apikey = document.getElementById("api-key").value || ""
    

    // Khóa nút, hiển thị spinner và nút hủy
    generateBtn.disabled = true;
    generateBtn.classList.add("loading");
    buttonText.textContent = "Đang tạo...";
    cancelBtn.style.display = "inline-block";

    const feedbackString = Object.values({
      attitude,
      comprehension,
      comunication,
      practice,
      creativity,
      patience,
      focus,
      independence,
      confidence,
    }).join(", ");

    const prompt = `Write a brief and objective performance review for a programming student based on today's lesson. Use the following keywords as references but do not repeat them verbatim: ${feedbackString}. The response should be a short paragraph with exactly 3 natural and grammatically correct sentences in Vietnamese. Address the student using 'thầy' and 'con'. Keep the feedback concise, neutral, and uniquely reworded.`;

    const startTime = new Date().getTime();

    try {
      const response = await fetch("/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          promt: prompt,
          api_key_user: apikey
        }),
      });

      const data = await response.json();
      document.getElementById("feedback-result").innerHTML = formatFeedback(
        data.feedback
      );
      document.getElementById("generated-feedback").style.display = "block";
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("feedback-result").textContent =
        "Có lỗi xảy ra khi tạo nhận xét.";
      document.getElementById("generated-feedback").style.display = "block";
    } finally {
      resetButton();
    }

    const endTime = new Date().getTime();
    const responseTime = endTime - startTime
    responseTimeDisplay.textContent = `Thời gian phản hồi: ${responseTime} ms`;
  });

  // Xử lý khi nhấn "Hủy tạo"
  cancelBtn.addEventListener("click", () => {
    resetButton();
  });
  document.getElementById("go-to-class-btn").addEventListener("click", () => {
    console.log("Button clicked!"); // Kiểm tra xem sự kiện click có được kích hoạt hay không
    window.location.href = "/class"; // Chuyển hướng sau 500ms
  });

  // Xử lý khi nhấn "Copy"
  copyBtn.addEventListener("click", () => {
    const feedbackText = feedbackResult.innerText || feedbackResult.textContent; // Lấy nội dung feedback
    if (feedbackText) {
      // Sao chép nội dung vào bộ nhớ tạm
      navigator.clipboard
        .writeText(feedbackText)
        .then(() => {
          alert("Đã sao chép vào bộ nhớ tạm!");
        })
        .catch((err) => {
          console.error("Không thể sao chép: ", err);
        });
    } else {
      alert("Chưa có phản hồi để sao chép!");
    }
  });

  function resetButton() {
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
