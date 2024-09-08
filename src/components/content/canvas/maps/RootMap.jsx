import React, { useEffect, useRef } from "react";
import { GroundElements } from "./structures/ground";
import { usePlayersStore } from "../../../../store/PlayersAtom"; // Zustand 상태 가져오기
import { CharacterInit } from "../../lobby/CharacterInit";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Player } from "./player/Player";
import { Line } from "@react-three/drei";

export const RootMap = () => {
  const { characterSelectFinished, players, playerGroundStructuresFloorPlaneCorners } = usePlayersStore(); // Zustand에서 상태 사용
  const camera = useThree((three) => three.camera);
  const controls = useRef(null);

  useEffect(() => {
    if (!controls.current) return;
    camera.position.set(14, 14, 14);
    controls.current.target.set(0, 0, 0);
  }, [camera.position]);

  return (
    <>
      {!characterSelectFinished ? (
        <CharacterInit />
      ) : (
        <>
          <GroundElements />
          {playerGroundStructuresFloorPlaneCorners?.map((corner) => {
            return (
              <Line
                key={corner.name}
                color="red"
                points={corner.corners.map((c) => [c.x, 0.01, c.z])}
              />
            );
          })}
          {players.map((player) => {
            return (
              <Player
                key={player.id}
                player={player}
                position={
                  new THREE.Vector3(
                    player.position[0],
                    player.position[1],
                    player.position[2]
                  )
                }
              />
            );
          })}
        </>
      )}
    </>
  );
};
