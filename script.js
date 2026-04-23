document.addEventListener('DOMContentLoaded', () => {
	const body = document.body;
	const themeToggle = document.querySelector('.theme-toggle');
	const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
	const ctaButton = document.querySelector('.cta-btn');
	const projectsSection = document.querySelector('#projects');
	const sections = document.querySelectorAll('.section');
	const canvas = document.getElementById('particles');
	const context = canvas ? canvas.getContext('2d') : null;
	const contactForm = document.getElementById('contact-form');
	const contactFormStatus = document.getElementById('contact-form-status');

	const setThemeIcon = () => {
		if (!themeIcon) {
			return;
		}

		themeIcon.className = body.classList.contains('dark-mode') ? 'fas fa-moon' : 'fas fa-sun';
	};

	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			body.classList.toggle('dark-mode');
			setThemeIcon();
		});
	}

	if (ctaButton && projectsSection) {
		ctaButton.addEventListener('click', () => {
			projectsSection.scrollIntoView({ behavior: 'smooth' });
		});
	}

	if (contactForm) {
		contactForm.addEventListener('submit', async (event) => {
			event.preventDefault();

			const submitButton = contactForm.querySelector('button[type="submit"]');
			const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';
			if (submitButton) {
				submitButton.disabled = true;
				submitButton.textContent = 'Sending...';
			}

			if (contactFormStatus) {
				contactFormStatus.textContent = 'Sending your message...';
				contactFormStatus.className = 'contact-form-status';
			}

			try {
				const response = await fetch(contactForm.action, {
					method: 'POST',
					body: new FormData(contactForm),
					headers: {
						Accept: 'application/json',
					},
				});

				if (!response.ok) {
					throw new Error('Failed to send');
				}

				if (contactFormStatus) {
					contactFormStatus.textContent = 'Message sent successfully. Check your email inbox for new messages.';
					contactFormStatus.className = 'contact-form-status success';
				}

				contactForm.reset();
			} catch (error) {
				if (contactFormStatus) {
					contactFormStatus.textContent = 'Unable to send right now. Please try again in a moment.';
					contactFormStatus.className = 'contact-form-status error';
				}
			} finally {
				if (submitButton) {
					submitButton.disabled = false;
					submitButton.textContent = originalButtonText;
				}
			}
		});
	}

	const sectionObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate');
			}
		});
	}, { threshold: 0.2 });

	sections.forEach((section) => sectionObserver.observe(section));

	if (canvas && context) {
		const particles = [];
		const particleCount = 40;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const createParticle = () => ({
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * 2 + 0.5,
			speedX: (Math.random() - 0.5) * 0.6,
			speedY: (Math.random() - 0.5) * 0.6,
		});

		const drawParticles = () => {
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.fillStyle = 'rgba(0, 206, 201, 0.55)';

			particles.forEach((particle) => {
				particle.x += particle.speedX;
				particle.y += particle.speedY;

				if (particle.x < 0 || particle.x > canvas.width) {
					particle.speedX *= -1;
				}

				if (particle.y < 0 || particle.y > canvas.height) {
					particle.speedY *= -1;
				}

				context.beginPath();
				context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
				context.fill();
			});

			requestAnimationFrame(drawParticles);
		};

		resizeCanvas();
		for (let index = 0; index < particleCount; index += 1) {
			particles.push(createParticle());
		}

		window.addEventListener('resize', resizeCanvas);
		drawParticles();
	}

	setThemeIcon();
});