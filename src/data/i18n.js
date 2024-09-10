import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
  en: {
    translation: {
      opening: {
        whats_your_id: "what is your id ?",
        button_go: "it's good",
        whats_your_nickname: "what is your nickname ?",
        button_back: "go back",
        choose_your_character: "choose your character",
        button_another: "another character",
      },
      quizModal: {
        title: "Financial Crisis Adventure!",
        invest_option1: "Commodities",
        invest_option2: "Stocks",
        invest_option3: "Real Estate",
        invest_option4: "Cryptocurrency"
      },
      monster: {
        dino: "Quiz Dinosaur",
        dino_say: "Firenancial breath!!! ",
        zombie: "Zombie",
        zombie_say: "wanna go home,,,,,"
      },
      reward: {
        new_monster_reveal:"New Monster Revealed",
        got_item: "you just got {{item}}!!"
      }
    }
  },
  ko: {
    translation: {
      opening: {
        whats_your_id: "아이디를 입력해주세요",
        button_go: "이대로 진행할래요",
        whats_your_nickname: "게임 내에서 사용할 내 이름이예요",
        button_back: "이전으로 돌아갈래요",
        choose_your_character: "게임 내에서 사용할 내 아바타를 고를시간이에요",
        button_another: "다른 캐릭터도 볼래요"
      },
      quizModal: {
        title: "경제 위기 모험!",
        invest_option1: "원자재",
        invest_option2: "주식",
        invest_option3: "부동산",
        invest_option4: "코인"
      },
      monster: {
        dino: "퀴즈곤뇽",
        dino_say: "개천에서 용나고 싶니?? 크앙 ",
        zombie: "야근좀비",
        zombie_say: "으으 오늘도 야근이라니...."
      },
      reward: {
        new_monster_reveal:"새로운 몬스터 발견",
        got_item: "{{item}}을(를) 얻었습니다!!"
      }
    }
  }
};

export const initI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "en",
      detection: {
        order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      },
      interpolation: {
        escapeValue: false
      }
    });
};

export default i18n;