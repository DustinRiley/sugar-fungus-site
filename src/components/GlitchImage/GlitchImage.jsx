import { useContext, createContext, useState } from "react";
import { useEffect, useRef } from "react";
import { EffectCanvas } from "../../three/glitch";

const sceneContext = createContext();

export function GlitchImageCard({ imgSrc, text }) {
  const { effectCanvas } = useContext(sceneContext);
  console.log(imgSrc)
  const imgRef = useRef(null);
  useEffect(() => {
    if (!imgRef.current || !effectCanvas) return;
    effectCanvas.createMeshItems([imgRef.current]);
  }, [imgRef, effectCanvas]);

  return (
    <div className="image-container">
      <h1>{text}</h1>
      <img ref={imgRef} src={imgSrc} alt="" />
    </div>
  );
}

export function GlitchImageContainer({ children }) {
  const [current, setCurrent] = useState(0);
  const [target, setTarget] = useState(0);
  const [ease, setEase] = useState(0.075);
  const [effectCanvas, setEffectCanvas] = useState();

  useEffect(() => {
    setEffectCanvas(new EffectCanvas());
  }, []);

  console.log({children});
  return (
    <div className="scrollable">
      <div className="container">
        <sceneContext.Provider value={{ current, target, ease, effectCanvas }}>
          {children}
        </sceneContext.Provider>
      </div>
    </div>
  );
}
