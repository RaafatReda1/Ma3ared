import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Center } from "@react-three/drei";
import { Suspense } from "react";
import { PocketWatch } from "./Components/PocketWatch/PocketWatch";
import PocketWatchReactComponent from "./Components/PocketWatch/PocketWatchReactComponent";
import "./App.css";
import './index.css';
export default function App() {
  return (
    <>
      <PocketWatchReactComponent/>
    </>
  );
}
