// Navigation utility for smooth scrolling with header offset

export const scrollToSection = (sectionId) => {
  const element = document.querySelector(sectionId);
  if (element) {
    const headerHeight = 120; // Fixed header height in pixels
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export default scrollToSection;