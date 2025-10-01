// Navigation utility for smooth scrolling with header offset

export const scrollToSection = (sectionId) => {
  // Remove # if it's already included
  const id = sectionId.startsWith('#') ? sectionId.slice(1) : sectionId;
  const element = document.getElementById(id);
  
  if (element) {
    const headerHeight = 120; // Fixed header height in pixels
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerHeight);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  } else {
    console.warn(`Element with ID "${id}" not found`);
  }
};

export default scrollToSection;