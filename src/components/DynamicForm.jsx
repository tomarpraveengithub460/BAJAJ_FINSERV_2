import React, { useEffect, useState } from "react";

function DynamicForm({ rollNumber }) {
  const [form, setForm] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function fetchForm() {
      try {
        const res = await fetch(`https://dynamic-form-generator-9rl7.onrender.com/get-form?rollNumber=${rollNumber}`);
        const data = await res.json();
        setForm(data.form);
      } catch (err) {
        console.error("Failed to fetch form", err);
      }
    }
    fetchForm();
  }, [rollNumber]);

  const validateSection = () => {
    const sectionErrors = {};
    const fields = form.sections[currentSectionIndex].fields;
    fields.forEach((field) => {
      const value = formData[field.fieldId];
      if (field.required && !value) {
        sectionErrors[field.fieldId] = field.validation?.message || "This field is required.";
      }
      if (field.minLength && value?.length < field.minLength) {
        sectionErrors[field.fieldId] = `Minimum ${field.minLength} characters required.`;
      }
      if (field.maxLength && value?.length > field.maxLength) {
        sectionErrors[field.fieldId] = `Maximum ${field.maxLength} characters allowed.`;
      }
    });
    setErrors(sectionErrors);
    return Object.keys(sectionErrors).length === 0;
  };

  const handleChange = (e, field) => {
    const { value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [field.fieldId]: type === "checkbox" ? checked : value
    }));
  };

  const handleNext = () => {
    if (validateSection()) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentSectionIndex((prev) => prev - 1);
  };

  const handleSubmit = () => {
    if (validateSection()) {
      console.log("Final Form Data:", formData);
      alert("Form submitted! Check console.");
    }
  };

  if (!form) return <p>Loading form...</p>;

  const currentSection = form.sections[currentSectionIndex];

  return (
    <div>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{currentSection.title}</h2>
      <p style={{ marginBottom: "1rem" }}>{currentSection.description}</p>
      {currentSection.fields.map((field) => (
        <div key={field.fieldId} style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>{field.label}</label>
          {field.type === "text" || field.type === "email" || field.type === "tel" || field.type === "date" ? (
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleChange(e, field)}
              style={{ padding: "0.5rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #ccc" }}
            />
          ) : field.type === "textarea" ? (
            <textarea
              placeholder={field.placeholder}
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleChange(e, field)}
              style={{ padding: "0.5rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #ccc" }}
            />
          ) : field.type === "dropdown" ? (
            <select
              value={formData[field.fieldId] || ""}
              onChange={(e) => handleChange(e, field)}
              style={{ padding: "0.5rem", width: "100%", borderRadius: "0.5rem", border: "1px solid #ccc" }}
            >
              <option value="">Select</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : field.type === "radio" ? (
            field.options?.map((option) => (
              <label key={option.value} style={{ marginRight: "1rem" }}>
                <input
                  type="radio"
                  name={field.fieldId}
                  value={option.value}
                  checked={formData[field.fieldId] === option.value}
                  onChange={(e) => handleChange(e, field)}
                />
                {option.label}
              </label>
            ))
          ) : field.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={formData[field.fieldId] || false}
              onChange={(e) => handleChange(e, field)}
            />
          ) : null}
          {errors[field.fieldId] && <p style={{ color: "red" }}>{errors[field.fieldId]}</p>}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {currentSectionIndex > 0 && (
          <button onClick={handlePrev} style={{ padding: "0.5rem 1rem", backgroundColor: "#ccc", borderRadius: "0.5rem", border: "none" }}>
            Prev
          </button>
        )}
        {currentSectionIndex < form.sections.length - 1 ? (
          <button onClick={handleNext} style={{ padding: "0.5rem 1rem", backgroundColor: "#2563eb", color: "white", borderRadius: "0.5rem", border: "none" }}>
            Next
          </button>
        ) : (
          <button onClick={handleSubmit} style={{ padding: "0.5rem 1rem", backgroundColor: "green", color: "white", borderRadius: "0.5rem", border: "none" }}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}

export default DynamicForm;
