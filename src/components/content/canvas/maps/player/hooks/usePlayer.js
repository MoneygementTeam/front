import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { SkeletonUtils } from "three-stdlib";
import { usePlayersStore } from "../../../../../../store/PlayersStore";

export const usePlayer = ({ player, position, modelIndex }) => {
  const playerId = player?.id;
  const { me, playerGroundStructuresFloorPlaneCorners } = usePlayersStore();

  const memoizedPosition = useMemo(() => position, []);

  const nicknameRef = useRef(null);
  const playerRef = useRef(null);

  const { scene, materials, animations } = useGLTF(
    (() => {
      switch (modelIndex) {
        case 0:
          return `/models/CubeGuyCharacter.glb`;
        case 1:
          return `/models/CubeWomanCharacter.glb`;
        case 2:
          return `/models/Steve.glb`;
        default:
          return "";
      }
    })()
  );

  const clone = useMemo(() => SkeletonUtils.clone(scene), []);
  const objectMap = useGraph(clone);
  const nodes = objectMap.nodes;

  const [animation, setAnimation] = useState(
    "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
  );
  const { actions } = useAnimations(animations, playerRef);

  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();
    return () => {
      actions[animation]?.fadeOut(0.5);
    };
  }, [actions, animation]);

  useFrame(({ camera }) => {
    if (!player) return;
    if (!playerRef.current) return;
    if (playerRef.current.position.distanceTo(position) > 0.1) {
      const direction = playerRef.current.position
        .clone()
        .sub(position)
        .normalize()
        .multiplyScalar(0.1);
      playerRef.current.position.sub(direction);
      playerRef.current.lookAt(position);

      if (actions.walk) {
        setAnimation("walk");
      } else {
        setAnimation(
          "CharacterArmature|CharacterArmature|CharacterArmature|Run"
        );
      }
    } else {
      setAnimation(
        "CharacterArmature|CharacterArmature|CharacterArmature|Idle"
      );
    }
    if (nicknameRef.current) {
      nicknameRef.current.position.set(
        playerRef.current.position.x,
        playerRef.current.position.y + 3.5,
        playerRef.current.position.z
      );
      nicknameRef.current.lookAt(10000, 10000, 10000);
    }
    if (me?.id === playerId) {
      camera.position.set(
        playerRef.current.position.x + 12,
        playerRef.current.position.y + 12,
        playerRef.current.position.z + 12
      );
      camera.lookAt(playerRef.current.position);
      const currentCloseStructure =
        playerGroundStructuresFloorPlaneCorners.find((structure) => {
          return (
            playerRef.current.position.x < structure.corners[0].x &&
            playerRef.current.position.x > structure.corners[2].x &&
            playerRef.current.position.z < structure.corners[0].z &&
            playerRef.current.position.z > structure.corners[2].z
          );
        });
      if (currentCloseStructure) {
        camera.lookAt(currentCloseStructure.position);
        camera.position.set(
          playerRef.current.position.x + 6,
          playerRef.current.position.y + 6,
          playerRef.current.position.z + 6
        );
      }
    }
  });

  return {
    me,
    nicknameRef,
    playerRef,
    memoizedPosition,
    playerId,
    nodes,
    materials,
  };
};