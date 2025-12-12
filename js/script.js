/*==================== SCROLL TO TOP ON LOAD ====================*/
// Garantir que a página sempre comece no hero principal
(function() {
  // Prevenir scroll automático do navegador ao carregar com hash
  if (window.location.hash) {
    window.history.replaceState(null, null, ' ');
  }
  
  // Forçar scroll para o topo imediatamente
  window.scrollTo(0, 0);
  
  // Garantir no DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.scrollTo(0, 0);
    });
  } else {
    window.scrollTo(0, 0);
  }
  
  // Garantir após o carregamento completo
  window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    // Remover hash da URL se ainda houver
    if (window.location.hash) {
      window.history.replaceState(null, null, ' ');
    }
  });
  
  // Prevenir restauração automática de scroll do navegador
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
})();

/*==================== POINTS ====================*/ 
const points = document.querySelectorAll('.point');
const images = document.querySelectorAll('.img-slider');

let i = 0;

points.forEach((item, index) => {
  item.addEventListener('click', () => {
    console.log("Clicou no ponto: " + (index));

    // Zera todas as imagens
    images[0].style.opacity = "0";
    images[1].style.opacity = "0";
    images[2].style.opacity = "0";
    images[3].style.opacity = "0";

    // Aparece somente aquela que clicou
    images[index].style.opacity = "1";


    points[0].classList.remove("active-point");
    points[1].classList.remove("active-point");
    points[2].classList.remove("active-point");
    points[3].classList.remove("active-point");

    points[index].classList.add("active-point");
  })
})

setInterval(changeBackground, 12000);

function changeBackground(){

  // Zera todas as imagens
  images[0].style.opacity = "0";
  images[1].style.opacity = "0";
  images[2].style.opacity = "0";
  images[3].style.opacity = "0";

  // Aparece somente aquela que clicou
  images[i].style.opacity = "1";

  points[0].classList.remove("active-point");
  points[1].classList.remove("active-point");
  points[2].classList.remove("active-point");
  points[3].classList.remove("active-point");

  points[i].classList.add("active-point");

  i++;

  if(i == 4) i = 0;

  //console.log('trocou de bg');
}

//console.log(points);
//console.log(images[0]);

/*--=========== GSAP SCROLLTRIGGER ============- */
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

  /*--=========== TIMELINE LOADING E HERO ============- */

  var tl1 = gsap.timeline();
    
  tl1
  .to('.screen-loading', {
    duration: 2,
    opacity: 0, 
    delay: 3,
    //filter: 'blur(10px)',
    //y: "-10%",
    ease: "power4.out",
  })
  .from(".bg-hero", {
    duration: 1, 
    opacity: 0, 
    stagger:{each: 0.1},
    ease: "power4.out",
  }, '-=1.0')
  .from("nav div", {
    duration: 2, 
    opacity: 0, 
    y: 400,
    stagger:{each: 0.2},
    ease: "back.out(1.7)",
  }, '-=0.5')
  .from(".box-hero div", {
    duration: 2, 
    opacity: 0, 
    y: 200,
    stagger:{each: 0.2},
    ease: "back.out(1.7)",
  }, '-=1.7')

  /*--=========== WALLPAPERS ANIMATION ============- */
  gsap.from(".wallpaper-item", {
    scrollTrigger: {
      trigger: ".wallpapers-section",
      start: "top 80%",
      toggleActions: "play none none none"
    },
    duration: 1,
    opacity: 0,
    y: 100,
    stagger: {
      each: 0.1,
      from: "start"
    },
    ease: "power3.out"
  });
    
});

ScrollTrigger.addEventListener("scrollStart", () => {
  ScrollTrigger.refresh();
});

/*--=========== WALLPAPERS LIGHTBOX ============- */
let currentImageIndex = 0;
let allWallpaperImages = [];

// Coletar todas as imagens de wallpaper
function initWallpaperImages() {
  const wallpaperImgs = document.querySelectorAll('.wallpaper-image');
  allWallpaperImages = Array.from(wallpaperImgs).map(img => img.src);
}

// Abrir lightbox
function openLightbox(imageSrc, imageIndex = null) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  
  if (!lightbox || !lightboxImage) return;
  
  // Se temos um índice válido, usar diretamente
  if (imageIndex !== null && imageIndex >= 0 && imageIndex < allWallpaperImages.length) {
    currentImageIndex = imageIndex;
    lightboxImage.src = allWallpaperImages[currentImageIndex];
  } else {
    // Tentar encontrar a imagem pelo caminho relativo ou src completo
    const wallpaperImgs = document.querySelectorAll('.wallpaper-image');
    let foundIndex = -1;
    
    // Procurar pela imagem que corresponde ao caminho
    wallpaperImgs.forEach((img, idx) => {
      if (img.src.includes(imageSrc) || imageSrc.includes(img.src.split('/').pop())) {
        foundIndex = idx;
      }
    });
    
    if (foundIndex !== -1) {
      currentImageIndex = foundIndex;
      lightboxImage.src = allWallpaperImages[foundIndex];
    } else if (allWallpaperImages.length > 0) {
      // Fallback: usar primeira imagem
      currentImageIndex = 0;
      lightboxImage.src = allWallpaperImages[0];
    } else {
      // Se não encontrar, tentar usar o imageSrc diretamente
      lightboxImage.src = imageSrc;
      currentImageIndex = 0;
    }
  }
  
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  updateNavButtons();
}

// Fechar lightbox
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Navegar para imagem anterior
function prevImage() {
  const lightboxImage = document.getElementById('lightbox-image');
  if (!lightboxImage) return;
  
  if (currentImageIndex > 0) {
    currentImageIndex--;
  } else {
    currentImageIndex = allWallpaperImages.length - 1;
  }
  lightboxImage.src = allWallpaperImages[currentImageIndex];
  updateNavButtons();
}

// Navegar para próxima imagem
function nextImage() {
  const lightboxImage = document.getElementById('lightbox-image');
  if (!lightboxImage) return;
  
  if (currentImageIndex < allWallpaperImages.length - 1) {
    currentImageIndex++;
  } else {
    currentImageIndex = 0;
  }
  lightboxImage.src = allWallpaperImages[currentImageIndex];
  updateNavButtons();
}

// Atualizar visibilidade dos botões de navegação
function updateNavButtons() {
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  if (allWallpaperImages.length <= 1) {
    if (lightboxPrev) lightboxPrev.style.display = 'none';
    if (lightboxNext) lightboxNext.style.display = 'none';
  } else {
    if (lightboxPrev) lightboxPrev.style.display = 'flex';
    if (lightboxNext) lightboxNext.style.display = 'flex';
  }
}

// Download de imagem
function downloadImage(imageSrc, imageName) {
  try {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = imageName || 'spider-man-wallpaper.jpg';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Remover o link após um pequeno delay
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error('Erro ao baixar imagem:', error);
    // Fallback: abrir imagem em nova aba
    window.open(imageSrc, '_blank');
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Aguardar um pouco para garantir que todos os elementos estejam carregados
  setTimeout(() => {
    const wallpaperViewBtns = document.querySelectorAll('.wallpaper-btn-view');
    const wallpaperDownloadBtns = document.querySelectorAll('.wallpaper-btn-download');
    const wallpaperImgs = document.querySelectorAll('.wallpaper-image');
    const lightboxEl = document.getElementById('lightbox');
    const lightboxCloseBtn = document.querySelector('.lightbox-close');
    const lightboxPrevBtn = document.querySelector('.lightbox-prev');
    const lightboxNextBtn = document.querySelector('.lightbox-next');
    
    // Inicializar imagens de wallpaper
    initWallpaperImages();
    
    // Botões de visualizar
    wallpaperViewBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Encontrar o wallpaper-item pai
        const wallpaperItem = btn.closest('.wallpaper-item');
        if (wallpaperItem) {
          // Encontrar a imagem dentro do wallpaper-item
          const wallpaperImg = wallpaperItem.querySelector('.wallpaper-image');
          if (wallpaperImg) {
            // Encontrar o índice da imagem na lista
            const imageIndex = Array.from(wallpaperImgs).indexOf(wallpaperImg);
            if (imageIndex !== -1) {
              openLightbox(wallpaperImg.src, imageIndex);
            } else {
              openLightbox(wallpaperImg.src, null);
            }
          }
        }
      });
    });
    
    // Botões de download
    wallpaperDownloadBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Encontrar o wallpaper-item pai
        const wallpaperItem = btn.closest('.wallpaper-item');
        if (wallpaperItem) {
          // Encontrar a imagem dentro do wallpaper-item
          const wallpaperImg = wallpaperItem.querySelector('.wallpaper-image');
          if (wallpaperImg) {
            const imageSrc = wallpaperImg.src;
            const imageName = btn.getAttribute('data-name') || 'spider-man-wallpaper.jpg';
            downloadImage(imageSrc, imageName);
          }
        }
      });
    });
    
    // Clicar na imagem também abre o lightbox
    wallpaperImgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        openLightbox(img.src, index);
      });
    });
    
    // Fechar lightbox
    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }
    
    // Fechar ao clicar fora da imagem
    if (lightboxEl) {
      lightboxEl.addEventListener('click', (e) => {
        if (e.target === lightboxEl) {
          closeLightbox();
        }
      });
    }
    
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
      if (!lightboxEl || !lightboxEl.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    });
    
    // Botões de navegação
    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
      });
    }
    
    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
      });
    }
    
    // Smooth scroll para âncora #wallpapers
    document.querySelectorAll('a[href="#wallpapers"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Scroll down button - scroll suave para wallpapers
    const scrollDownBtn = document.querySelector('.scroll-down');
    if (scrollDownBtn) {
      scrollDownBtn.style.cursor = 'pointer';
      scrollDownBtn.addEventListener('click', () => {
        const wallpapersSection = document.querySelector('#wallpapers');
        if (wallpapersSection) {
          const headerOffset = 80;
          const elementPosition = wallpapersSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    }
  }, 100);
});