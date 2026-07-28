// Form Validators
export const validators = {
  // Email validation
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return null;
  },

  // Password validation
  password: (value, minLength = 6) => {
    if (!value) return 'Password is required';
    if (value.length < minLength) return `Password must be at least ${minLength} characters`;
    return null;
  },

  // Required field
  required: (value, fieldName = 'This field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `${fieldName} is required`;
    }
    return null;
  },

  // Min length
  minLength: (value, minLength = 3, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return null;
  },

  // Max length
  maxLength: (value, maxLength = 100, fieldName = 'This field') => {
    if (!value) return null;
    if (value.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    return null;
  },

  // URL validation
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  // Phone validation
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return null;
  },

  // Number validation
  number: (value) => {
    if (value === '' || value === null || value === undefined) return null;
    if (isNaN(value)) return 'Please enter a valid number';
    return null;
  },

  // Slug validation
  slug: (value) => {
    if (!value) return 'Slug is required';
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(value)) {
      return 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    return null;
  },

  // Match fields (for password confirmation)
  match: (value, matchValue, fieldName = 'This field') => {
    if (value !== matchValue) {
      return `${fieldName} does not match`;
    }
    return null;
  },
};

// Contact form validation
export const validateContactForm = (data) => {
  const errors = {};

  errors.name = validators.required(data.name, 'Name');
  errors.email = validators.email(data.email);
  errors.subject = validators.required(data.subject, 'Subject');
  errors.message = validators.required(data.message, 'Message');

  if (data.message && data.message.length > 5000) {
    errors.message = 'Message must not exceed 5000 characters';
  }

  return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
};

// Service validation
export const validateService = (data) => {
  const errors = {};

  errors.title = validators.required(data.title, 'Title');
  errors.description = validators.required(data.description, 'Description');
  errors.price = validators.number(data.price);

  if (data.price && data.price < 0) {
    errors.price = 'Price must be a positive number';
  }

  return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
};

// Project validation
export const validateProject = (data) => {
  const errors = {};

  errors.title = validators.required(data.title, 'Project Title');
  errors.description = validators.required(data.description, 'Description');
  errors.category = validators.required(data.category, 'Category');

  if (data.liveUrl) {
    errors.liveUrl = validators.url(data.liveUrl);
  }

  if (data.githubUrl) {
    errors.githubUrl = validators.url(data.githubUrl);
  }

  return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
};

// Blog validation
export const validateBlog = (data) => {
  const errors = {};

  errors.title = validators.required(data.title, 'Blog Title');
  errors.slug = validators.slug(data.slug);
  errors.content = validators.required(data.content, 'Content');
  errors.category = validators.required(data.category, 'Category');

  return Object.fromEntries(Object.entries(errors).filter(([_, v]) => v !== null));
};
