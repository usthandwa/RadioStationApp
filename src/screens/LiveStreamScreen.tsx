import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Animated, Easing, Modal, Platform, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from '@expo/vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

interface Show {
  name: string;
  time: string;
  presenter: string | (() => string);
  synopsis: string;
}

interface Presenter {
  name: string;
  bio: string;
  image: any;
}

const LiveStreamScreen: React.FC = () => {
  const [currentShow, setCurrentShow] = useState<Show | null>(null);
  const [currentPresenter, setCurrentPresenter] = useState<Presenter | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedShow, setSelectedShow] = useState<Show | null>(null);
  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [upcomingShows, setUpcomingShows] = useState<Show[]>([]);
  
  
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const presenters: { [key: string]: Presenter } = {
    'Thamsanqa Tshuma': { 
      name: 'Thamsanqa Tshuma', 
      bio: 'Thamsanqa Tshuma believes that at the heart of life are relationships—everything else is secondary. As the host of Valley of Praise (airing weekdays from 3:00 AM to 6:00 AM), he explores the importance of personal, spiritual, and professional connections every day. His mission is to inspire listeners to view each day not just as a pursuit of success but as a chance to love others as themselves. For Thamsanqa, each day is a divine opportunity to serve God through how we relate to those around us.', 
      image: require('../assets/AWRPresenters/Thamsanqa Tshuma.png') 
    },
    'Dereck Viriri': { 
      name: 'Dereck Viriri', 
      bio: 'Dereck Viriri is a devoted Christian radio enthusiast, passionate about sharing biblical principles with everyone, particularly the youth. His dedication to promoting personal growth stems from his belief in preparing individuals for heaven. Outside of his professional life, Dereck is a loving husband who places great importance on family and community. His favorite scripture, Psalms 119:130 (ERV), resonates deeply with him: “As people understand your word, it brings light to their lives. Your word makes even simple people wise.”.', 
      image: require('../assets/AWRPresenters/Dereck Viriri.png') 
    },
    'Zanele Zama': { 
      name: 'Zanele Zama', 
      bio: 'Zanele Zama is a seasoned media practitioner with over 13 years of experience in reporting, producing, show presenting, and digital marketing. As a mother of three and a devoted wife, she enjoys cooking and watching drama series in her downtime. Her go-to scripture during life’s ups and downs is 1 Corinthians 2:9: “No eye has seen, no ear has heard, and no human mind has conceived the things God has prepared for those who love him.” This verse grounds her both professionally and personally.', 
      image: require('../assets/AWRPresenters/Zanele Zama.png') 
    },
    'Naye Lupondwana': { 
      name: 'Naye Lupondwana', 
      bio: 'Bio for Naye Lupondwana', 
      image: require('../assets/AWRPresenters/Naye Lupondwana.png') 
    },
    'Zama Malote': { 
      name: 'Zama Malote', 
      bio: 'Zama Malote has a deep passion for debates, documentaries, and reading, particularly religious and political material. One of his favorite scriptures is Psalm 37:25, which says, “I was young and now I am old, yet I have never seen the righteous forsaken or their children begging for bread.” This verse resonates deeply with his faith and perspective on life. His love for knowledge and meaningful conversation reflects his commitment to personal and spiritual growth..”', 
      image: require('../assets/AWRPresenters/Zama Malote.png') 
    },
    'Thapelo Moloi': { 
      name: 'Thapelo Moloi', 
      bio: 'Thapelo Moloi is a passionate Christian and avid reader, known for his talents in radio and public speaking. He is deeply committed to holistic people development, using platforms like radio, TV, and public speaking to inspire and uplift others. His areas of interest include Christianity, business, investments, finance, and economics. Thapelo’s favorite scripture is Matthew 25:23, which reads, “Well done, good and faithful servant. You have been faithful over a little; I will set you over much. Enter into the joy of your master.”', 
      image: require('../assets/AWRPresenters/Thapelo Moloi.png') 
    },
    'Millicent Ndiweni': { 
      name: 'Millicent Ndiweni', 
      bio: 'Millicent Ndiweni is a Talk Radio Producer and Presenter at Adventist World Radio, passionate about education, authenticity, and affirming others positively. Though still young and evolving in her views, she prays to reflect the kindness and grace of Jesus in all her interactions. With a wide range of interests, she brings skills in speaking, critical thinking, research, teaching, writing, and vegetarian cooking, all wrapped in her warm and smiley personality. If you’re looking for a dynamic speaker or creative thinker, Millicent is the one to consider.', 
      image: require('../assets/AWRPresenters/Millicent Ndiweni.png') 
    },
    'Sibongile Lugube': { 
      name: 'Sibongile Lugube', 
      bio: 'Sibongile Lugube’s joy is to worship God and to usher the listener into an awareness of His omnipresence, particularly in the midst of the unspectacular, humdrum, regular, everyday activities of life. Psalm 27:4 “One thing I ask from the Lord, this only do I seek: that I may dwell in the house of the Lord all the days of my life, to gaze on the beauty of the Lord.“',
      image: require('../assets/AWRPresenters/Sibongile Lugube.png') 
    },
    'Mwayi Chapambali': { 
      name: 'Mwayi Chapambali', 
      bio: 'Mwayi Chapambali is driven by faith and purpose, he dedicates himself to serving the Lord while helping others find their path to salvation. As a compassionate listener, he value diverse perspectives and work to foster unity and connection within our community. His guiding light is John 3:16 - “For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.” This sacred verse serves both as a warning about the world’s challenges and an inspiring promise that through faith in God, we can find redemption.', 
      image: require('../assets/AWRPresenters/Mwayi Champabali.png') 
    },
    'Malvern Makichi': { 
      name: 'Malvern Makichi', 
      bio: 'Malvern Makichi enjoys connecting with listeners and sharing practical life tips and information on his shows. He has a keen interest in news and current affairs, complemented by his smooth voice, perfect for radio and news broadcasting. His favorite Bible verse is Matthew 5:8: “Blessed are the pure in heart, for they shall see God.” This scripture reflects his values and guides his approach to life and his work in radio.', 
      image: require('../assets/AWRPresenters/Malvern Makichi.png') 
    },
  };


  const getBibleKidsPerspectivePresenter = () => {
    const now = new Date();
    const isKidsPerspective = now.getDate() >= 8 && now.getDate() <= 14; // 2nd week of the month
    const weekNumber = Math.floor((now.getDate() - 1) / 7) + 1;
    
    if (isKidsPerspective) {
      return 'Zanele Zama';
    } else {
      return weekNumber % 2 === 1 ? 'Zanele Zama' : 'Dereck Viriri';
    }
  };

  const shows: { [key: string]: Show[] } = {
    weekday: [
      { name: 'Valley of Praise', time: '03:00 - 06:00', presenter: 'Thamsanqa Tshuma', synopsis: 'Valley of Praise is a spiritual platform designed to inspire your day with fresh perspectives on life and faith. It offers a unique approach to daily devotionals, helping you discover God\'s presence in unexpected places throughout your routine. Through music, reflections, and interactive challenges, it transforms everyday moments into opportunities for worship and praise. Join Valley of Praise to turn ordinary mornings into extraordinary spiritual experiences.' },
      { name: 'Glorious Morning', time: '06:00 - 09:00', presenter: 'Dereck Viriri', synopsis: 'Glorious Morning is a Christian breakfast show that energizes your day with faith-filled content. It features engaging conversations, uplifting music, and insightful Bible study. The show aims to transform your morning routine into a spiritually enriching experience. Glorious Morning equips listeners with inspiration and wisdom to navigate their day with grace and purpose.' },
      { name: 'Mid-Morning Empowerment', time: '09:00 - 12:00', presenter: 'Zanele Zama', synopsis: 'Mid-Morning Empowerment is your daily source for spiritual growth and practical Christian living. This brunchtime show delivers an engaging mix of in-depth Bible study, empowering devotions, and thoughtful discussions that tackle challenging scriptural concepts. With live music requests and a dedicated parenting segment, Mid-Morning Empowerment equips listeners to navigate their faith journey and raise godly children in todays complex world.' },
      { name: 'LIVE', time: '12:00 - 15:00', presenter: 'Naye Lupondwana', synopsis: 'LIVE is a dynamic lunchtime show serving as a spiritual companion through your day, offering nourishment for body and soul. It covers every aspect of the Christian journey, from daily devotions to life\'s biggest challenges. The show features prayer, music, interactive discussions, and spiritual guidance. LIVE aims to create a vibrant community of faith in action, accompanying listeners from their first tune-in through baptism and beyond.' },
      { name: 'Maranatha Drive', time: '15:00 - 18:00', presenter: 'Zama Malote', synopsis: 'Maranatha Drive is an energetic afternoon commute show that blends contemporary Christian music with discussions on current affairs and biblical insights. It aims to keep listeners informed, inspired, and connected to their faith as they end their workday. The show offers a mix of uplifting tunes, thought-provoking commentary, and spiritual reflection. Maranatha Drive ensures listeners journeys home are both entertaining and spiritually enriching.' },
      { name: 'Business Sense', time: '18:00 - 20:00', presenter: 'Thapelo Moloi', synopsis: 'Business Sense is a Christian money show that aims to transform believers into financial achievers. It aligns financial practices with faith, breaking down complex financial concepts into actionable plans for the SID region. The show covers personal finance, entrepreneurship, and global technological trends, all underpinned by principles of faithful stewardship. Business Sense serves as a guide to financial freedom for listeners at all stages, from those in debt to aspiring entrepreneurs.' },
    ],
    friday: [
      { name: 'Valley of Praise', time: '03:00 - 06:00', presenter: 'Thamsanqa Tshuma', synopsis: 'Valley of Praise is a spiritual platform designed to inspire your day with fresh perspectives on life and faith. It offers a unique approach to daily devotionals, helping you discover God\'s presence in unexpected places throughout your routine. Through music, reflections, and interactive challenges, it transforms everyday moments into opportunities for worship and praise. Join Valley of Praise to turn ordinary mornings into extraordinary spiritual experiences.' },
      { name: 'Glorious Morning', time: '06:00 - 09:00', presenter: 'Dereck Viriri', synopsis: 'Glorious Morning is a Christian breakfast show that energizes your day with faith-filled content. It features engaging conversations, uplifting music, and insightful Bible study. The show aims to transform your morning routine into a spiritually enriching experience. Glorious Morning equips listeners with inspiration and wisdom to navigate their day with grace and purpose.' },
      { name: 'Mid-Morning Empowerment', time: '09:00 - 12:00', presenter: 'Zanele Zama', synopsis: 'Mid-Morning Empowerment is your daily source for spiritual growth and practical Christian living. This brunchtime show delivers an engaging mix of in-depth Bible study, empowering devotions, and thoughtful discussions that tackle challenging scriptural concepts. With live music requests and a dedicated parenting segment, Mid-Morning Empowerment equips listeners to navigate their faith journey and raise godly children in todays complex world.' },
      { name: 'LIVE', time: '12:00 - 15:00', presenter: 'Naye Lupondwana', synopsis: 'LIVE is a dynamic lunchtime show serving as a spiritual companion through your day, offering nourishment for body and soul. It covers every aspect of the Christian journey, from daily devotions to life\'s biggest challenges. The show features prayer, music, interactive discussions, and spiritual guidance. LIVE aims to create a vibrant community of faith in action, accompanying listeners from their first tune-in through baptism and beyond.' },
      { name: 'Maranatha Drive', time: '15:00 - 18:00', presenter: 'Zama Malote', synopsis: 'Maranatha Drive is an energetic afternoon commute show that blends contemporary Christian music with discussions on current affairs and biblical insights. It aims to keep listeners informed, inspired, and connected to their faith as they end their workday. The show offers a mix of uplifting tunes, thought-provoking commentary, and spiritual reflection. Maranatha Drive ensures listeners journeys home are both entertaining and spiritually enriching.' },
      { name: 'Bible/Kids Perspective', time: '18:00 - 20:00', presenter: getBibleKidsPerspectivePresenter, synopsis: 'Bible Perspective and Kids Perspective are shows that explore how biblical wisdom applies to modern living for both adults and children. Bible Perspective examines Scripture and biblical figures to provide practical guidance for todays challenges, while Kids Perspective offers a dynamic platform for young minds to ask tough questions about faith. Both shows aim to make biblical teachings accessible and relevant, with Bible Perspective focusing on adult issues and Kids Perspective catering to curious children aged 5 to 16. These programs demonstrate that faith, curiosity, and practical application of biblical principles can go hand in hand for all ages.' },
    ],
    weekend: [
      { name: 'Glorious Morning Weekend', time: '06:00 - 09:00', presenter: 'Millicent Ndiweni', synopsis: 'Glorious Morning Weekend: Your spiritual power breakfast, serving up hearty portions of biblical wisdom for modern life! We\'re dishing out a feast of foundational doctrines, from prophetic insights to holistic health, all seasoned with practical advice for todays Christian. Hungry for financial freedom? Craving guidance on navigating women\'s issues? Seeking the recipe for inclusivity in a world of self-centeredness? We\'ve got you covered! Join us as we brew a robust blend of timeless truths and contemporary challenges, helping you rise and shine with Gods glory in an ever-changing world. At Glorious Morning Weekend, we\'re not just starting your day—we are jumpstarting your faith!"' },
      { name: 'MME Weekend', time: '09:00 - 12:00', presenter: 'Sibongile Lugube', synopsis: 'Mid-Morning Empowerment Weekend Edition is a Christ-centered show that explores extraordinary, overlooked, and fascinating topics through a blend of rigorous inquiry and playful exploration. It covers a wide range of subjects including quirky science, obscure history, pop culture phenomena, and hidden spiritual insights. The show aims to empower listeners\' minds, entertain, and ignite faith by presenting God\'s diverse and wonder-filled world in an engaging way. It transforms weekends into a celebration of learning and curiosity, proving that exploring Gods creation can be both enlightening and fun.' },
      { name: 'Lunchtime Spirituals', time: '12:00 - 14:00', presenter: 'Mwayi Champambali', synopsis: 'Lunch Time Spirituals is a weekend midday show offering a blend of uplifting music and spiritual insights to accompany your meal. It features a mix of contemporary Christian hits and timeless hymns, alongside bite-sized Bible studies and verse-by-verse explorations. The program aims to transform your weekend lunch break into a soul-satisfying experience. Lunch Time Spirituals strives to nourish both body and spirit, providing food for thought alongside your physical meal.' },
      { name: 'Sinai', time: '14:00 - 17:00', presenter: 'Naye Lupondwana', synopsis: 'SINAI is a bold religious show that tackles tough questions and challenges in faith with fearless inquiry. It explores uncomfortable topics, taboos, and challenges to the status quo in pursuit of divine truth amidst human interpretations. The program features discussions with modern-day leaders and thinkers who dare to confront difficult spiritual and philosophical issues. SINAI aims to elevate religious conversation by encouraging a journey of determined spiritual exploration, regardless of how long or challenging it may be.' },
      { name: 'The Weekend Chapter', time: '17:00 - 20:00', presenter: 'Malvern Makichi', synopsis: 'The Weekend Chapter serves as a spiritual recharge station as the week concludes. Saturdays feature inspiring interviews, music group spotlights, and listener-requested tunes for relaxation. Sundays offer soul-stirring sermons, life lessons, and practical tips for the week ahead, accompanied by an uplifting playlist. The show aims to bookend your weekend with a mix of relaxation and revelation, helping you close the week\'s chapter and prepare for the next.' },
    ],
  };

  const iframeHtml = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { margin: 0; padding: 0; overflow: hidden; background-color: #07477B; }
        iframe { width: 100%; height: 100%; border: none; }
      </style>
    </head>
    <body>
      <iframe src="https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" allow="autoplay"></iframe>
    </body>
  </html>
`;

useEffect(() => {
  const determineCurrentShow = () => {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    let schedule;

    if (day === 5) { // Friday
      schedule = shows.friday;
    } else if (day >= 1 && day <= 4) { // Monday to Thursday
      schedule = shows.weekday;
    } else { // Saturday and Sunday
      schedule = shows.weekend;
    }
    
    let currentShowIndex = -1;
    for (let i = 0; i < schedule.length; i++) {
      const show = schedule[i];
      const [start, end] = show.time.split(' - ').map(time => parseInt(time.split(':')[0]));
      if (hour >= start && hour < end) {
        const presenterName = typeof show.presenter === 'function' ? show.presenter() : show.presenter;
        setCurrentShow(show);
        setCurrentPresenter(presenters[presenterName]);
        setIsPlaying(true);
        currentShowIndex = i;
        break;
      }
    }
    
    if (currentShowIndex === -1) {
      setCurrentShow(null);
      setCurrentPresenter(null);
      setIsPlaying(false);
    } else {
      // Set upcoming shows
      setUpcomingShows(schedule.slice(currentShowIndex + 1));
    }
  };

  determineCurrentShow();
  const interval = setInterval(determineCurrentShow, 60000);
  return () => clearInterval(interval);
}, []);


interface VinylRecordEffectProps {
  isPlaying: boolean;
  children: React.ReactNode;
}

const VinylRecordEffect: React.FC<VinylRecordEffectProps> = ({ isPlaying, children }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isPlaying) {
      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Subtle scaling animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.02,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulsing animation for audio reactivity simulation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.5,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      rotateAnim.setValue(0);
      scaleAnim.setValue(1);
      pulseAnim.setValue(0);
    }
  }, [isPlaying]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pulse = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  return (
    <View style={styles.vinylWrapper}>
      <Animated.View
        style={[
          styles.pulseCircle,
          {
            transform: [{ scale: pulse }],
            opacity: pulseAnim,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.vinylContainer,
          {
            transform: [
              { rotate: spin },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <View style={styles.vinylGrooves} />
        <View style={styles.vinylLabel}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

  const renderSchedule = (scheduleType: 'weekday' | 'friday' | 'weekend') => (
    <View style={styles.scheduleContainer}>
      <Text style={styles.scheduleTitle}>
        {scheduleType === 'weekday' ? 'Monday to Thursday' : 
         scheduleType === 'friday' ? 'Friday' : 'Weekend'} Schedule
      </Text>
      {shows[scheduleType].map((show, index) => {
        const presenterName = typeof show.presenter === 'function' ? show.presenter() : show.presenter;
        return (
          <TouchableOpacity 
            key={index} 
            style={styles.showItem}
            onPress={() => {
              setSelectedShow(show);
              setSelectedPresenter(presenters[presenterName]);
              setModalVisible(true);
            }}
          >
            <Text style={styles.showName}>{show.name}</Text>
            <Text style={styles.showTime}>{show.time}</Text>
            <Text style={styles.showPresenter}>{presenterName}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {selectedShow && selectedPresenter && (
              <>
                <Text style={styles.modalTitle}>{selectedShow.name}</Text>
                <Text style={styles.modalTime}>{selectedShow.time}</Text>
                <Text style={styles.modalPresenter}>{selectedPresenter.name}</Text>
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Show Synopsis</Text>
                  <Text style={styles.modalText}>{selectedShow.synopsis}</Text>
                </View>
                
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>Presenter Bio</Text>
                  <Image 
                    source={selectedPresenter.image} 
                    style={styles.presenterImageModal}
                  />
                </View>
                  <Text style={styles.modalText}>{selectedPresenter.bio}</Text>
                  
              </>
            )}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
  const renderUpNext = () => (
    <View style={styles.upNextContainer}>
      <Text style={styles.upNextTitle}>Up Next:</Text>
      {upcomingShows.slice(0, 3).map((show, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.upNextItem}
          onPress={() => {
            setSelectedShow(show);
            const presenterName = typeof show.presenter === 'function' ? show.presenter() : show.presenter;
            setSelectedPresenter(presenters[presenterName]);
            setModalVisible(true);
          }}
        >
          <Text style={styles.upNextName}>{show.name}</Text>
          <Text style={styles.upNextTime}>{show.time}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Live Stream</Text>
      {currentShow && currentPresenter ? (
        <View style={styles.currentShowContainer}>
          <Text style={styles.currentShow}>Now Playing: {currentShow.name}</Text>
          <TouchableOpacity
            onPress={() => {
              setSelectedShow(currentShow);
              setSelectedPresenter(currentPresenter);
              setModalVisible(true);
            }}
          >
            <VinylRecordEffect isPlaying={isPlaying}>
              <Image source={currentPresenter.image} style={styles.presenterImage} />
            </VinylRecordEffect>
          </TouchableOpacity>
          <Text style={styles.presenterName}>{currentPresenter.name}</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => {
              setSelectedShow(currentShow);
              setSelectedPresenter(currentPresenter);
              setModalVisible(true);
            }}
          >
            <Text style={styles.ctaButtonText}>View Bio and Show Synopsis</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.currentShow}>Best of AWRSIDmedia</Text>
      )}
      
      {renderUpNext()}
      
      <View style={styles.iframeContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            src="https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B"
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay"
          />
        ) : (
          <WebView
            source={{ uri: "https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B" }}
            style={styles.webview}
            scrollEnabled={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.youtube.com/@thesidmedia4110/live')}
        >
          <Icon name="youtube-play" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on YouTube</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL('https://www.facebook.com/sidmedia/live')}
        >
          <Icon name="facebook" size={24} color="#fff" />
          <Text style={styles.buttonText}>Watch on Facebook</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleWrapper}>
        {renderSchedule('weekday')}
        {renderSchedule('friday')}
        {renderSchedule('weekend')}
      </View>

      {renderModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#c0cacb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#07477B',
  },
  currentShowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#07477B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
  },
  currentShow: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#07477B',
  },
  scheduleWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
  },
  scheduleContainer: {
    flex: 1,
    marginBottom: 20,
  },
  scheduleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#07477B',
  },
  showItem: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  showName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  showTime: {
    fontSize: 14,
    color: '#666',
  },
  showPresenter: {
    fontSize: 14,
    color: '#07477B',
  },
  iframeContainer: {
    width: '100%',
    height: 100,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
  vinylWrapper: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  pulseCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  vinylContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  vinylGrooves: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  vinylLabel: {
    width: '40%',
    height: '40%',
    borderRadius: 50,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presenterImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  presenterName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#07477B',
    marginBottom: 5,
  },
  ctaButton: {
    backgroundColor: '#07477B',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  upNextContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#c0cacb',
    borderRadius: 5,
  },
  upNextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#07477B',
  },
  upNextItem: {
    marginBottom: 10,
  },
  upNextName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07477B',
  },
  upNextTime: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '90%',
  },
  modalContent: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalTime: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  modalPresenter: {
    fontSize: 20,
    fontWeight: '600',
    color: '#07477B',
    marginBottom: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#07477B',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  presenterImageModal: {
    width: '90%',
    height: 200,
    // borderRadius: 75,
    alignSelf: 'center',
    marginTop: 15,
  },
  closeButton: {
    backgroundColor: '#07477B',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default LiveStreamScreen;