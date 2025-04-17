let classifier, video, flippedVideo, label = "";
let p5ModelURL = './facemask_detect/';

function preload() {
  classifier = ml5.imageClassifier(p5ModelURL + 'model.json');
}

function setup() {
  let canvas = createCanvas(320, 260);
  canvas.parent("webcam-container"); // or "p5-container" if you want separate view

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  classifyVideo();
}

function draw() {
  background(0);
  image(flippedVideo, 0, 0);

  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 2, height - 4);
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
  flippedVideo.remove();
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  classifyVideo();
}
