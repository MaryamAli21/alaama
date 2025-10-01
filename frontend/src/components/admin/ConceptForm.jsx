import React, { useState, useEffect } from 'react';

const ConceptForm = ({ concept, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    order: 0,
    active: true
  });

  useEffect(() => {
    if (concept) {
      setFormData({
        title: concept.title || '',
        description: concept.description || '',
        image: concept.image || '',
        link: concept.link || '',
        order: concept.order || 0,
        active: concept.active ?? true
      });
    }
  }, [concept]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
          Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-3 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
          placeholder="Enter concept title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full p-3 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors resize-vertical"
          placeholder="Enter concept description"
        ></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-text-primary mb-2">
          Image URL (Required)
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full p-3 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <label htmlFor="link" className="block text-sm font-medium text-text-primary mb-2">
          Link (Optional)
        </label>
        <input
          type="url"
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
          className="w-full p-3 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
          placeholder="https://example.com/project"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="order" className="block text-sm font-medium text-text-primary mb-2">
            Order
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            min="0"
            className="w-full p-3 bg-bg-page border border-border-medium rounded-lg text-text-primary placeholder-text-muted focus:border-brand-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="rounded border-border-medium text-brand-primary focus:ring-brand-primary focus:ring-offset-bg-card"
            />
            <span className="ml-2 text-sm text-text-primary">Active</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-text-secondary bg-bg-page border border-border-medium rounded-md hover:bg-border-medium focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors"
        >
          {concept ? 'Update' : 'Create'} Concept
        </button>
      </div>
    </form>
  );
};

export default ConceptForm;