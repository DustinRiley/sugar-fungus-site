import { useContext, createContext, useState, useCallback } from "react";
import { useEffect, useRef } from "react";
import { EffectCanvas } from "../../three/glitch";

const sceneContext = createContext();

export function GlitchImageCard({ imgSrc, text, textLocation, textColor }) {
  const { effectCanvas } = useContext(sceneContext);
  const [meshItem, setMeshItem] = useState()
  console.log(imgSrc)
  const imgRef = useRef(null);
  useEffect(() => {
    if (!imgRef.current || !effectCanvas) return;
    const meshItemClass = effectCanvas.createMeshItem(imgRef.current);
    setMeshItem(meshItemClass)
  }, [imgRef, effectCanvas]);

  const handleMouseMove = useCallback((e)=> {
    if(!meshItem) return;
    console.log({x: e.movementX, y: e.movementY});
    meshItem.setMouseXY(e.movementX, e.movementY);
    meshItem.setMouseRenderFunction(true);
  },[meshItem])


  const handleMouseOver = useCallback((e)=> {
    console.log('here', e);
    if(!meshItem) return;
    meshItem.setMouseRenderFunction(true);
  },[meshItem])


  const handleMouseOut = useCallback((e)=> {
    if(!meshItem) return;
    meshItem.setMouseRenderFunction(false);
  },[meshItem])

  return (
    <div className="image-container">
      <h1>{text}</h1>
      <img onMouseOver={handleMouseOver} onMouseLeave={handleMouseOut} onMouseMove={handleMouseMove} ref={imgRef} src={imgSrc} alt="" />
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
