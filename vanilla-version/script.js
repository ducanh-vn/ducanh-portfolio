// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  initPreloader();
  initCustomCursor();
});

// 1. Preloader Logic (Exact Power-Arc Loading Screen from q-hjv.com)
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const path1 = document.getElementById('path1');
  const path2 = document.getElementById('path2');
  const percentEl = document.getElementById('percent');

  if (!path1 || !path2 || !percentEl) return;

  // Measure exact SVG stroke lengths
  const len1 = path1.getTotalLength ? path1.getTotalLength() : 125;
  const len2 = path2.getTotalLength ? path2.getTotalLength() : 380;

  // Initial stroke state (hidden)
  path1.style.strokeDasharray = `${len1}`;
  path1.style.strokeDashoffset = `${len1}`;
  path2.style.strokeDasharray = `${len2}`;
  path2.style.strokeDashoffset = `${len2}`;

  let progress = 0;
  const duration = 1800; // 1.8 seconds smooth loading
  const startTime = performance.now();

  function animateLoading(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min(1, elapsed / duration);

    // Smooth easeOutCubic curve
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentPercent = Math.round(eased * 100);

    percentEl.textContent = `${currentPercent}%`;
    path1.style.strokeDashoffset = len1 * (1 - eased);
    path2.style.strokeDashoffset = len2 * (1 - eased);

    if (progress < 1) {
      requestAnimationFrame(animateLoading);
    } else {
      // 100% Reached: Turn everything into neon yellow (#f1f505) and fill shape
      percentEl.textContent = '100%';
      path1.style.strokeDashoffset = '0';
      path2.style.strokeDashoffset = '0';
      preloader.classList.add('completed');

      // After 600ms pause, wipe up the screen curtain
      setTimeout(() => {
        preloader.classList.add('wipe-up');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 950);
      }, 600);
    }
  }

  requestAnimationFrame(animateLoading);
}

// 2. Custom Interactive Cursor
function initCustomCursor() {
  const dot = document.getElementById('cursorDot');
  const follower = document.getElementById('cursorFollower');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });
  
  // Smooth Lerp loop for follower ring
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);
  
  // Hover effect listeners
  function refreshCursorHoverListeners() {
    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const type = el.getAttribute('data-cursor');
        if (type === 'view') {
          follower.classList.add('view-mode');
        } else if (type === 'pointer') {
          follower.classList.add('hovering');
        }
      });
      el.addEventListener('mouseleave', () => {
        follower.classList.remove('view-mode');
        follower.classList.remove('hovering');
      });
    });
  }
  refreshCursorHoverListeners();
  window.refreshCursor = refreshCursorHoverListeners;
}

// 3. View Switcher with Cinematic Curtain Transition
let isTransitioning = false;

function switchView(viewName) {
  if (isTransitioning) return;

  const curtain = document.getElementById('pageTransition');
  const home = document.getElementById('homeView');
  const about = document.getElementById('aboutView');
  const navAboutBtn = document.getElementById('navAboutBtn');

  if (!curtain) {
    performViewSwitch(viewName, home, about, navAboutBtn);
    return;
  }

  isTransitioning = true;

  // Step 1: Reset curtain at bottom
  curtain.style.transition = 'none';
  curtain.classList.remove('in', 'out');
  curtain.style.transform = 'translateY(100%)';
  void curtain.offsetHeight; // force reflow

  // Step 2: Sweep curtain upwards to cover screen
  curtain.style.transition = 'transform 0.42s cubic-bezier(0.77, 0, 0.175, 1)';
  curtain.classList.add('in');

  // Step 3: At mid-point (screen fully covered)
  setTimeout(() => {
    performViewSwitch(viewName, home, about, navAboutBtn);

    // Step 4: Continue sweeping curtain upwards off-screen
    curtain.classList.remove('in');
    curtain.classList.add('out');

    // Step 5: Reset after curtain clears
    setTimeout(() => {
      curtain.classList.remove('out');
      curtain.style.transform = 'translateY(100%)';
      isTransitioning = false;
    }, 450);
  }, 400);
}

function performViewSwitch(viewName, home, about, navAboutBtn) {
  if (viewName === 'about') {
    home.classList.remove('active');
    about.classList.add('active');
    navAboutBtn.textContent = 'Home';
  } else {
    about.classList.remove('active');
    home.classList.add('active');
    navAboutBtn.textContent = 'About';
  }

  window.scrollTo({ top: 0, behavior: 'instant' });

  if (window.lucide) {
    lucide.createIcons();
  }
  if (window.refreshCursor) {
    window.refreshCursor();
  }
}

function toggleAboutView() {
  const about = document.getElementById('aboutView');
  if (about.classList.contains('active')) {
    switchView('home');
  } else {
    switchView('about');
  }
}

// 4. Off-canvas Project Drawer
function toggleDrawer(isOpen) {
  const drawer = document.getElementById('projectDrawer');
  const overlay = document.getElementById('drawerOverlay');
  
  if (isOpen) {
    drawer.classList.add('open');
    overlay.classList.add('open');
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }
}

// Keyboard ESC to close drawer or modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    toggleDrawer(false);
    closeProjectModal();
  }
});

// 5. Project Detail Modal Data & Logic
const projectsData = {
  nhatropro: {
    category: "Featured Fullstack Web App",
    title: "Nhà Trọ Pro",
    desc: "Nền tảng công nghệ toàn diện giải quyết bài toán tìm kiếm và vận hành phòng trọ. Ứng dụng cung cấp bảng điều khiển quản lý doanh thu, phòng ốc và số điện nước, kết hợp cùng giao diện người thuê trực quan, thân thiện trên mọi thiết bị.",
    badges: ["TypeScript", "React.js", "Tailwind CSS", "Vite", "Vercel"],
    liveDemo: "https://nhatropro-lldr.vercel.app",
    github: "https://github.com/ducanh-vn/nhatropro",
    features: [
      {
        title: "Bảng điều khiển quản lý phòng trọ",
        detail: "Theo dõi số lượng phòng trống, hợp đồng thuê, hóa đơn dịch vụ và chỉ số điện nước theo tháng trực quan."
      },
      {
        title: "Bộ lọc & Tìm kiếm thông minh",
        detail: "Tìm kiếm phòng theo khu vực, mức giá, tiện ích đi kèm với tốc độ phản hồi tức thì."
      },
      {
        title: "Giao diện Responsive chuẩn chỉnh",
        detail: "Tối ưu hóa hiển thị mượt mà trên cả điện thoại di động, máy tính bảng và desktop với Tailwind CSS."
      },
      {
        title: "Kiến trúc TypeScript vững chắc",
        detail: "Mã nguồn chặt chẽ với hệ thống type rõ ràng, giảm thiểu lỗi runtime và dễ dàng mở rộng."
      }
    ]
  },
  chatapp: {
    category: "Realtime Communication",
    title: "Real-time Chat App",
    desc: "Ứng dụng nhắn tin tức thời kết nối người dùng thông qua giao thức WebSocket thời gian thực. Hỗ trợ tạo phòng chat, gửi nhận tin nhắn trực tiếp với độ trễ siêu thấp và thông báo trạng thái hoạt động.",
    badges: ["React.js", "JavaScript", "Socket.io", "Node.js", "CSS3"],
    liveDemo: "https://chat-app-snowy-sigma.vercel.app",
    github: "https://github.com/ducanh-vn/chat-app",
    features: [
      {
        title: "Giao tiếp Socket.io thời gian thực",
        detail: "Đồng bộ hóa tin nhắn tức thì giữa nhiều người dùng mà không cần reload trang."
      },
      {
        title: "Trạng thái online / typing",
        detail: "Hiển thị người dùng đang online hoặc đang soạn thảo tin nhắn trực tiếp."
      },
      {
        title: "Giao diện trò chuyện tối giản",
        detail: "Bố cục tinh tế, tập trung vào trải nghiệm gõ và đọc tin nhắn nhanh gọn."
      },
      {
        title: "Triển khai Cloud trên Vercel",
        detail: "Tự động build và phân phối qua mạng CDN toàn cầu với thời gian phản hồi nhanh."
      }
    ]
  },
  blog: {
    category: "Fullstack Architecture",
    title: "Fullstack Blog System",
    desc: "Hệ thống quản lý nội dung và bài viết với 39+ commits chất lượng. Tích hợp xác thực tài khoản JWT bảo mật, quản lý bài viết theo danh mục và kiến trúc RESTful API chuẩn.",
    badges: ["Node.js", "Express.js", "JavaScript", "RESTful API", "JWT"],
    liveDemo: "https://github.com/ducanh-vn/fullstack_blog_app",
    github: "https://github.com/ducanh-vn/fullstack_blog_app",
    features: [
      {
        title: "Xác thực & Phân quyền bảo mật",
        detail: "Đăng nhập, đăng ký và cấp token JWT cho từng phiên làm việc của tác giả."
      },
      {
        title: "CRUD bài viết hoàn chỉnh",
        detail: "Hỗ trợ soạn thảo, chỉnh sửa, gắn thẻ danh mục và quản lý trạng thái xuất bản."
      },
      {
        title: "RESTful API chuẩn hóa",
        detail: "Cấu trúc endpoint mạch lạc, xử lý mã trạng thái HTTP và lỗi tập trung."
      },
      {
        title: "Lịch sử 39+ commits kiên trì",
        detail: "Minh chứng cho quá trình phát triển bền bỉ, từng bước hoàn thiện tính năng."
      }
    ]
  },
  vanhoa: {
    category: "Community Management",
    title: "Quản Lý Nhà Văn Hóa",
    desc: "Giải pháp số hóa công tác quản lý tại nhà văn hóa cơ sở: lịch sinh hoạt câu lạc bộ, đăng ký sự kiện và theo dõi tài sản, cơ sở vật chất.",
    badges: ["TypeScript", "React", "State Management", "Tailwind CSS"],
    liveDemo: "https://github.com/ducanh-vn/quan-ly-nha-van-hoa",
    github: "https://github.com/ducanh-vn/quan-ly-nha-van-hoa",
    features: [
      {
        title: "Quản lý sự kiện & lịch sinh hoạt",
        detail: "Sắp xếp lịch trình các hoạt động cộng đồng, tránh trùng lặp phòng chức năng."
      },
      {
        title: "Kiểm kê cơ sở vật chất",
        detail: "Theo dõi tình trạng bàn ghế, âm thanh, ánh sáng và thiết bị công cộng."
      },
      {
        title: "TypeScript hiện đại",
        detail: "Cấu trúc dự án chặt chẽ, dễ đọc hiểu và bảo trì lâu dài."
      },
      {
        title: "Giao diện quản trị tiện lợi",
        detail: "Thiết kế bảng biểu trực quan, thân thiện cho người dùng quản lý."
      }
    ]
  }
};

function openProjectModal(projectId) {
  const data = projectsData[projectId];
  if (!data) return;
  
  document.getElementById('modalCategory').textContent = data.category;
  document.getElementById('modalTitle').textContent = data.title;
  document.getElementById('modalDesc').textContent = data.desc;
  
  const badgesBox = document.getElementById('modalBadges');
  badgesBox.innerHTML = '';
  data.badges.forEach(b => {
    const span = document.createElement('span');
    span.className = 'text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-[#f1f505] px-2.5 py-1 rounded';
    span.textContent = b;
    badgesBox.appendChild(span);
  });
  
  document.getElementById('modalLiveDemo').href = data.liveDemo;
  document.getElementById('modalGithub').href = data.github;
  
  const featuresBox = document.getElementById('modalFeatures');
  featuresBox.innerHTML = '';
  data.features.forEach(f => {
    const card = document.createElement('div');
    card.className = 'bg-white p-5 rounded-xl border border-neutral-200 shadow-sm';
    card.innerHTML = `
      <h4 class="font-bold text-sm text-neutral-900 mb-1 flex items-center space-x-2">
        <span class="w-1.5 h-1.5 rounded-full bg-[#141414]"></span>
        <span>${f.title}</span>
      </h4>
      <p class="text-xs text-neutral-600 leading-relaxed">${f.detail}</p>
    `;
    featuresBox.appendChild(card);
  });
  
  const modal = document.getElementById('projectModal');
  modal.classList.add('open');
  if (window.lucide) lucide.createIcons();
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('open');
}
