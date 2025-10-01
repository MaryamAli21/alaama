// Navigation utility for smooth scrolling with header offset

let isNavigating = false;

export const scrollToSection = (sectionId) => {
  // Remove # if it's already included
  const id = sectionId.startsWith('#') ? sectionId.slice(1) : sectionId;
  const element = document.getElementById(id);
  
  if (element) {
    // Set navigation flag
    isNavigating = true;
    
    // Immediately show all elements in the target section and nearby sections
    const allSections = document.querySelectorAll('section[id]');
    const targetSectionIndex = Array.from(allSections).findIndex(section => section.id === id);
    
    // Show target section and adjacent sections immediately
    for (let i = Math.max(0, targetSectionIndex - 1); i <= Math.min(allSections.length - 1, targetSectionIndex + 1); i++) {
      const section = allSections[i];
      const sectionElements = section.querySelectorAll('[data-scroll]');
      sectionElements.forEach(el => {
        el.classList.add('is-inview');
        el.style.opacity = '1';
        el.style.transform = 'none';
        el.style.transition = 'none';
      });
    }

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
      // Remove inline styles to let locomotive scroll take over naturally
      const allElements = document.querySelectorAll('[data-scroll]');
      allElements.forEach(el => {
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
      });
    }, 1500);
  } else {
    console.warn(`Element with ID "${id}" not found`);
  }
};

// Export flag to check if programmatic navigation is happening
export const isNavigatingProgrammatically = () => isNavigating;

export default scrollToSection;