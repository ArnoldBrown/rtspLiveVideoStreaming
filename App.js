import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { VLCPlayer } from 'react-native-vlc-media-player';

const windowWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get("window").height;
const aspetRatio = 2.5 / 4;

const calcVLCPlayerHeight = (windowWidth, aspetRatio) => {
  return windowWidth * aspetRatio;
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const defaultHeight = calcVLCPlayerHeight(Dimensions.get('window').width, 2.5 / 4);
  let videoViewHeight = defaultHeight;

  const videos = ['your_rtsp_video_link', 'your_rtsp_video_link', 'your_rtsp_video_link', 'your_rtsp_video_link'];
  if (videos.length > 2) {
    videoViewHeight = calcVLCPlayerHeight(Dimensions.get('window').width, 1.5 / 4)
  }

  const [expandedIndex, setExpandedIndex] = useState(-1);

  const handleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? -1 : index);
  };

  const VideoView = ({ videoUrl, height }) => {
    return (
      <VLCPlayer
        source={{
          initType: 2,
          hwDecoderEnabled: 1,
          hwDecoderForced: 1,
          uri: videoUrl,
          initOptions: [
            '--no-audio',
            '--rtsp-tcp',
            '--network-caching=150',
            '--rtsp-caching=150',
            '--no-stats',
            '--tcp-caching=150',
            '--realrtsp-caching=150',
          ],
        }}
        autoplay={true}
        autoAspectRatio={true}
        resizeMode="cover"
        // videoAspectRatio={"4:3"}
        isLive={true}
        autoReloadLive={true}
        style={{ height: height }}
        onBuffering={(event) => setLoading(event.isBuffering)}
      />
    )
  }

  const ListItem = ({ item, index }) => {
    const isExpanded = index === expandedIndex;
    return (
      <TouchableOpacity onPress={() => item !== undefined ? handleExpand(index):''} style={styles.videoContainer}>
        <VideoView videoUrl={item} height={videoViewHeight} />
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="orange" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 10 }}>
          <View style={{backgroundColor:'#fff', borderRadius:30}}>
              <Text style={styles.heading}><Text style={{ color: 'orange' }}>Trois</Text>Infotech</Text>
          </View>
        </View>

        {expandedIndex !== -1 ? <View>
          <VideoView videoUrl={videos[expandedIndex]} height={defaultHeight} />

          {expandedIndex !== -1 && (
            <TouchableOpacity style={styles.iconContainer} onPress={() => handleExpand(-1)}>
              <Text style={{ color: 'orange', fontSize: 12 }}>Close</Text>
            </TouchableOpacity>
          )}

        </View> : <View style={{ height: videos.length > 2 ? videoViewHeight * 2 : videoViewHeight, backgroundColor: 'grey' }}>
          <FlatList
            data={videos}
            renderItem={({ item, index }) => <ListItem item={item} index={index} />}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
          />
        </View>}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.black,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  videoContainer: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 999, // Ensure it's above the video
    borderWidth: 2,
    borderColor: 'orange',
    padding: 2,
    borderRadius: 30,
  },
});

export default App;
