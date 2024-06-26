import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { FasterImageView } from '@candlefinance/faster-image';
import dayjs from 'dayjs';

import {
  homePageFeatureDestinationSelector,
  homePageFeaturesDataLoadingSelector,
  homePageFeatureSourcesSelector,
} from 'state/homeFeatures/selectors';

import { theme } from '../../theme.js';

// Due to inline handler for "left" property in List.Item.
/* eslint-disable react/no-unstable-nested-components */
export function HomeFeatures(): React.JSX.Element {
  const loading = useSelector(homePageFeaturesDataLoadingSelector);
  const destination = useSelector(homePageFeatureDestinationSelector);
  const sources = useSelector(homePageFeatureSourcesSelector);

  return (
    <View style={styles.root}>
      <View style={styles.activityContainer}>
        <ActivityIndicator animating={loading} size="large" />
      </View>
      <View style={styles.content}>
        <List.Section style={styles.section}>
          <List.Subheader style={styles.listHeading}>
            Assign Home Page Photos
          </List.Subheader>
          {destination?.key && (
            <List.Item
              key={destination.key}
              title={destination.name}
              titleStyle={styles.destListItemTitle}
              description={
                <View style={styles.descriptionContainer}>
                  <View style={styles.descriptionTermContainerLeft}>
                    <Text style={styles.destDescriptionValue}>
                      {destination.imageCount}
                    </Text>
                    <Text style={styles.destDescriptionLabel}>{' images'}</Text>
                  </View>
                  <View style={styles.descriptionTermContainerRight}>
                    <Text
                      style={[
                        styles.destDescriptionLabel,
                        styles.pushLabelRight,
                      ]}>{`Last Updated  `}</Text>
                    <Text style={styles.destDescriptionValue}>
                      {dayjs(destination.imagesLastUpdated).format(
                        'MMM D, YYYY  H:mm:ss A',
                      )}
                    </Text>
                  </View>
                </View>
              }
              style={[
                styles.listItem,
                styles.destListItem,
                styles.destListItemSeparator,
              ]}
              left={() => (
                <FasterImageView
                  style={styles.highlightImage}
                  source={{
                    borderRadius: 10,
                    url: destination.highlightImage.thumbnailUrl,
                  }}
                />
              )}
            />
          )}
          {sources?.length && (
            <FlatList
              keyExtractor={item => item.key}
              data={sources}
              renderItem={({ item, index }) => (
                <List.Item
                  key={item.key}
                  title={item.name}
                  titleStyle={styles.srcListItemTitle}
                  description={
                    <View style={styles.descriptionContainer}>
                      <View style={styles.descriptionTermContainerLeft}>
                        <Text style={styles.srcDescriptionValue}>
                          {item.imageCount}
                        </Text>
                        <Text style={styles.srcDescriptionLabel}>
                          {' images'}
                        </Text>
                      </View>
                      <View style={styles.descriptionTermContainerRight}>
                        <Text
                          style={[
                            styles.srcDescriptionLabel,
                            styles.pushLabelRight,
                          ]}>{`Last Updated  `}</Text>
                        <Text style={styles.srcDescriptionValue}>
                          {dayjs(item.imagesLastUpdated).format(
                            'MMM D, YYYY  H:mm:ss A',
                          )}
                        </Text>
                      </View>
                    </View>
                  }
                  style={[
                    styles.listItem,
                    styles.srcListItem,
                    index < sources.length - 1 && styles.srcListItemSeparator,
                  ]}
                  left={() => (
                    <FasterImageView
                      style={styles.highlightImage}
                      source={{
                        borderRadius: 10,
                        url: item.highlightImage.thumbnailUrl,
                      }}
                    />
                  )}
                />
              )}
            />
          )}
        </List.Section>
      </View>
    </View>
  );
}
/* eslint-enable react/no-unstable-nested-components */

/*
          {
            sources.map(
              (source: { key: string; name: string; highlightImage: any }) => (
                <List.Item
                  key={source.key}
                  title={source.name}
                  style={styles.listItem}
                  left={() => (
                    <FasterImageView
                      style={styles.highlightImage}
                      source={{
                        borderRadius: 10,
                        url: source.highlightImage.thumbnailUrl,
                      }}
                    />
                  )}
                />
              ),
            )}
*/

const CONTAINER_SPACING_UNIT = 20;
const styles = StyleSheet.create({
  root: {
    minHeight: 6 * CONTAINER_SPACING_UNIT,
    paddingHorizontal: CONTAINER_SPACING_UNIT,
    paddingTop: CONTAINER_SPACING_UNIT,
    width: '100%',
  },
  activityContainer: {
    position: 'absolute',
    top: 2 * CONTAINER_SPACING_UNIT,
    width: '100%',
  },
  content: {
    alignItems: 'center',
    paddingTop: CONTAINER_SPACING_UNIT,
  },
  listHeading: {
    fontSize: 20,
    textAlign: 'center',
  },
  listItem: {
    paddingVertical: 2,
    paddingLeft: 14,
  },
  descriptionContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  descriptionTermContainerLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  descriptionTermContainerRight: {
    flexDirection: 'row',
    flex: 4,
  },
  pushLabelRight: {
    marginLeft: 30,
  },
  section: {
    width: '100%',
  },
  highlightImage: {
    width: 60,
    height: 60,
  },
  destListItemSeparator: {
    borderBottomWidth: 6,
    borderStyle: 'solid',
    borderBottomColor: theme.colors.surface,
  },
  srcListItemSeparator: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: theme.colors.inversePrimary,
  },
  destListItem: {
    backgroundColor: theme.colors.primaryContainer,
  },
  srcListItem: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  destListItemTitle: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 18,
    paddingBottom: 8,
  },
  srcListItemTitle: {
    color: theme.colors.onPrimaryFixed,
    fontSize: 18,
    paddingBottom: 8,
  },
  destDescriptionValue: {
    color: theme.colors.onPrimaryContainer,
  },
  srcDescriptionValue: {
    color: theme.colors.onPrimaryFixed,
  },
  destDescriptionLabel: {
    color: theme.colors.primaryFixedDim,
  },
  srcDescriptionLabel: {
    color: theme.colors.primaryContainer,
  },
});
