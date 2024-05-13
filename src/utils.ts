import { SnapPoint } from "./types";

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
    return _s < arr[index + 1]!;
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
