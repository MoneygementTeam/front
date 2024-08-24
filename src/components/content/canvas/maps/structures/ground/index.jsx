import { Floor } from "./elements/Floor";
import { Swing } from "./elements/Swing";
import { JungleGym } from "./elements/JungleGym";
import { Tree } from "./elements/Tree";
import { PineTrees } from "./elements/PineTrees";
import { Dinosaur } from "./elements/npc/Dinosaur";
import { Zombie } from "./elements/npc/Zombie";
import { ShibaInu } from "./elements/npc/Sihibainu";
import { WoodChest } from "./elements/WoodChest";
import { Key } from "./elements/Key";
import { Steak } from "./elements/Steak";
import { Cloud, Clouds } from "@react-three/drei";

export const GroundElements = () => {
  return (
    <>
      <Floor />

      <Dinosaur />
      <Zombie />
      <ShibaInu />

      <WoodChest />
      <Key />
      <Steak />

      <Swing />
      <Clouds>
        <Cloud
          segments={100}
          volume={5}
          scale={2}
          concentrate={"random"}
          opacity={0.5}
          fade={10}
          speed={2}
          position={[-20, 0, -20]}
        />
        <Cloud
          segments={100}
          volume={5}
          scale={2}
          concentrate={"random"}
          opacity={0.1}
          fade={10}
          speed={2}
          position={[20, 0, -20]}
          color={"skyblue"}
        />
      </Clouds>
    </>
  );
};
