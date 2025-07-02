//import ListGroup from "./components/ListGroup"

//import Alert from "./components/Alert"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./Layout";
import { Home } from "./pages/Home";
import { AnimeOpener } from "./pages/AnimeOpener";

import 'bootstrap/dist/css/bootstrap.min.css';

import "./index.css";
import "./assets/fonts/NotoSans/NotoSans-Bold.ttf";

function App() {
  // const items = [
  //   'Coke',
  //   'Pepsi',
  //   'Sprite',
  //   'Dr Pepper'
  // ]

  // const handleSelectItem = (item: string) => {
  //   console.log(item)
  // }

  // return <div><ListGroup items={items} heading="Sodas" onSelectItem={handleSelectItem}/></div>

  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/anime-opener" element={<AnimeOpener/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
