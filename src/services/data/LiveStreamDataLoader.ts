/**
 * LiveStream Data Loader
 *
 * Helper functions to load and format data for LiveStreamScreen
 */

import {
  getAllPresenters,
  getAllShows,
  getScheduleByType,
  initializeStorage,
} from '@/services/storage/CMSStorage';
import { Presenter as CMSPresenter, Show as CMSShow } from '@/types/cms.types';

// LiveStream screen types (keeping compatibility with existing code)
export interface Show {
  name: string;
  time: string;
  presenter: string | (() => string);
  synopsis: string;
}

export interface Presenter {
  name: string;
  bio: string;
  image: any;
}

/**
 * Get Bible/Kids Perspective dynamic presenter
 */
export const getBibleKidsPerspectivePresenter = (): string => {
  const now = new Date();
  const isKidsPerspective = now.getDate() >= 8 && now.getDate() <= 14; // 2nd week of the month
  const weekNumber = Math.floor((now.getDate() - 1) / 7) + 1;

  if (isKidsPerspective) {
    return 'Zanele Zama';
  } else {
    return weekNumber % 2 === 1 ? 'Zanele Zama' : 'Dereck Viriri';
  }
};

/**
 * Load and format presenters for LiveStream
 */
export const loadPresenters = async (): Promise<{ [key: string]: Presenter }> => {
  await initializeStorage();
  const cmsPresent

ers = await getAllPresenters(false);
  const presentersMap: { [key: string]: Presenter } = {};

  for (const presenter of cmsPresenters) {
    // Dynamically require the image based on the path
    let imageSource;
    try {
      // Extract just the filename from the imagePath
      const imageName = presenter.imagePath.split('/').pop()?.replace('.png', '');
      if (imageName) {
        // Map the presenter name to the image require
        imageSource = getPresenterImage(imageName);
      }
    } catch (error) {
      console.warn(`Could not load image for ${presenter.name}:`, error);
      imageSource = null;
    }

    presentersMap[presenter.name] = {
      name: presenter.name,
      bio: presenter.bio,
      image: imageSource,
    };
  }

  return presentersMap;
};

/**
 * Helper to get presenter images
 */
const getPresenterImage = (imageName: string): any => {
  const imageMap: { [key: string]: any } = {
    'Thamsanqa Tshuma': require('@/assets/AWRPresenters/Thamsanqa Tshuma.png'),
    'Dereck Viriri': require('@/assets/AWRPresenters/Dereck Viriri.png'),
    'Zanele Zama': require('@/assets/AWRPresenters/Zanele Zama.png'),
    'Naye Lupondwana': require('@/assets/AWRPresenters/Naye Lupondwana.png'),
    'Zama Malote': require('@/assets/AWRPresenters/Zama Malote.png'),
    'Thapelo Moloi': require('@/assets/AWRPresenters/Thapelo Moloi.png'),
    'Millicent Ndiweni': require('@/assets/AWRPresenters/Millicent Ndiweni.png'),
    'Sibongile Lugube': require('@/assets/AWRPresenters/Sibongile Lugube.png'),
    'Mwayi Champabali': require('@/assets/AWRPresenters/Mwayi Champabali.png'),
    'Malvern Makichi': require('@/assets/AWRPresenters/Malvern Makichi.png'),
  };

  return imageMap[imageName] || null;
};

/**
 * Load and format shows for LiveStream
 */
export const loadShows = async (presentersMap: { [key: string]: Presenter }): Promise<{ [key: string]: Show[] }> => {
  const allShows = await getAllShows();
  const cmsPresenters = await getAllPresenters(false);

  // Get schedules
  const weekdaySchedule = await getScheduleByType('weekday');
  const fridaySchedule = await getScheduleByType('friday');
  const weekendSchedule = await getScheduleByType('weekend');

  const formatShow = (cmsShow: CMSShow): Show => {
    let presenterName: string | (() => string);

    if (cmsShow.presenterId === 'dynamic') {
      // Dynamic presenter (e.g., Bible/Kids Perspective)
      presenterName = getBibleKidsPerspectivePresenter;
    } else {
      const presenter = cmsPresenters.find(p => p.id === cmsShow.presenterId);
      presenterName = presenter?.name || 'Unknown Presenter';
    }

    return {
      name: cmsShow.name,
      time: cmsShow.time,
      presenter: presenterName,
      synopsis: cmsShow.synopsis,
    };
  };

  const getShowsForSchedule = (showIds: string[]): Show[] => {
    return showIds
      .map(showId => {
        const show = allShows.find(s => s.id === showId);
        return show ? formatShow(show) : null;
      })
      .filter((show): show is Show => show !== null);
  };

  return {
    weekday: weekdaySchedule ? getShowsForSchedule(weekdaySchedule.showIds) : [],
    friday: fridaySchedule ? getShowsForSchedule(fridaySchedule.showIds) : [],
    weekend: weekendSchedule ? getShowsForSchedule(weekendSchedule.showIds) : [],
  };
};
