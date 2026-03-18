export function useTour() {
  const { t } = useI18n()

  async function startTour() {
    if (!import.meta.client) return

    const Shepherd = await import('shepherd.js')

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
        classes: 'shepherd-theme-custom',
      },
    })

    tour.addStep({
      id: 'welcome',
      title: t('common.tour'),
      text: t('home.tourWelcome'),
      buttons: [
        { text: t('common.next'), action: () => tour.next(), classes: 'shepherd-btn-primary' },
      ],
    })

    tour.addStep({
      id: 'nav',
      title: 'Navigation',
      text: 'Use the top navigation bar to explore different sections of the portfolio.',
      attachTo: { element: '.app-topbar', on: 'bottom' },
      buttons: [
        { text: t('common.back'), action: () => tour.back() },
        { text: t('common.next'), action: () => tour.next(), classes: 'shepherd-btn-primary' },
      ],
    })

    tour.addStep({
      id: 'fab',
      title: 'Control Hub',
      text: 'This floating button is your control center! Click it to access themes, music, language settings, and more. You can drag it anywhere on the screen.',
      attachTo: { element: '.floating-fab', on: 'left' },
      buttons: [
        { text: t('common.back'), action: () => tour.back() },
        { text: t('common.next'), action: () => tour.next(), classes: 'shepherd-btn-primary' },
      ],
    })

    tour.addStep({
      id: 'hero',
      title: 'Welcome Section',
      text: 'This is the main landing area. Check out the interactive code window and orbiting tech icons!',
      attachTo: { element: '.hero-section', on: 'bottom' },
      buttons: [
        { text: t('common.back'), action: () => tour.back() },
        { text: t('common.next'), action: () => tour.next(), classes: 'shepherd-btn-primary' },
      ],
    })

    tour.addStep({
      id: 'skills',
      title: 'Skills & Technologies',
      text: 'Click on any skill card to see detailed information and related projects.',
      attachTo: { element: '.skills-section', on: 'top' },
      buttons: [
        { text: t('common.back'), action: () => tour.back() },
        { text: t('common.close'), action: () => tour.complete(), classes: 'shepherd-btn-primary' },
      ],
    })

    tour.start()
    return tour
  }

  return { startTour }
}
