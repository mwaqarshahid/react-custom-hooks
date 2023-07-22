import { useState } from 'react';
import axios from '../utils/axios';
import { clearFields, getRequiredErrorMessage } from '../utils/form';
import { BACKEND_SERVER_DOWN } from '../shared/errorMessages';

export const useForm = (fields, requirdFields, postUrl) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);

  const [res, setRes] = useState({
    data: null,
    error: null
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setIsFormTouched(true);

    const form = e.target;
    const formErrors = {};
    let hasError = false;
    for (const field of requirdFields) {
      if (!form[field].value) {
        formErrors[field] = getRequiredErrorMessage(field);
        hasError = true;
      }
    }
    setErrors(formErrors);
    if (hasError) return;

    setLoading(true);
    const reqBody = {};
    for (const field of fields) {
      reqBody[field] = form[field].value;
    }

    axios.post(postUrl, reqBody).then(({ data }) => {
      setRes({ data, error: null });
    }).catch((error) => {
      const errorMsg = error.response ? error.response.data.message : BACKEND_SERVER_DOWN;
      setRes({ data: null, error: errorMsg });
    }).finally(() => {
      clearFields(form, fields);
      setLoading(false);
      setIsFormTouched(false);
    });
  };

  return {
    res,
    errors,
    onSubmit,
    loading,
    isFormTouched
  };
};
