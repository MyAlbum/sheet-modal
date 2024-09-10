import { SnapPoint } from '../types';

type convertSnapPointsConfig = {
  windowHeight: number;
  maxHeight: number;
  minHeight: number;
};

export const convertSnapPoints = (snapPoints: SnapPoint[], config: convertSnapPointsConfig) => {
  // If maxHeight is 0, we don't need to calculate snap points
  if (config.maxHeight <= 0) {
    return [];
  }

  const percentageSnappointIndices: Array<number> = [];

  // Convert percentage snap points to absolute values
  let newSpapPoints = snapPoints.map((_s, i) => {
    if (typeof _s === 'string') {
      percentageSnappointIndices.push(i);
      const percentage = parseInt(_s.replace('%', ''), 10);
      return Math.min(config.maxHeight, config.windowHeight * (percentage / 100));
    } else {
      return _s;
    }
  });

  // Remove non consecutive snap points
  newSpapPoints = newSpapPoints.filter((_s, index, arr) => {
    if (_s === 0) {
      return false;
    }

    if (index === arr.length - 1) {
      return true;
    }

    const isValid = _s < arr[index + 1]!;
    if (!isValid) {
      // Only warn if it's not a percentage snap point
      if (!percentageSnappointIndices.includes(index)) {
        console.warn(`Invalid snap points detected. Snap points must be in ascending order.`);
      }
    }

    return isValid;
  });

  // Remove snap points larger than maxHeight
  let didRemoveMax = false;
  newSpapPoints = newSpapPoints.filter((_s) => {
    const isSmallerThanMax = _s <= config.maxHeight;

    if (!isSmallerThanMax) {
      didRemoveMax = true;
    }

    return isSmallerThanMax;
  });

  // Add maxHeight is snappoints larger than maxHeight were removed
  if (didRemoveMax) {
    newSpapPoints.push(config.maxHeight);
  }

  // Remove snap points smaller than minHeight
  let r = newSpapPoints.filter((_s) => _s >= config.minHeight);

  // We removed some snap points smaller than minHeight, add minHeight as first snap point if it's not already there
  if (r.length < newSpapPoints.length && r[0] !== config.minHeight) {
    newSpapPoints.unshift(config.minHeight);
  }

  // Remove duplicates
  newSpapPoints = newSpapPoints.filter((_s, index, arr) => arr.indexOf(_s) === index);

  return newSpapPoints;
};

export const getNextSnapPointIndex = (_snapPoints: number[], _y: number) => {
  'worklet';

  const filterValue = Math.min(_y, Math.max(..._snapPoints));
  return _snapPoints.findIndex((point) => {
    return point > filterValue;
  });
};

export const getPreviousSnapPointIndex = (_snapPoints: number[], _y: number) => {
  'worklet';
  const filterValue = Math.max(_y, Math.min(..._snapPoints));
  const snaps = [..._snapPoints].reverse();

  const reverseIndex = snaps.findIndex((point) => {
    return point < filterValue;
  });

  if (reverseIndex === -1) {
    return -1;
  }

  return snaps.length - reverseIndex - 1;
};
