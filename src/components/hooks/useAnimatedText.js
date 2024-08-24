import { useEffect, useState } from "react";

export const useAnimatedText = (text, once, callback) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(displayText + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 150); // 한 글자씩 나타나는 속도를 조절할 수 있습니다.

      return () => clearTimeout(timeout);
    } else if (!once) {
      // 텍스트가 모두 나타난 후에 currentIndex를 초기화하여 애니메이션을 반복합니다.
      setCurrentIndex(0);
      setDisplayText("");
    } else {
      callback?.();
    }
  }, [callback, currentIndex, displayText, once, text]);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayText("");
  }, [text]);

  return { displayText };
};
