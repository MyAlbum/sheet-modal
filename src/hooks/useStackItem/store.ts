import { SharedValue } from 'react-native-reanimated';

type StackItem = {
  id: String;
  isActive: SharedValue<boolean>;
};

export class FocusStack {
  stackItems: StackItem[] = [];

  isActive = (id: String) => {
    return this.stackItems.some((v) => v.id === id && v.isActive.value);
  };

  push = (id: StackItem['id'], isActive: SharedValue<boolean>) => {
    this.stackItems = this.stackItems.filter((v) => v.id !== id);

    this.stackItems.push({
      id,
      isActive,
    });

    this.notify();
  };

  notify = () => {
    if (this.stackItems.length === 0) {
      return;
    }
    const activeItem = this.stackItems.at(-1);
    this.stackItems.forEach((item) => {
      const _isActive = item.id === activeItem?.id;
      item.isActive.value = _isActive;
    });
  };

  remove = (id: String) => {
    this.stackItems = this.stackItems.filter((v) => {
      const keep = v.id !== id;
      if (!keep) {
        v.isActive.value = false;
      }

      return keep;
    });

    this.notify();
  };

  getTop() {
    return this.stackItems.at(-1);
  }
}
