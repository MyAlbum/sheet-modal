import { SnapPoint } from "../types";

type convertSnapPointsConfig = {
  windowHeight: number;
  maxHeight: number;
  minHeight: number;
};

export const convertSnapPoints = (
  snapPoints: SnapPoint[],
  config: convertSnapPointsConfig
) => {
  if (config.maxHeight <= 0) {
    return [];
  }

  let s = snapPoints.map((_s) => {
    if (typeof _s === "string") {
      const percentage = parseInt(_s.replace("%", ""), 10);
      return Math.min(
        config.maxHeight,
        config.windowHeight * (percentage / 100)
      );
    } else {
      return _s;
    }
  });

  s = s.filter((_s, index, arr) => {
    if (_s === 0) {
      return false;
    }

    if (index === arr.length - 1) {
      return true;
    }

    const isValid = _s < arr[index + 1]!;
    if (!isValid) {
      console.warn(
        `Invalid snap points detected. Snap points must be in ascending order.`
      );
    }

    return isValid;
  });

  // Remove snap points larger than maxHeight
  s = s.filter((_s) => _s <= config.maxHeight);

  // Remove snap points smaller than minHeight
  let r = s.filter((_s) => _s >= config.minHeight);
  if (r.length < s.length && r[0] !== config.minHeight) {
    // We removed some snap points smaller than minHeight, add minHeight as first snap point if it's not already there
    s.unshift(config.minHeight);
  }

  // Remove duplicates
  s = s.filter((_s, index, arr) => arr.indexOf(_s) === index);

  return s;
};

export const getNextSnapPointIndex = (_snapPoints: number[], _y: number) => {
  "worklet";

  const filterValue = Math.min(_y, Math.max(..._snapPoints));
  return _snapPoints.findIndex((point) => {
    return point > filterValue;
  }) as number;
};

export const getPreviousSnapPointIndex = (
  _snapPoints: number[],
  _y: number
) => {
  "worklet";
  const filterValue = Math.max(_y, Math.min(..._snapPoints));
  const snaps = [..._snapPoints].reverse();

  const reverseIndex = snaps.findIndex((point) => {
    return point < filterValue;
  }) as number;

  if (reverseIndex === -1) {
    return -1;
  }

  return snaps.length - reverseIndex - 1;
};
