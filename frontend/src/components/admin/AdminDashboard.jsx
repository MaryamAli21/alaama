import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  FileText, 
  Users, 
  Mail, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiService } from '../../services/api';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchData();
  }, [activeTab]);

  const fetchCurrentUser = async () => {
    try {
      const user = await apiService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      onLogout();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'services':
          const servicesData = await apiService.getAdminServices();
          setServices(servicesData);
          break;
        case 'cases':
          const casesData = await apiService.getAdminCaseStudies();
          setCaseStudies(casesData);
          break;
        case 'contacts':
          const contactsData = await apiService.getContactSubmissions();
          setContactSubmissions(contactsData.submissions || []);
          break;
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    onLogout();
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      await apiService.updateService(serviceId, { active: !currentStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to update service status:', error);
    }
  };

  const toggleCaseStudyStatus = async (caseStudyId, currentStatus) => {
    try {
      await apiService.updateCaseStudy(caseStudyId, { active: !currentStatus });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Failed to update case study status:', error);
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiService.deleteService(serviceId);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete service:', error);
      }
    }
  };

  const deleteCaseStudy = async (caseStudyId) => {
    if (window.confirm('Are you sure you want to delete this case study?')) {
      try {
        await apiService.deleteCaseStudy(caseStudyId);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete case study:', error);
      }
    }
  };

  const tabs = [
    { id: 'services', label: 'Services', icon: Settings },
    { id: 'cases', label: 'Case Studies', icon: FileText },
    { id: 'contacts', label: 'Contact Submissions', icon: Mail }
  ];

  return (
    <div className="min-h-screen bg-bg-page">
      {/* Header */}
      <header className="bg-bg-card border-b border-border-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="heading-3 text-brand-primary">Alaama CMS</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-text-secondary" />
                  <span className="body-small text-text-secondary">
                    {currentUser.username}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors"
              >
                <LogOut size={16} />
                <span className="body-small">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-border-medium mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-medium'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
            <span className="ml-3 body-medium">Loading...</span>
          </div>
        ) : (
          <>
            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-4">Services Management</h2>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus size={16} />
                    Add Service
                  </button>
                </div>

                <div className="grid gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-bg-card border border-border-medium rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="heading-4">{service.title}</h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              service.active 
                                ? 'bg-green-900 text-green-100 border border-green-700' 
                                : 'bg-red-900 text-red-100 border border-red-700'
                            }`}>
                              {service.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="body-small text-text-secondary mb-3">{service.subtitle}</p>
                          <p className="body-small mb-4">{service.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {service.outcomes.map((outcome, index) => (
                              <span key={index} className="inline-flex items-center px-2 py-1 rounded bg-border-medium text-xs">
                                {outcome}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleServiceStatus(service.id, service.active)}
                            className="p-2 text-text-secondary hover:text-brand-primary transition-colors"
                            title={service.active ? 'Hide service' : 'Show service'}
                          >
                            {service.active ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button className="p-2 text-text-secondary hover:text-brand-primary transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteService(service.id)}
                            className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case Studies Tab */}
            {activeTab === 'cases' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-4">Case Studies Management</h2>
                  <button className="btn-primary flex items-center gap-2">
                    <Plus size={16} />
                    Add Case Study
                  </button>
                </div>

                <div className="grid gap-6">
                  {caseStudies.map((caseStudy) => (
                    <div key={caseStudy.id} className="bg-bg-card border border-border-medium rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="heading-4">{caseStudy.title}</h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-100 border border-blue-700">
                              {caseStudy.category}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              caseStudy.active 
                                ? 'bg-green-900 text-green-100 border border-green-700' 
                                : 'bg-red-900 text-red-100 border border-red-700'
                            }`}>
                              {caseStudy.active ? 'Active' : 'Inactive'}
                            </span>
                            {caseStudy.featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900 text-yellow-100 border border-yellow-700">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="body-small text-text-secondary mb-3">{caseStudy.subtitle}</p>
                          <p className="body-small mb-4">{caseStudy.challenge.substring(0, 200)}...</p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => toggleCaseStudyStatus(caseStudy.id, caseStudy.active)}
                            className="p-2 text-text-secondary hover:text-brand-primary transition-colors"
                            title={caseStudy.active ? 'Hide case study' : 'Show case study'}
                          >
                            {caseStudy.active ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button className="p-2 text-text-secondary hover:text-brand-primary transition-colors">
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteCaseStudy(caseStudy.id)}
                            className="p-2 text-text-secondary hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Submissions Tab */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-4">Contact Submissions</h2>
                  <span className="body-small text-text-secondary">
                    {contactSubmissions.length} submissions
                  </span>
                </div>

                <div className="bg-bg-card border border-border-medium rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border-medium">
                      <thead className="bg-bg-page">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Message
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-medium">
                        {contactSubmissions.map((submission) => (
                          <tr key={submission.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="body-small font-medium text-text-primary">
                                  {submission.name}
                                </div>
                                <div className="body-small text-text-secondary">
                                  {submission.email}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="body-small text-text-secondary">
                                {submission.company || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="body-small text-text-secondary">
                                {submission.message.substring(0, 100)}
                                {submission.message.length > 100 && '...'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="body-small text-text-secondary">
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                submission.email_sent 
                                  ? 'bg-green-900 text-green-100 border border-green-700' 
                                  : 'bg-yellow-900 text-yellow-100 border border-yellow-700'
                              }`}>
                                {submission.email_sent ? 'Notified' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;