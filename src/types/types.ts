import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  LiveStream: undefined;
  Give: undefined;
  Prayer: undefined;
  Podcasts: undefined;
  AboutUs: undefined;
  Social: undefined;
};

export type TabParamList = {
  HomeTab: NavigatorScreenParams<RootStackParamList>;
  LiveStreamTab: undefined;
  GiveTab: undefined;
  MoreTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}