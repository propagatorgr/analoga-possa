import { useEffect, useRef, useState } from "react";
import p5 from "p5";

export default function AnalogousQuantities() {
  const sketchRef = useRef(null);

  const A = 5;
  const B = 5;

  const kRef = 0.1;
  const [k, setK] = useState(kRef);
  const kLive = useRef(kRef);

  const [showWrong, setShowWrong] = useState(false);

  const originX = 80;
  const originY = 420;
  const scale = 40;

  const canvasWidth = 720;
  const canvasHeight = 520;
  const axisLength = 350;

  const maxK = axisLength / (A * scale);

  useEffect(() => {
    let instance;

    const sketch = (p) => {
      let axisProgress = 0;
      let axesAnimated = false;

      p.setup = () => {
        p.createCanvas(canvasWidth, canvasHeight);
      };

      p.draw = () => {
        p.background(245);

        // Animation αξόνων μόνο στην αρχή
        let L;
        if (!axesAnimated) {
          axisProgress = Math.min(axisProgress + 0.02, 1);
          L = axisLength * axisProgress;
          if (axisProgress === 1) axesAnimated = true;
        } else {
          L = axisLength;
        }

        const kNow = kLive.current;

        const refA = kRef * A * scale;
        const refB = kRef * B * scale;
        const kA = kNow * A * scale;
        const kB = kNow * B * scale;

        // Άξονες
        p.stroke(0);
        p.strokeWeight(2);
        p.line(originX, originY, originX + L, originY);
        p.line(originX, originY, originX, originY - L);

        // Ευθεία αναλογίας
        p.stroke(180);
        p.line(originX, originY, originX + L, originY - L);

        if (!axesAnimated) return;

        // Βελάκια
        p.stroke(0);
        p.line(originX + axisLength, originY, originX + axisLength - 10, originY - 5);
        p.line(originX + axisLength, originY, originX + axisLength - 10, originY + 5);
        p.line(originX, originY - axisLength, originX - 5, originY - axisLength + 10);
        p.line(originX, originY - axisLength, originX + 5, originY - axisLength + 10);

        // Α, Β, 0
        p.noStroke();
        p.fill(0);
        p.textSize(14);
        p.text("Α", originX + axisLength + 12, originY + 5);
        p.text("Β", originX - 12, originY - axisLength - 14);
        p.text("0", originX - 12, originY + 14);

        // Σημείο αναφοράς
        p.fill(0);
        p.circle(originX + refA, originY - refB, 7);

        p.stroke(0);
        p.drawingContext.setLineDash([5, 5]);
        p.line(originX + refA, originY, originX + refA, originY - refB);
        p.line(originX, originY - refB, originX + refA, originY - refB);
        p.drawingContext.setLineDash([]);

        // Σωστό σημείο
        if (kNow > kRef) {
          p.stroke(0, 0, 200);
          p.strokeWeight(4);
          p.line(originX + refA, originY, originX + kA, originY);

          p.stroke(0, 150, 0);
          p.line(originX, originY - refB, originX, originY - kB);

          p.stroke(120);
          p.strokeWeight(1.5);
          p.drawingContext.setLineDash([6, 6]);
          p.line(originX + kA, originY, originX + kA, originY - kB);
          p.line(originX, originY - kB, originX + kA, originY - kB);
          p.drawingContext.setLineDash([]);

          p.noStroke();
          p.fill(200, 0, 0);
          p.circle(originX + kA, originY - kB, 9);
        }

        // ❌ ΣΚΟΠΙΜΟ ΛΑΘΟΣ
        if (showWrong) {
          const wrongA = kA;
          const wrongB = B * scale;

          p.stroke(160);
          p.drawingContext.setLineDash([3, 6]);
          p.line(originX + wrongA, originY, originX + wrongA, originY - wrongB);
          p.line(originX, originY - wrongB, originX + wrongA, originY - wrongB);
          p.drawingContext.setLineDash([]);

          p.noStroke();
          p.fill(150, 0, 150);
          p.circle(originX + wrongA, originY - wrongB, 9);
          p.text("Λάθος σημείο", originX + wrongA + 6, originY - wrongB + 14);
        }

        // Λεζάντα λόγου
        const factor = kNow / kRef;
        p.fill(0);
        p.text(
          `Το νέο σημείο είναι ${factor.toFixed(1)} φορές μεγαλύτερο από το αρχικό`,
          80,
          30
        );
      };
    };

    instance = new p5(sketch, sketchRef.current);
    return () => instance.remove();
  }, [showWrong]);

  return (
    <div>
      <label>
        Συντελεστής k: <strong>{k.toFixed(2)}</strong>
      </label>
      <br />
      <input
        type="range"
        min={kRef}
        max={maxK}
        step="0.05"
        value={k}
        onChange={(e) => {
          const v = Number(e.target.value);
          setK(v);
          kLive.current = v;
        }}
        style={{ width: "500px", marginBottom: "10px" }}
      />
      <br />
      <button onClick={() => setShowWrong(!showWrong)}>
        {showWrong ? "Απόκρυψη λάθους" : "Εμφάνιση λάθους"}
      </button>

      <div ref={sketchRef}></div>
    </div>
  );
}