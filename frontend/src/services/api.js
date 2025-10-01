import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Services
export const apiService = {
  // Public APIs
  async getServices() {
    try {
      const response = await api.get('/public/services');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  },

  async getCaseStudies(featuredOnly = false) {
    try {
      const params = featuredOnly ? { featured_only: true } : {};
      const response = await api.get('/public/case-studies', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
      throw error;
    }
  },

  async getConfig() {
    try {
      const response = await api.get('/public/config');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch config:', error);
      return {
        ga_measurement_id: null,
        calendly_link: null,
        contact_email: 'info@alaama.co',
        instagram: '@alaama.bh',
        website: 'www.alaama.co'
      };
    }
  },

  // Contact API
  async submitContact(contactData) {
    try {
      const response = await api.post('/contact/', contactData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      throw error;
    }
  },

  // CMS APIs (for admin)
  async login(credentials) {
    try {
      const formData = new FormData();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Store token
      if (response.data.access_token) {
        localStorage.setItem('auth_token', response.data.access_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Clear token regardless of API response
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  },

  // CMS Services Management
  async getAdminServices() {
    try {
      const response = await api.get('/cms/services?active_only=false');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin services:', error);
      throw error;
    }
  },

  async createService(serviceData) {
    try {
      const response = await api.post('/cms/services', serviceData);
      return response.data;
    } catch (error) {
      console.error('Failed to create service:', error);
      throw error;
    }
  },

  async updateService(serviceId, serviceData) {
    try {
      const response = await api.put(`/cms/services/${serviceId}`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Failed to update service:', error);
      throw error;
    }
  },

  async deleteService(serviceId) {
    try {
      const response = await api.delete(`/cms/services/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete service:', error);
      throw error;
    }
  },

  // CMS Case Studies Management
  async getAdminCaseStudies() {
    try {
      const response = await api.get('/cms/case-studies?active_only=false');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin case studies:', error);
      throw error;
    }
  },

  async createCaseStudy(caseStudyData) {
    try {
      const response = await api.post('/cms/case-studies', caseStudyData);
      return response.data;
    } catch (error) {
      console.error('Failed to create case study:', error);
      throw error;
    }
  },

  async updateCaseStudy(caseStudyId, caseStudyData) {
    try {
      const response = await api.put(`/cms/case-studies/${caseStudyId}`, caseStudyData);
      return response.data;
    } catch (error) {
      console.error('Failed to update case study:', error);
      throw error;
    }
  },

  async deleteCaseStudy(caseStudyId) {
    try {
      const response = await api.delete(`/cms/case-studies/${caseStudyId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete case study:', error);
      throw error;
    }
  },

  // Contact submissions (admin)
  async getContactSubmissions(skip = 0, limit = 50) {
    try {
      const response = await api.get('/contact/submissions', {
        params: { skip, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error);
      throw error;
    }
  },

  // Concepts Management
  async getConcepts() {
    try {
      const response = await api.get('/public/concepts');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch concepts:', error);
      throw error;
    }
  },

  async getAdminConcepts() {
    try {
      const response = await api.get('/cms/concepts?active_only=false');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch admin concepts:', error);
      throw error;
    }
  },

  async createConcept(conceptData) {
    try {
      const response = await api.post('/cms/concepts', conceptData);
      return response.data;
    } catch (error) {
      console.error('Failed to create concept:', error);
      throw error;
    }
  },

  async updateConcept(conceptId, conceptData) {
    try {
      const response = await api.put(`/cms/concepts/${conceptId}`, conceptData);
      return response.data;
    } catch (error) {
      console.error('Failed to update concept:', error);
      throw error;
    }
  },

  async deleteConcept(conceptId) {
    try {
      const response = await api.delete(`/cms/concepts/${conceptId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete concept:', error);
      throw error;
    }
  }
};

// Initialize auth token if exists
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
      
      // Redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;