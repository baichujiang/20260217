// frontend/src/data/mockBadgesData.ts

export interface Badge {
    id: string;
    name: string;
    category: string;
    icon: string;
    unlocked: boolean;
    currentProgress: number;
    requiredProgress: number;
  }
  
  const mockBadges: Badge[] = [
    {
      id: "growth-10",
      name: "成长新芽",
      category: "成长类",
      icon: "/icons/growth1.png",
      unlocked: true,
      currentProgress: 10,
      requiredProgress: 10,
    },
    {
      id: "growth-100",
      name: "茁壮成长",
      category: "成长类",
      icon: "/icons/growth2.png",
      unlocked: false,
      currentProgress: 40,
      requiredProgress: 100,
    },
    {
      id: "water-10",
      name: "初级园丁",
      category: "浇水类",
      icon: "/icons/water1.png",
      unlocked: true,
      currentProgress: 10,
      requiredProgress: 10,
    },
    {
      id: "water-100",
      name: "资深园丁",
      category: "浇水类",
      icon: "/icons/water2.png",
      unlocked: false,
      currentProgress: 65,
      requiredProgress: 100,
    },
    {
      id: "daily-5",
      name: "每日打卡",
      category: "每日行为类",
      icon: "/icons/daily1.png",
      unlocked: false,
      currentProgress: 2,
      requiredProgress: 5,
    },
    {
      id: "social-share",
      name: "社交传播者",
      category: "社交类",
      icon: "/icons/share.png",
      unlocked: false,
      currentProgress: 0,
      requiredProgress: 1,
    },
    {
      id: "review-10",
      name: "评论达人",
      category: "互动类",
      icon: "/icons/review.png",
      unlocked: false,
      currentProgress: 6,
      requiredProgress: 10,
    },
    {
      id: "surprise",
      name: "隐藏成就",
      category: "探索类",
      icon: "/icons/hidden.png",
      unlocked: false,
      currentProgress: 0,
      requiredProgress: 1,
    },
  ];
  
  export default mockBadges;
  