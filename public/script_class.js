document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("feedback-form");
  const generateBtn = document.getElementById("generate-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const buttonText = generateBtn.querySelector(".button-text");
  const feedbackResult = document.getElementById("feedback-result");
  const copyBtn = document.getElementById("copy-btn"); // Nút sao chép

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Xóa nội dung feedback cũ trước khi tải dữ liệu mới
    feedbackResult.innerHTML = "";
    // feedbackContainer.style.display = "none";

    // Lấy dữ liệu từ form1
    const attitude = document.getElementById("attitude").value;
    const focus = document.getElementById("focus").value;
    const understanding = document.getElementById("understanding").value;
    const practice = document.getElementById("practice").value;
    const comunicate = document.getElementById("comunicate").value;
    const performance = document.getElementById("performance").value;

    // Khóa nút, hiển thị spinner và nút hủy
    generateBtn.disabled = true;
    generateBtn.classList.add("loading");
    buttonText.textContent = "Đang tạo...";
    cancelBtn.style.display = "inline-block";

    const feedbackString = Object.values({
        attitude,
        focus,
        understanding,
        practice,
        comunicate,
        performance
    }).join(", ");

    const prompt = `Write a concise and well-structured general comment as a programming teacher about today's class session, focusing only on students' overall performance. Use the following keywords as references but do not repeat them exactly: ${feedbackString}. The response should include a title and a short paragraph with four grammatically correct and natural-sounding sentences in Vietnamese. Address the students using 'thầy' and 'các bạn' or 'cả lớp'. Ensure the feedback is objective, does not express personal emotions, and is creatively rewritten to maintain uniqueness.`

    try {
      const response = await fetch("/generate-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promt: prompt })
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
  });
    // Xử lý khi nhấn "Copy"
    copyBtn.addEventListener("click", () => {
      const feedbackText = feedbackResult.innerText || feedbackResult.textContent;  // Lấy nội dung feedback
      if (feedbackText) {
        // Sao chép nội dung vào bộ nhớ tạm
        navigator.clipboard.writeText(feedbackText).then(() => {
          alert("Đã sao chép vào bộ nhớ tạm!");
        }).catch((err) => {
          console.error("Không thể sao chép: ", err);
        });
      } else {
        alert("Chưa có phản hồi để sao chép!");
      }
    });

  // Xử lý khi nhấn "Hủy tạo"
  cancelBtn.addEventListener("click", () => {
    resetButton();
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
