import * as yup from 'yup';

export const generateFormSchema = yup.object({
  topic: yup.string().required('Topic is required'),
  tone: yup.string().required(),
  length: yup.string().required(),
});
