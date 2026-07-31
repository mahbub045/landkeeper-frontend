import { baseApi } from '@/store/api/baseApi';

export const TemplateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTemplates: builder.query({
      query: (params) => ({
        url: '/templates',
        method: 'GET',
        params,
      }),
      providesTags: ['Templates'],
    }),
    uploadTemplate: builder.mutation({
      query: (formData) => ({
        url: '/templates',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Templates'],
    }),
    editTemplate: builder.mutation({
      query: ({ templateAlias, formData }) => ({
        url: `/templates/${templateAlias}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['Templates'],
    }),
    deleteTemplate: builder.mutation({
      query: (templateAlias) => ({
        url: `/templates/${templateAlias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Templates'],
    }),
  }),
});

export const {
  useGetTemplatesQuery,
  useUploadTemplateMutation,
  useEditTemplateMutation,
  useDeleteTemplateMutation,
} = TemplateApi;
