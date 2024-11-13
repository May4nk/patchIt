export function changeToThemeColor(color: string) {
  const eleThemeBg = document.querySelectorAll(
    ".themebg"
  ) as NodeListOf<HTMLElement>;

  const eleThemeColor = document.querySelectorAll(
    ".themecolor"
  ) as NodeListOf<HTMLElement>;

  const eleThemeMetaTxt = document.querySelectorAll(
    ".thememetanhtext"
  ) as NodeListOf<HTMLElement>;

  const eleThemeInactiveBtnBg = document.querySelectorAll(
    ".themeinactivebtnbg"
  ) as NodeListOf<HTMLElement>;

  if (eleThemeColor) {
    eleThemeColor.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-color: color-mix(in srgb, ${color} 80%, rgba(255, 255, 255, 0.8) 20%)`;
    });
  }

  if (eleThemeBg) {
    eleThemeBg.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-background-color: ${color}`;
    });
  }

  if (eleThemeMetaTxt) {
    eleThemeMetaTxt.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-meta-no-highlight-text-color: color-mix(
        in srgb, ${color} 10%, rgba(255, 255, 255, 0.4) 90%
      )`;
    });
  }

  if (eleThemeInactiveBtnBg) {
    eleThemeInactiveBtnBg.forEach((ele: HTMLElement) => {
      ele.style.cssText = `--main-background-inactive-color: color-mix(in srgb, ${color} 60%, black 40%)`;
    });
  }
}
