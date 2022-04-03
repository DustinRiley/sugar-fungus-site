import logo from './logo.svg';
import './App.css';
import img1 from './images/single.jpg'
import img2 from './images/final.png'
import img3 from './images/bw.png'
import img4 from './images/4.jpeg'
import {GlitchImageCard, GlitchImageContainer} from './components/GlitchImage'

function App() {

  return (
    <>
      <head>
        <meta charset="UTF-8" />
        <link rel="stylesheet" href="style.css" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        <main>
              <GlitchImageContainer>
                <GlitchImageCard imgSrc={img1} text="MONOCHROME"/>
                <GlitchImageCard imgSrc={img2} text="STREET"/>
                <GlitchImageCard imgSrc={img3} text="ABSTRACT"/>
                <GlitchImageCard imgSrc={img4} text="ROSE"/>
              </GlitchImageContainer>
        </main>
      </body>
    </>
  );
}

export default App;
