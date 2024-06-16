import React, { ReactNode, useCallback } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Card, IconButton, Text } from 'react-native-paper';
import { useSelector } from 'react-redux';

import {
  summaryDataSelector,
  summaryLoadingSelector,
} from 'state/summary/selectors';

type RowProps = {
  children: ReactNode;
};

type ColProps = {
  children: ReactNode;
  isLabel?: boolean;
};

const Row = ({ children }: RowProps) => (
  <View style={styles.row}>{children}</View>
);

const Col = ({ children, isLabel }: ColProps) => (
  <View style={isLabel ? styles.labelCol : styles.contentCol}>{children}</View>
);

export function Summary(): React.JSX.Element {
  const summaryLoading = useSelector(summaryLoadingSelector);
  const summaryData = useSelector(summaryDataSelector);

  const imageCount = summaryData?.ImageCount ?? 0;
  const imageCountFormatted = imageCount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const title = `SmugMug Account: ${summaryData?.Name}`;
  const subtitle = `Address: ${summaryData?.WebUri}`;

  const handleVisitSitePressed = useCallback(() => {
    if (summaryData?.WebUri) {
      Linking.openURL(summaryData?.WebUri).catch();
    }
  }, [summaryData]);

  // Due to inline handler for "right" property in Card.Title.
  /* eslint-disable react/no-unstable-nested-components */
  return (
    <View style={styles.root}>
      <View style={styles.activityContainer}>
        <ActivityIndicator animating={summaryLoading} size="large" />
      </View>
      {summaryData?.WebUri && (
        <Card mode="contained">
          <Card.Title
            subtitle={subtitle}
            subtitleStyle={styles.subTitle}
            title={title}
            titleStyle={styles.title}
            right={props => (
              <IconButton
                {...props}
                icon="arrow-top-right-thin-circle-outline"
                onPress={handleVisitSitePressed}
              />
            )}
          />
          <Card.Content style={styles.cardContent}>
            <Row>
              <Col isLabel>
                <Text style={[styles.tableText, styles.labelText]}>
                  Photo Count:
                </Text>
              </Col>
              <Col>
                <Text style={styles.tableText}>{imageCountFormatted}</Text>
              </Col>
            </Row>
            <Row>
              <Col isLabel>
                <Text style={[styles.tableText, styles.labelText]}>Plan:</Text>
              </Col>
              <Col>
                <Text style={styles.tableText}>{summaryData.Plan}</Text>
              </Col>
            </Row>
          </Card.Content>
        </Card>
      )}
    </View>
  );
  /* eslint-enable react/no-unstable-nested-components */
}

const CONTAINER_SPACING_UNIT = 20;
const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: CONTAINER_SPACING_UNIT,
    paddingTop: CONTAINER_SPACING_UNIT,
    width: '100%',
  },
  activityContainer: {
    position: 'absolute',
    top: CONTAINER_SPACING_UNIT * 2,
    width: '100%',
  },
  cardContent: {
    paddingTop: CONTAINER_SPACING_UNIT,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingLeft: 40,
    paddingBottom: 4,
  },
  labelCol: {
    alignContent: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 8,
    width: 120,
  },
  contentCol: {
    alignContent: 'flex-end',
    flexDirection: 'row',
  },
  tableText: {
    fontSize: 14,
  },
  labelText: {
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
