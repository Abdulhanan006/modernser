document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    const servicePanels = document.querySelectorAll('.service-panel');
    const breakpoint = 768;

    // --- Desktop Tabs Logic ---
    function activateTab(targetId) {
        // Only run desktop logic if above breakpoint
        if (window.innerWidth > breakpoint) {
            // Remove active class from all tabs and panels
            tabBtns.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            servicePanels.forEach(panel => panel.classList.remove('active'));

            // Add active class to clicked tab and its panel
            const selectedTab = document.querySelector(`.tab-btn[data-target="${targetId}"]`);
            const selectedPanel = document.getElementById(targetId);

            if (selectedTab && selectedPanel) {
                selectedTab.classList.add('active');
                selectedTab.setAttribute('aria-selected', 'true');
                selectedPanel.classList.add('active');
            }
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            activateTab(targetId);
        });
    });

    // --- Mobile Accordion Logic ---
    function toggleAccordion(targetId) {
        if (window.innerWidth <= breakpoint) {
            const headerClicked = document.querySelector(`.accordion-header[data-target="${targetId}"]`);
            const panelToToggle = document.getElementById(targetId);
            const contentToToggle = panelToToggle.querySelector('.panel-content');

            const isCurrentlyActive = panelToToggle.classList.contains('active');

            // Collapse all other sections (Optional but requested)
            servicePanels.forEach(panel => {
                if (panel.id !== targetId && panel.classList.contains('active')) {
                    panel.classList.remove('active');
                    const header = panel.querySelector('.accordion-header');
                    header.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                    const content = panel.querySelector('.panel-content');
                    content.style.maxHeight = null;
                }
            });

            // Toggle clicked section
            if (isCurrentlyActive) {
                // Close it
                panelToToggle.classList.remove('active');
                headerClicked.classList.remove('active');
                headerClicked.setAttribute('aria-expanded', 'false');
                contentToToggle.style.maxHeight = null;
            } else {
                // Open it
                panelToToggle.classList.add('active');
                headerClicked.classList.add('active');
                headerClicked.setAttribute('aria-expanded', 'true');
                const inner = contentToToggle.querySelector('.panel-content-inner');
                contentToToggle.style.maxHeight = inner.scrollHeight + "px";
            }
        }
    }

    accordionHeaders.forEach(header => {
        header.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            toggleAccordion(targetId);
        });
    });

    // --- Handle Resize to fix state inconsistencies ---
    window.addEventListener('resize', () => {
        if (window.innerWidth > breakpoint) {
            // Switching to desktop: clear inline max-height from mobile
            servicePanels.forEach(panel => {
                const content = panel.querySelector('.panel-content');
                content.style.maxHeight = null;
                
                // If it's active in mobile, keep it active in desktop.
                // If nothing is active, activate the first one.
            });
            
            const anyActive = document.querySelector('.service-panel.active');
            if (!anyActive && servicePanels.length > 0) {
                activateTab(servicePanels[0].id);
            } else if (anyActive) {
                activateTab(anyActive.id);
            }
            
            // remove active class from all accordion headers to clean up
            accordionHeaders.forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
            });
        } else {
            // Switching to mobile
            // Set max height for currently active panel
            servicePanels.forEach(panel => {
                const content = panel.querySelector('.panel-content');
                const header = panel.querySelector('.accordion-header');
                
                if (panel.classList.contains('active')) {
                    const inner = content.querySelector('.panel-content-inner');
                    content.style.maxHeight = inner.scrollHeight + "px";
                    header.classList.add('active');
                    header.setAttribute('aria-expanded', 'true');
                } else {
                    content.style.maxHeight = null;
                    header.classList.remove('active');
                    header.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });

    // Initialize state on load for mobile
    if (window.innerWidth <= breakpoint) {
        const activePanel = document.querySelector('.service-panel.active');
        if (activePanel) {
            const content = activePanel.querySelector('.panel-content');
            const inner = content.querySelector('.panel-content-inner');
            content.style.maxHeight = inner.scrollHeight + "px";
            const header = activePanel.querySelector('.accordion-header');
            header.classList.add('active');
            header.setAttribute('aria-expanded', 'true');
        }
    }
});
