// src/services/cmsApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { LiveStreamData } from '@/src/types/presenter';

// Constants
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const CACHE_KEY = 'livestreamData';

// Helper: Determine Bible/Kids Perspective presenter based on week
const getBibleKidsPerspectivePresenter = (): string => {
  const now = new Date();
  const weekNumber = Math.floor((now.getDate() - 1) / 7) + 1;
  const isKidsPerspective = weekNumber === 2; // 2nd week of the month
  
  return isKidsPerspective ? 'Zanele Zama' : (weekNumber % 2 === 1 ? 'Zanele Zama' : 'Dereck Viriri');
};

// Mock data for offline/development use
const MOCK_DATA = {
  presenters: {
    'Thamsanqa Tshuma': {
      name: 'Thamsanqa Tshuma',
      bio: 'Thamsanqa Tshuma believes that at the heart of life are relationships—everything else is secondary. As the host of Valley of Praise (airing weekdays from 3:00 AM to 6:00 AM), he explores the importance of personal, spiritual, and professional connections every day. His mission is to inspire listeners to view each day not just as a pursuit of success but as a chance to love others as themselves. For Thamsanqa, each day is a divine opportunity to serve God through how we relate to those around us.',
      image: require('@/src/assets/AWRPresenters/Thamsanqa Tshuma.png')
    },
    'Dereck Viriri': {
      name: 'Dereck Viriri',
      bio: 'Dereck Viriri is a devoted Christian radio enthusiast, passionate about sharing biblical principles with everyone, particularly the youth. His dedication to promoting personal growth stems from his belief in preparing individuals for heaven. Outside of his professional life, Dereck is a loving husband who places great importance on family and community. His favorite scripture, Psalms 119:130 (ERV), resonates deeply with him: "As people understand your word, it brings light to their lives. Your word makes even simple people wise."',
      image: require('@/src/assets/AWRPresenters/Dereck Viriri.png')
    },
    'Zanele Zama': {
      name: 'Zanele Zama',
      bio: 'Zanele Zama is a seasoned media practitioner with over 13 years of experience in reporting, producing, show presenting, and digital marketing. As a mother of three and a devoted wife, she enjoys cooking and watching drama series in her downtime. Her go-to scripture during life\'s ups and downs is 1 Corinthians 2:9: "No eye has seen, no ear has heard, and no human mind has conceived the things God has prepared for those who love him." This verse grounds her both professionally and personally.',
      image: require('@/src/assets/AWRPresenters/Zanele Zama.png')
    },
    'Naye Lupondwana': {
      name: 'Naye Lupondwana',
      bio: 'Bio for Naye Lupondwana',
      image: require('@/src/assets/AWRPresenters/Naye Lupondwana.png')
    },
    'Zama Malote': {
      name: 'Zama Malote',
      bio: 'Zama Malote has a deep passion for debates, documentaries, and reading, particularly religious and political material. One of his favorite scriptures is Psalm 37:25, which says, "I was young and now I am old, yet I have never seen the righteous forsaken or their children begging for bread." This verse resonates deeply with his faith and perspective on life. His love for knowledge and meaningful conversation reflects his commitment to personal and spiritual growth.',
      image: require('@/src/assets/AWRPresenters/Zama Malote.png')
    },
    'Thapelo Moloi': {
      name: 'Thapelo Moloi',
      bio: 'Thapelo Moloi is a passionate Christian and avid reader, known for his talents in radio and public speaking. He is deeply committed to holistic people development, using platforms like radio, TV, and public speaking to inspire and uplift others. His areas of interest include Christianity, business, investments, finance, and economics. Thapelo\'s favorite scripture is Matthew 25:23, which reads, "Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master."',
      image: require('@/src/assets/AWRPresenters/Thapelo Moloi.png')
    },
    'Millicent Ndiweni': {
      name: 'Millicent Ndiweni',
      bio: 'Millicent Ndiweni is a Talk Radio Producer and Presenter at Adventist World Radio, passionate about education, authenticity, and affirming others positively. Though still young and evolving in her views, she prays to reflect the kindness and grace of Jesus in all her interactions. With a wide range of interests, she brings skills in speaking, critical thinking, research, teaching, writing, and vegetarian cooking, all wrapped in her warm and smiley personality. If you\'re looking for a dynamic speaker or creative thinker, Millicent is the one to consider.',
      image: require('@/src/assets/AWRPresenters/Millicent Ndiweni.png')
    },
    'Sibongile Lugube': {
      name: 'Sibongile Lugube',
      bio: 'Sibongile Lugube\'s joy is to worship God and to usher the listener into an awareness of His omnipresence, particularly in the midst of the unspectacular, humdrum, regular, everyday activities of life. Psalm 27:4 "One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord."',
      image: require('@/src/assets/AWRPresenters/Sibongile Lugube.png')
    },
    'Zinhle Khambule': {
      name: 'Zinhle Khambule',
      bio: 'Bio for Zinhle Khambule',
      image: 'https://via.placeholder.com/200/07477B/FFFFFF?text=Zinhle+Khambule'
    },
    'Mwayi Champambali': {
      name: 'Mwayi Champambali',
      bio: 'Mwayi Chapambali is driven by faith and purpose, he dedicates himself to serving the Lord while helping others find their path to salvation. As a compassionate listener, he value diverse perspectives and work to foster unity and connection within our community. His guiding light is John 3:16 - "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life." This sacred verse serves both as a warning about the world\'s challenges and an inspiring promise that through faith in God, we can find redemption.',
      image: require('@/src/assets/AWRPresenters/Mwayi Champabali.png')
    },
    'Malvern Makichi': {
      name: 'Malvern Makichi',
      bio: 'Malvern Makichi enjoys connecting with listeners and sharing practical life tips and information on his shows. He has a keen interest in news and current affairs, complemented by his smooth voice, perfect for radio and news broadcasting. His favorite Bible verse is Matthew 5:8: "Blessed are the pure in heart, for they shall see God." This scripture reflects his values and guides his approach to life and his work in radio.',
      image: require('@/src/assets/AWRPresenters/Malvern Makichi.png')
    }
  },
  shows: {
    weekday: [
      { name: 'Valley of Praise', time: '03:00 - 06:00', presenter: 'Thamsanqa Tshuma', synopsis: 'Valley of Praise is a spiritual platform designed to inspire your day with fresh perspectives on life and faith. It offers a unique approach to daily devotionals, helping you discover God\'s presence in unexpected places throughout your routine. Through music, reflections, and interactive challenges, it transforms everyday moments into opportunities for worship and praise. Join Valley of Praise to turn ordinary mornings into extraordinary spiritual experiences.' },
      { name: 'Glorious Morning', time: '06:00 - 09:00', presenter: 'Dereck Viriri', synopsis: 'Glorious Morning is a Christian breakfast show that energizes your day with faith-filled content. It features engaging conversations, uplifting music, and insightful Bible study. The show aims to transform your morning routine into a spiritually enriching experience. Glorious Morning equips listeners with inspiration and wisdom to navigate their day with grace and purpose.' },
      { name: 'Mid-Morning Empowerment', time: '09:00 - 12:00', presenter: 'Sibongile Lugube', synopsis: 'Mid-Morning Empowerment is your daily source for spiritual growth and practical Christian living. This brunchtime show delivers an engaging mix of in-depth Bible study, empowering devotions, and thoughtful discussions that tackle challenging scriptural concepts. With live music requests and a dedicated parenting segment, Mid-Morning Empowerment equips listeners to navigate their faith journey and raise godly children in todays complex world.' },
      { name: 'LIVE', time: '12:00 - 15:00', presenter: 'Naye Lupondwana', synopsis: 'LIVE is a dynamic lunchtime show serving as a spiritual companion through your day, offering nourishment for body and soul. It covers every aspect of the Christian journey, from daily devotions to life\'s biggest challenges. The show features prayer, music, interactive discussions, and spiritual guidance. LIVE aims to create a vibrant community of faith in action, accompanying listeners from their first tune-in through baptism and beyond.' },
      { name: 'Maranatha Drive', time: '15:00 - 18:00', presenter: 'Zama Malote', synopsis: 'Maranatha Drive is an energetic afternoon commute show that blends contemporary Christian music with discussions on current affairs and biblical insights. It aims to keep listeners informed, inspired, and connected to their faith as they end their workday. The show offers a mix of uplifting tunes, thought-provoking commentary, and spiritual reflection. Maranatha Drive ensures listeners journeys home are both entertaining and spiritually enriching.' },
      { name: 'Business Sense', time: '18:00 - 20:00', presenter: 'Thapelo Moloi', synopsis: 'Business Sense is a Christian money show that aims to transform believers into financial achievers. It aligns financial practices with faith, breaking down complex financial concepts into actionable plans for the SID region. The show covers personal finance, entrepreneurship, and global technological trends, all underpinned by principles of faithful stewardship. Business Sense serves as a guide to financial freedom for listeners at all stages, from those in debt to aspiring entrepreneurs.' }
    ],
    friday: [
      { name: 'Valley of Praise', time: '03:00 - 06:00', presenter: 'Thamsanqa Tshuma', synopsis: 'Valley of Praise is a spiritual platform designed to inspire your day with fresh perspectives on life and faith. It offers a unique approach to daily devotionals, helping you discover God\'s presence in unexpected places throughout your routine. Through music, reflections, and interactive challenges, it transforms everyday moments into opportunities for worship and praise. Join Valley of Praise to turn ordinary mornings into extraordinary spiritual experiences.' },
      { name: 'Glorious Morning', time: '06:00 - 09:00', presenter: 'Dereck Viriri', synopsis: 'Glorious Morning is a Christian breakfast show that energizes your day with faith-filled content. It features engaging conversations, uplifting music, and insightful Bible study. The show aims to transform your morning routine into a spiritually enriching experience. Glorious Morning equips listeners with inspiration and wisdom to navigate their day with grace and purpose.' },
      { name: 'Mid-Morning Empowerment', time: '09:00 - 12:00', presenter: 'Sibongile Lugube', synopsis: 'Mid-Morning Empowerment is your daily source for spiritual growth and practical Christian living. This brunchtime show delivers an engaging mix of in-depth Bible study, empowering devotions, and thoughtful discussions that tackle challenging scriptural concepts. With live music requests and a dedicated parenting segment, Mid-Morning Empowerment equips listeners to navigate their faith journey and raise godly children in todays complex world.' },
      { name: 'LIVE', time: '12:00 - 15:00', presenter: 'Naye Lupondwana', synopsis: 'LIVE is a dynamic lunchtime show serving as a spiritual companion through your day, offering nourishment for body and soul. It covers every aspect of the Christian journey, from daily devotions to life\'s biggest challenges. The show features prayer, music, interactive discussions, and spiritual guidance. LIVE aims to create a vibrant community of faith in action, accompanying listeners from their first tune-in through baptism and beyond.' },
      { name: 'Maranatha Drive', time: '15:00 - 18:00', presenter: 'Zama Malote', synopsis: 'Maranatha Drive is an energetic afternoon commute show that blends contemporary Christian music with discussions on current affairs and biblical insights. It aims to keep listeners informed, inspired, and connected to their faith as they end their workday. The show offers a mix of uplifting tunes, thought-provoking commentary, and spiritual reflection. Maranatha Drive ensures listeners journeys home are both entertaining and spiritually enriching.' },
      { name: 'Bible/Kids Perspective', time: '18:00 - 20:00', presenter: getBibleKidsPerspectivePresenter(), synopsis: 'Bible Perspective and Kids Perspective are shows that explore how biblical wisdom applies to modern living for both adults and children. Bible Perspective examines Scripture and biblical figures to provide practical guidance for todays challenges, while Kids Perspective offers a dynamic platform for young minds to ask tough questions about faith. Both shows aim to make biblical teachings accessible and relevant, with Bible Perspective focusing on adult issues and Kids Perspective catering to curious children aged 5 to 16. These programs demonstrate that faith, curiosity, and practical application of biblical principles can go hand in hand for all ages.' }
    ],
    weekend: [
      { name: 'Glorious Morning Weekend', time: '06:00 - 09:00', presenter: 'Millicent Ndiweni', synopsis: 'Glorious Morning Weekend: Your spiritual power breakfast, serving up hearty portions of biblical wisdom for modern life! We\'re dishing out a feast of foundational doctrines, from prophetic insights to holistic health, all seasoned with practical advice for todays Christian. Hungry for financial freedom? Craving guidance on navigating women\'s issues? Seeking the recipe for inclusivity in a world of self-centeredness? We\'ve got you covered! Join us as we brew a robust blend of timeless truths and contemporary challenges, helping you rise and shine with Gods glory in an ever-changing world. At Glorious Morning Weekend, we\'re not just starting your day—we are jumpstarting your faith!' },
      { name: 'MME Weekend', time: '09:00 - 12:00', presenter: 'Zinhle Khambule', synopsis: 'Mid-Morning Empowerment Weekend Edition is a Christ-centered show that explores extraordinary, overlooked, and fascinating topics through a blend of rigorous inquiry and playful exploration. It covers a wide range of subjects including quirky science, obscure history, pop culture phenomena, and hidden spiritual insights. The show aims to empower listeners\' minds, entertain, and ignite faith by presenting God\'s diverse and wonder-filled world in an engaging way. It transforms weekends into a celebration of learning and curiosity, proving that exploring Gods creation can be both enlightening and fun.' },
      { name: 'Lunchtime Spirituals', time: '12:00 - 14:00', presenter: 'Mwayi Champambali', synopsis: 'Lunch Time Spirituals is a weekend midday show offering a blend of uplifting music and spiritual insights to accompany your meal. It features a mix of contemporary Christian hits and timeless hymns, alongside bite-sized Bible studies and verse-by-verse explorations. The program aims to transform your weekend lunch break into a soul-satisfying experience. Lunch Time Spirituals strives to nourish both body and spirit, providing food for thought alongside your physical meal.' },
      { name: 'Sinai', time: '14:00 - 17:00', presenter: 'Naye Lupondwana', synopsis: 'SINAI is a bold religious show that tackles tough questions and challenges in faith with fearless inquiry. It explores uncomfortable topics, taboos, and challenges to the status quo in pursuit of divine truth amidst human interpretations. The program features discussions with modern-day leaders and thinkers who dare to confront difficult spiritual and philosophical issues. SINAI aims to elevate religious conversation by encouraging a journey of determined spiritual exploration, regardless of how long or challenging it may be.' },
      { name: 'The Weekend Chapter', time: '17:00 - 20:00', presenter: 'Malvern Makichi', synopsis: 'The Weekend Chapter serves as a spiritual recharge station as the week concludes. Saturdays feature inspiring interviews, music group spotlights, and listener-requested tunes for relaxation. Sundays offer soul-stirring sermons, life lessons, and practical tips for the week ahead, accompanied by an uplifting playlist. The show aims to bookend your weekend with a mix of relaxation and revelation, helping you close the week\'s chapter and prepare for the next.' }
    ]
  }
};

// Cache utilities
export const cacheData = async (key: string, data: LiveStreamData): Promise<void> => {
  try {
    const cacheItem = { data, timestamp: Date.now() };
    await AsyncStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const getCachedData = async (key: string): Promise<LiveStreamData | null> => {
  try {
    const cachedItem = await AsyncStorage.getItem(key);
    if (!cachedItem) return null;

    const { data, timestamp } = JSON.parse(cachedItem);
    const isExpired = Date.now() - timestamp > CACHE_DURATION;
    
    if (isExpired) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error retrieving cached data:', error);
    return null;
  }
};

// API function
export const fetchLiveStreamInfo = async (): Promise<LiveStreamData> => {
  try {
    // Check cache
    const cachedData = await getCachedData(CACHE_KEY);
    if (cachedData) return cachedData;

    // TODO: Replace with actual API call when backend is ready
    // const response = await fetch(`${API_URL}/live-stream-info`);
    // const data = await response.json();
    
    const data = MOCK_DATA;
    await cacheData(CACHE_KEY, data);
    return data;
  } catch (error) {
    console.error('Error fetching live stream info:', error);
    return MOCK_DATA; // Fallback to mock data
  }
};
