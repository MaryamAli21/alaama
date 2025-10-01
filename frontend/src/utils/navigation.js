// Navigation utility for smooth scrolling with header offset

let isNavigating = false;

export const scrollToSection = (sectionId) => {
  // Remove # if it's already included
  const id = sectionId.startsWith('#') ? sectionId.slice(1) : sectionId;
  const element = document.getElementById(id);
  
  if (element) {
    // Set navigation flag
    isNavigating = true;
    
    // Immediately show all elements in the target section
    const sectionElements = element.querySelectorAll('[data-scroll]');
    sectionElements.forEach(el => {
      el.classList.add('is-inview');
      el.style.opacity = '1';
      el.style.transform = 'none';
    });

    const headerHeight = 120; // Fixed header height in pixels
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - headerHeight);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Reset navigation flag after scroll completes
    setTimeout(() => {
      isNavigating = false;
      // Remove inline styles to let CSS take over
      sectionElements.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
      });
    }, 1000);
  } else {
    console.warn(`Element with ID "${id}" not found`);
  }
};

// Export flag to check if programmatic navigation is happening
export const isNavigatingProgrammatically = () => isNavigating;

export default scrollToSection;