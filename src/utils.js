export const isValidText = (text) => {
  return Boolean(text && text.trim() !== "");
};

export const calculateMinimapPosition = (originalPosition) => {
  return {
    //  초기위치가 미니맵상 중심점이므로,
    // 점 위치(4 * 현재 캐릭터 위치의 x 좌표) - 점 자체 의 width의 절반
    x: 4 * originalPosition.x - 5,
    // 점 위치(4 * 현재 캐릭터 위치의 z 좌표) - 점 자체 의 height의 절반
    y: 4 * originalPosition.z - 5,
  };
};

export const calculateThreePosition = ({ clientX, clientY }) => {
  return {
    x: (clientX / window.innerWidth) * 2 - 1,
    y: -(clientY / window.innerHeight) * 2 + 1,
  };
};

export const getClientPosition = ({ position, camera }) => {
  position.project(camera);

  // 스크린 좌표를 클라이언트 좌표로 변환
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  const x = position.x * widthHalf + widthHalf;
  const y = -(position.y * heightHalf) + heightHalf;

  return { x, y };
};

export const getMyRoomObjects = (scene, currentObjectName) => {
  const myRoomObjects = [];
  scene.children.forEach((child) =>
    child.traverse((obj) => {
      if (obj.name.includes("my-room")) {
        const myRoomObject = {
          name: obj.name,
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
          authorNickname: obj.userData.authorNickname,
          text: obj.userData.text,
          timestamp: obj.userData.timestamp,
        };
        myRoomObjects.push(myRoomObject);
      }
    })
  );
  return myRoomObjects.filter((obj) => obj.name !== currentObjectName);
};
