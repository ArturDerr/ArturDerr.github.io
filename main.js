document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.skill-item');
  items.forEach(item => {
    const toggle = item.querySelector('.skill-toggle');
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      items.forEach(i => closeItem(i));
      if (!isOpen) openItem(item);
    });
  });
  function openItem(item) {
    item.classList.add('is-open');

    item.querySelector('.skill-content').classList.remove('grid-rows-[0fr]', 'opacity-0');
    item.querySelector('.skill-content').classList.add('grid-rows-[1fr]', 'opacity-100');

    item.querySelector('.skill-icon').classList.remove('rotate-0');
    item.querySelector('.skill-icon').classList.add('rotate-45');
  }
  function closeItem(item) {
    item.classList.remove('is-open');

    item.querySelector('.skill-content').classList.remove('grid-rows-[1fr]', 'opacity-100');
    item.querySelector('.skill-content').classList.add('grid-rows-[0fr]', 'opacity-0');

    item.querySelector('.skill-icon').classList.remove('rotate-45');
    item.querySelector('.skill-icon').classList.add('rotate-0');
  }
  const inViewEl = document.querySelector('.skills-inview');
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        inViewEl.classList.remove('opacity-0', 'translate-y-[5px]', 'blur-[4px]');
        inViewEl.classList.add('opacity-100', 'translate-y-0', 'blur-0');
        observer.disconnect();
      }
    },
    { rootMargin: '0px 0px -100px 0px' }
  );

  const defaultItem = document.querySelector('.skill-item[data-skill="frontend"]')

  if (defaultItem) {
    openItem(defaultItem)
  }

  observer.observe(inViewEl);
});

const header = document.getElementById('header');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

let lastScroll = 0;
let open = false;

burger.addEventListener('click', () => {
  open = !open;

  burger.classList.toggle('burger-open', open);
  mobileMenu.classList.toggle('opacity-100', open);
  mobileMenu.classList.toggle('pointer-events-auto', open);

  if (open) {
    targetScroll = currentScroll;
  }
});


mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    open = false;
    burger.classList.remove('burger-open');
    mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
  });
});

const wrapper = document.getElementById('cursor-wrapper')
const cursor = document.getElementById('cursor')

let mouseX = 0
let mouseY = 0
let scale = 1

document.addEventListener('mousemove', e => {
  mouseX = e.clientX
  mouseY = e.clientY
  wrapper.style.transform = `translate(${mouseX - 12}px, ${mouseY - 12}px)`
})

document.querySelectorAll('.cursor-hover').forEach(el => {
  el.addEventListener('mouseenter', () => {
    scale = 2.5
    cursor.style.transform = `scale(${scale})`
  })

  el.addEventListener('mouseleave', () => {
    scale = 1
    cursor.style.transform = `scale(${scale})`
  })
})

let currentScroll = 0
let targetScroll = 0
let ease = 0.08

window.addEventListener('wheel', e => {

  if (open) return  

  targetScroll += e.deltaY
  targetScroll = Math.max(0, Math.min(targetScroll, document.body.scrollHeight - window.innerHeight))

  e.preventDefault()

}, { passive: false })


function smoothScroll() {

  if (!open) {
    currentScroll += (targetScroll - currentScroll) * ease
    window.scrollTo(0, currentScroll)
  }

  requestAnimationFrame(smoothScroll)
}

smoothScroll()

let headerLastScroll = 0


function handleHeader() {

  const current = currentScroll
  const isScrolled = current > 80

  if (open) {
    header.style.transform = 'translateY(0)'
  } else {
    if (current > headerLastScroll && current > 120) {
      header.style.transform = 'translateY(-100%)'
    } else {
      header.style.transform = 'translateY(0)'
    }
  }

  header.classList.toggle('bg-white', isScrolled || open)
  header.classList.toggle('bg-transparent', !isScrolled && !open)

  header.classList.toggle('text-black', isScrolled || open)
  header.classList.toggle('text-white', !isScrolled && !open)

  const subtitle = header.querySelector('a.text-white\\/40, a.text-black\\/40')
  if (subtitle) {
    subtitle.classList.toggle('text-black/40', isScrolled || open)
    subtitle.classList.toggle('text-white/40', !isScrolled && !open)
  }

  document.querySelectorAll('#burger .line').forEach(line => {
    const shouldBeBlack = isScrolled && !open; 
    const shouldBeWhite = !isScrolled || open; 

    line.classList.toggle('bg-black', shouldBeBlack)
    line.classList.toggle('bg-white', shouldBeWhite)
  })

  headerLastScroll = current

  requestAnimationFrame(handleHeader)
}

handleHeader()

const revealItems = document.querySelectorAll('.reveal-text, .reveal-fade')

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  {
    threshold: 0.15
  }
)

revealItems.forEach(el => revealObserver.observe(el))

document.addEventListener("DOMContentLoaded", () => {

  const images = document.querySelectorAll("#cases-track img")

  images.forEach(img => {
    const src = img.getAttribute("src")
    const preloadImage = new Image()
    preloadImage.src = src
  })

  const preloader = document.getElementById("preloader")
  const progressText = document.getElementById("progress")

  document.body.classList.add("loading")

  const duration = 1500
  const start = performance.now()

  function animate(time) {
    const elapsed = time - start
    const percent = Math.min(elapsed / duration, 1)

    const progress = Math.floor(percent * 100)
    progressText.textContent = progress + "%"

    const containerHeight = preloader.offsetHeight
    const textHeight = progressText.offsetHeight

    const maxMove = containerHeight - textHeight
    const moveY = maxMove * percent

    progressText.style.transform = `translateY(-${moveY}px)`

    if (percent < 1) {
      requestAnimationFrame(animate)
    } else {
      preloader.style.transition = "opacity 0.6s ease"
      preloader.style.opacity = "0"

      setTimeout(() => {
        preloader.remove()
        document.body.classList.remove("loading")
      }, 600)
    }
  }

  requestAnimationFrame(animate)
})


