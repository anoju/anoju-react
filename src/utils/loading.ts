// src/utils/loading.ts
export interface LoadingOptions {
  text?: string;
  delay?: number;
  icon?: React.ReactNode | null;
  bodyLock?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

interface LoadingState {
  isVisible: boolean;
  options: LoadingOptions;
}

// 전역 로딩 상태 관리 클래스
class LoadingManager {
  private static instance: LoadingManager;
  private state: LoadingState = {
    isVisible: false,
    options: {}
  };
  private listeners: Set<(state: LoadingState) => void> = new Set();
  private delayTimer: NodeJS.Timeout | null = null;
  private originalBodyOverflow: string = '';

  static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(listener => listener(this.state));
  }

  private lockBody(): void {
    if (typeof document !== 'undefined') {
      this.originalBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockBody(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = this.originalBodyOverflow || '';
    }
  }

  show(options: LoadingOptions = {}): void {
    if (this.state.isVisible) {
      this.state.options = { ...this.state.options, ...options };
      this.notify();
      return;
    }

    const delay = options.delay || 0;

    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
    }

    if (delay > 0) {
      this.delayTimer = setTimeout(() => {
        this.showImmediate(options);
      }, delay);
    } else {
      this.showImmediate(options);
    }
  }

  private showImmediate(options: LoadingOptions): void {
    this.state = {
      isVisible: true,
      options: {
        text: '로딩 중...',
        bodyLock: false,
        ...options
      }
    };

    if (this.state.options.bodyLock) {
      this.lockBody();
    }

    this.notify();

    if (this.state.options.onShow) {
      setTimeout(() => {
        this.state.options.onShow?.();
      }, 0);
    }
  }

  hide(): void {
    if (!this.state.isVisible) {
      return;
    }

    if (this.delayTimer) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
    }

    const prevOptions = this.state.options;

    this.state = {
      isVisible: false,
      options: {}
    };

    if (prevOptions.bodyLock) {
      this.unlockBody();
    }

    this.notify();

    if (prevOptions.onHide) {
      setTimeout(() => {
        prevOptions.onHide?.();
      }, 0);
    }
  }

  toggle(options?: LoadingOptions): void {
    if (this.state.isVisible) {
      this.hide();
    } else {
      this.show(options);
    }
  }

  set(visible: boolean, options?: LoadingOptions): void {
    if (visible) {
      this.show(options);
    } else {
      this.hide();
    }
  }

  get(): boolean {
    return this.state.isVisible;
  }

  async withPromise<T>(promise: Promise<T>, options?: LoadingOptions): Promise<T> {
    this.show(options);
    try {
      const result = await promise;
      this.hide();
      return result;
    } catch (error) {
      this.hide();
      throw error;
    }
  }

  wrapFunction<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    options?: LoadingOptions
  ): (...args: T) => Promise<R> {
    return async (...args: T) => {
      this.show(options);
      try {
        const result = await fn(...args);
        this.hide();
        return result;
      } catch (error) {
        this.hide();
        throw error;
      }
    };
  }
}

// 싱글톤 인스턴스 생성
const loadingManager = LoadingManager.getInstance();

// 편의 함수들 export
export const showGlobalLoading = (options?: LoadingOptions): void => {
  loadingManager.show(options);
};

export const hideGlobalLoading = (): void => {
  loadingManager.hide();
};

export const setGlobalLoading = (visible: boolean, options?: LoadingOptions): void => {
  loadingManager.set(visible, options);
};

export const getGlobalLoading = (): boolean => {
  return loadingManager.get();
};

export function withLoading<T>(promise: Promise<T>, options?: LoadingOptions): Promise<T> {
  return loadingManager.withPromise(promise, options);
}

export function wrapWithLoading<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  options?: LoadingOptions
): (...args: T) => Promise<R> {
  return loadingManager.wrapFunction(fn, options);
}

// $loading 스타일 API
export const $loading = {
  show: (options?: LoadingOptions): void => {
    loadingManager.show(options);
  },
  hide: (): void => {
    loadingManager.hide();
  },
  toggle: (options?: LoadingOptions): void => {
    loadingManager.toggle(options);
  },
  set: (visible: boolean, options?: LoadingOptions): void => {
    loadingManager.set(visible, options);
  },
  get: (): boolean => {
    return loadingManager.get();
  },
  with: function<T>(promise: Promise<T>, options?: LoadingOptions): Promise<T> {
    return loadingManager.withPromise(promise, options);
  },
  wrap: function<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    options?: LoadingOptions
  ): (...args: T) => Promise<R> {
    return loadingManager.wrapFunction(fn, options);
  }
};

export default loadingManager;
