import fetch from 'node-fetch';

// 生成20条猫咪百科数据
const encyclopedias = [
  {
    scientific_name: "Felis catus",
    breed: "孟买猫",
    characteristics: "孟买猫是一种黑色的短毛猫，体型中等，肌肉发达，眼睛呈金黄色或铜色。",
    habits: "孟买猫性格温和，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "孟买猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "孟买猫聪明活泼，喜欢玩耍，对主人忠诚，有时会表现出猫的独立性。",
    fun_facts: "孟买猫是由美国育种学家在1950年代培育出来的，旨在创造一种类似黑豹的家猫。",
    images: ["bombay1.jpg", "bombay2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "波斯猫",
    characteristics: "波斯猫是一种长毛猫，体型较大，头部圆润，眼睛大而圆，毛发浓密柔软。",
    habits: "波斯猫性格温顺，喜欢安静的环境，不太喜欢剧烈运动，适合室内生活。",
    care_guide: "波斯猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "波斯猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "波斯猫是世界上最古老的猫种之一，起源于伊朗（古代波斯）。",
    images: ["persian1.jpg", "persian2.jpg"],
    rarity: "普通"
  },
  {
    scientific_name: "Felis catus",
    breed: "暹罗猫",
    characteristics: "暹罗猫是一种短毛猫，体型修长，头部呈楔形，眼睛呈蓝色，毛发短而光滑。",
    habits: "暹罗猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "暹罗猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "暹罗猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "暹罗猫起源于泰国（古代暹罗），是泰国皇室的宠物。",
    images: ["siamese1.jpg", "siamese2.jpg"],
    rarity: "普通"
  },
  {
    scientific_name: "Felis catus",
    breed: "英短猫",
    characteristics: "英短猫是一种短毛猫，体型圆润，头部大而圆，眼睛大而圆，毛发短而浓密。",
    habits: "英短猫性格温和，喜欢安静的环境，不太喜欢剧烈运动，适合室内生活。",
    care_guide: "英短猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "英短猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "英短猫起源于英国，是英国最古老的猫种之一。",
    images: ["british1.jpg", "british2.jpg"],
    rarity: "普通"
  },
  {
    scientific_name: "Felis catus",
    breed: "美短猫",
    characteristics: "美短猫是一种短毛猫，体型修长，头部呈楔形，眼睛大而圆，毛发短而光滑。",
    habits: "美短猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "美短猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "美短猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "美短猫起源于美国，是美国最受欢迎的猫种之一。",
    images: ["american1.jpg", "american2.jpg"],
    rarity: "普通"
  },
  {
    scientific_name: "Felis catus",
    breed: "布偶猫",
    characteristics: "布偶猫是一种长毛猫，体型较大，头部圆润，眼睛大而圆，毛发浓密柔软。",
    habits: "布偶猫性格温顺，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "布偶猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "布偶猫性格温和，喜欢被人抱，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "布偶猫起源于美国，是1960年代由一位名为Ann Baker的育种学家培育出来的。",
    images: ["ragdoll1.jpg", "ragdoll2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "缅因猫",
    characteristics: "缅因猫是一种长毛猫，体型较大，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "缅因猫性格温和，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "缅因猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "缅因猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "缅因猫起源于美国缅因州，是美国最大的猫种之一。",
    images: ["maine1.jpg", "maine2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "苏格兰折耳猫",
    characteristics: "苏格兰折耳猫是一种短毛猫，体型中等，头部圆润，耳朵向前折叠，眼睛大而圆。",
    habits: "苏格兰折耳猫性格温和，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "苏格兰折耳猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "苏格兰折耳猫性格温顺，喜欢被人抱，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "苏格兰折耳猫起源于苏格兰，是1960年代由一位名为William Ross的牧羊人发现的。",
    images: ["scottish1.jpg", "scottish2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "斯芬克斯猫",
    characteristics: "斯芬克斯猫是一种无毛猫，体型中等，头部呈楔形，眼睛大而圆，皮肤光滑。",
    habits: "斯芬克斯猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "斯芬克斯猫需要定期洗澡，保持皮肤清洁，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "斯芬克斯猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "斯芬克斯猫起源于加拿大，是1960年代由一位名为Ridyadh Bawa的育种学家培育出来的。",
    images: ["sphynx1.jpg", "sphynx2.jpg"],
    rarity: "极稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "金吉拉猫",
    characteristics: "金吉拉猫是一种长毛猫，体型中等，头部圆润，眼睛大而圆，毛发浓密柔软。",
    habits: "金吉拉猫性格温顺，喜欢安静的环境，不太喜欢剧烈运动，适合室内生活。",
    care_guide: "金吉拉猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "金吉拉猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "金吉拉猫起源于英国，是19世纪末由一位名为Augustus Merritt的育种学家培育出来的。",
    images: ["chinchilla1.jpg", "chinchilla2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "孟加拉猫",
    characteristics: "孟加拉猫是一种短毛猫，体型中等，头部呈楔形，眼睛大而圆，毛发短而光滑，带有豹纹。",
    habits: "孟加拉猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "孟加拉猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "孟加拉猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "孟加拉猫起源于美国，是1980年代由一位名为Jean Mill的育种学家培育出来的，旨在创造一种类似豹的家猫。",
    images: ["bengal1.jpg", "bengal2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "埃及猫",
    characteristics: "埃及猫是一种短毛猫，体型中等，头部呈楔形，眼睛大而圆，毛发短而光滑，带有斑点。",
    habits: "埃及猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "埃及猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "埃及猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "埃及猫起源于埃及，是世界上最古老的猫种之一，在古埃及被视为神圣的动物。",
    images: ["egyptian1.jpg", "egyptian2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "土耳其梵猫",
    characteristics: "土耳其梵猫是一种长毛猫，体型较大，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "土耳其梵猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "土耳其梵猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "土耳其梵猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "土耳其梵猫起源于土耳其，是1950年代由一位名为Laura Lushington的英国女士发现的。",
    images: ["van1.jpg", "van2.jpg"],
    rarity: "极稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "西伯利亚猫",
    characteristics: "西伯利亚猫是一种长毛猫，体型较大，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "西伯利亚猫性格温和，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "西伯利亚猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "西伯利亚猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "西伯利亚猫起源于俄罗斯西伯利亚地区，是俄罗斯最古老的猫种之一。",
    images: ["siberian1.jpg", "siberian2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "巴厘猫",
    characteristics: "巴厘猫是一种长毛猫，体型中等，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "巴厘猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "巴厘猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "巴厘猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "巴厘猫起源于美国，是1940年代由一位名为Helen Smith的育种学家培育出来的，是暹罗猫的长毛变种。",
    images: ["balinese1.jpg", "balinese2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "伯曼猫",
    characteristics: "伯曼猫是一种长毛猫，体型较大，头部圆润，眼睛大而圆，毛发浓密柔软。",
    habits: "伯曼猫性格温顺，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "伯曼猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "伯曼猫性格温和，喜欢被人抱，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "伯曼猫起源于缅甸（古代 Burma），是一种神圣的猫种，在缅甸被视为寺庙的守护者。",
    images: ["birman1.jpg", "birman2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "东方短毛猫",
    characteristics: "东方短毛猫是一种短毛猫，体型修长，头部呈楔形，眼睛大而圆，毛发短而光滑。",
    habits: "东方短毛猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "东方短毛猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "东方短毛猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "东方短毛猫起源于英国，是1950年代由一位名为Brian Stirling-Webb的育种学家培育出来的，是暹罗猫的变种。",
    images: ["oriental1.jpg", "oriental2.jpg"],
    rarity: "普通"
  },
  {
    scientific_name: "Felis catus",
    breed: "日本短尾猫",
    characteristics: "日本短尾猫是一种短毛猫，体型中等，头部圆润，尾巴短而粗，眼睛大而圆。",
    habits: "日本短尾猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "日本短尾猫需要定期梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "日本短尾猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "日本短尾猫起源于日本，是日本最古老的猫种之一，在日本被视为幸运的象征。",
    images: ["japanese1.jpg", "japanese2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "挪威森林猫",
    characteristics: "挪威森林猫是一种长毛猫，体型较大，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "挪威森林猫性格温和，喜欢与人互动，适应性强，适合室内生活。",
    care_guide: "挪威森林猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "挪威森林猫性格独立，有时会表现出高傲的态度，但对主人忠诚。",
    fun_facts: "挪威森林猫起源于挪威，是挪威最古老的猫种之一，在挪威的民间传说中被视为精灵的化身。",
    images: ["norwegian1.jpg", "norwegian2.jpg"],
    rarity: "稀有"
  },
  {
    scientific_name: "Felis catus",
    breed: "索马里猫",
    characteristics: "索马里猫是一种长毛猫，体型中等，头部呈楔形，眼睛大而圆，毛发浓密柔软。",
    habits: "索马里猫性格活泼，喜欢与人互动，好奇心强，适合室内生活。",
    care_guide: "索马里猫需要每天梳理毛发，保持口腔卫生，提供均衡的饮食，定期接种疫苗。",
    behavior_analysis: "索马里猫聪明好动，喜欢玩耍，对主人忠诚，有时会表现出粘人的态度。",
    fun_facts: "索马里猫起源于美国，是1960年代由一位名为Billie Gerst的育种学家培育出来的，是阿比西尼亚猫的长毛变种。",
    images: ["somali1.jpg", "somali2.jpg"],
    rarity: "稀有"
  }
];

// JWT token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc3MTk5ODUwMSwiZXhwIjoxNzcyNjAzMzAxfQ.ab6yAmLfYD5fSlrbggTOwbshNdKaz6ocvYjhzVMS0IM";

// 添加数据到encyclopedias表
async function addEncyclopedias() {
  try {
    for (let i = 0; i < encyclopedias.length; i++) {
      const encyclopedia = encyclopedias[i];
      console.log(`添加第 ${i + 1} 条数据：${encyclopedia.breed}`);
      
      const response = await fetch('http://localhost:3000/api/encyclopedias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(encyclopedia)
      });
      
      const data = await response.json();
      console.log(`添加结果：${data.id ? '成功' : '失败'}`);
      
      // 等待1秒，避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('所有数据添加完成！');
  } catch (error) {
    console.error('添加数据时出错：', error);
  }
}

// 执行添加操作
addEncyclopedias();
