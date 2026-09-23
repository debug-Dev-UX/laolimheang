// Catalog of Project Media Assets, Screenshots, and Architecture Diagrams
export const DEFAULT_PROJECT_IMAGES = [
  {
    id: 'pimg-1',
    projectId: 'proj-1',
    projectName: 'NexusCloud Microservices Platform',
    title: 'Cluster Topology & Distributed Service Mesh',
    imageType: 'Architecture Diagram',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    description: 'High-level network topology showing zero-trust mutual TLS boundaries, Kafka event brokers, and Redis caching nodes.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-2',
    projectId: 'proj-1',
    projectName: 'NexusCloud Microservices Platform',
    title: 'Real-Time Telemetry & Prometheus Metrics HUD',
    imageType: 'Desktop UI',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    description: 'Mission control dashboard tracking sub-8ms latencies, container memory utilization, and autoscaling thresholds.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-3',
    projectId: 'proj-2',
    projectName: 'AuraVision Real-Time AI Engine',
    title: 'Spatial Neural Bounding Detection Interface',
    imageType: 'Desktop UI',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    description: '60 FPS inference stream with 3D spatial coordinate projection and real-time tensor classification heatmaps.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-4',
    projectId: 'proj-2',
    projectName: 'AuraVision Real-Time AI Engine',
    title: 'Edge Neural Pipeline & ONNX Execution Graph',
    imageType: 'Architecture Diagram',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    description: 'Model optimization flow illustrating float16 quantization, WebGL compute shaders, and worker thread dispatch.',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-5',
    projectId: 'proj-3',
    projectName: 'Chronos DeFi Real-Time Analytics',
    title: 'Volumetric Depth of Market & Order Flow',
    imageType: 'Desktop UI',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1600&q=80',
    description: 'Interactive GPU-rendered 3D order book showing institutional liquidity walls and algorithmic slippage modeling.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-6',
    projectId: 'proj-3',
    projectName: 'Chronos DeFi Real-Time Analytics',
    title: 'Mobile Liquidity Alerts & Yield Terminal',
    imageType: 'Mobile View',
    aspectRatio: '9:16',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    description: 'Responsive mobile interface engineered for high-frequency price updates and instant push notifications.',
    featured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-7',
    projectId: 'proj-4',
    projectName: 'Vortex Spatial 3D Experience',
    title: 'Procedural Kinematics & Audio FFT Visualizer',
    imageType: 'Desktop UI',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    description: '100k+ instanced particles reacting in real-time to multi-band audio spectrum frequencies via Web Audio API.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'pimg-8',
    projectId: 'proj-6',
    projectName: 'Lumina Luxury E-Commerce Engine',
    title: 'Headless Storefront & 3D Material Customizer',
    imageType: 'Wireframe / Mockup',
    aspectRatio: '16:9',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    description: 'Interactive PBR material selector allowing customers to customize luxury physical products in real-time 3D.',
    featured: true,
    createdAt: new Date().toISOString(),
  },
];

export const DEFAULT_PROJECT_IMAGE_TYPES = [
  'Desktop UI',
  'Mobile View',
  'Architecture Diagram',
  'Database Schema',
  'Wireframe / Mockup',
  'Feature Demo',
];

export const PROJECT_IMAGE_TYPES = DEFAULT_PROJECT_IMAGE_TYPES;

export const getStoredCategories = () => {
  try {
    const stored = localStorage.getItem('project_image_categories');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(Boolean);
      }
    }
    // Backward compatibility with previous custom_project_image_categories key
    const custom = localStorage.getItem('custom_project_image_categories');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const merged = Array.from(new Set([...DEFAULT_PROJECT_IMAGE_TYPES, ...parsed.filter(Boolean)]));
        localStorage.setItem('project_image_categories', JSON.stringify(merged));
        return merged;
      }
    }
  } catch (e) {
    console.warn('Failed to parse custom categories:', e);
  }
  return DEFAULT_PROJECT_IMAGE_TYPES;
};

export const saveCustomCategory = (newCategory) => {
  if (!newCategory || typeof newCategory !== 'string') return getStoredCategories();
  const trimmed = newCategory.trim();
  if (!trimmed) return getStoredCategories();

  const current = getStoredCategories();
  if (!current.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem('project_image_categories', JSON.stringify(updated));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('categories-updated'));
      }
    } catch (e) {
      console.warn('Failed to save custom category to localStorage:', e);
    }
    return updated;
  }
  return current;
};

export const deleteCustomCategory = (categoryToDelete) => {
  if (!categoryToDelete || typeof categoryToDelete !== 'string') return getStoredCategories();
  const trimmed = categoryToDelete.trim();
  const current = getStoredCategories();
  const updated = current.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());
  try {
    localStorage.setItem('project_image_categories', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('categories-updated'));
    }
  } catch (e) {
    console.warn('Failed to delete category from localStorage:', e);
  }
  return updated;
};

export const resetCategoriesToDefault = () => {
  try {
    localStorage.setItem('project_image_categories', JSON.stringify(DEFAULT_PROJECT_IMAGE_TYPES));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('categories-updated'));
    }
  } catch (e) {
    console.warn('Failed to reset categories:', e);
  }
  return DEFAULT_PROJECT_IMAGE_TYPES;
};


