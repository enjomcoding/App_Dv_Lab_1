const tfURL = "./models/facemask_detect (5)/";

let tfModel, tfWebcam, tfMaxPredictions;

async function initTFJS() {
  const modelURL = tfURL + "model.json";
  const metadataURL = tfURL + "metadata.json";

  try {
    console.log("Loading model...");
    tfModel = await tmImage.load(modelURL, metadataURL);
    tfMaxPredictions = tfModel.getTotalClasses();
    console.log("Model loaded successfully!");
  } catch (error) {
    console.error("Error loading model:", error);
    document.getElementById("status-text").innerHTML = "Model failed";
    return;
  }

  tfWebcam = new tmImage.Webcam(785, 873, true);
  try {
    await tfWebcam.setup({ facingMode: "user" });
    console.log("Webcam setup successful!");
  } catch (err) {
    document.getElementById("status-text").innerHTML = "Webcam access denied";
    console.error("Webcam error:", err);
    return;
  }

  await tfWebcam.play();
  window.requestAnimationFrame(loopTFJS);

  document.getElementById("webcam-container").appendChild(tfWebcam.canvas);
  document.getElementById("status-text").innerHTML = "Detecting...";
}

async function loopTFJS() {
  tfWebcam.update();
  await predictTFJS();
  window.requestAnimationFrame(loopTFJS);
}

async function predictTFJS() {
  try {
    const prediction = await tfModel.predict(tfWebcam.canvas);

    if (!prediction || prediction.length === 0) {
      console.error("No prediction result!");
      return;
    }

    const best = prediction.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);

    let color = "white"; // default

    if (best.className === "correct") {
      color = "green";
    } else if (best.className === "incorrect") {
      color = "orange";
    } else if (best.className === "not wearing") {
      color = "red";
    }

    document.getElementById("status-text").style.color = color;
    document.getElementById("status-text").innerHTML = `
      ${best.className} <br>
      Confidence: ${(best.probability * 100).toFixed(2)}%
    `;

  } catch (error) {
    console.error("Error during prediction:", error);
    document.getElementById("status-text").innerHTML = "Prediction error";
  }
}

initTFJS();
