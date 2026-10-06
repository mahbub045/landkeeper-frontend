import { baseApi } from '@/store/api/baseApi';

export const DocumentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: (params) => ({
        url: '/document',
        method: 'GET',
        params,
      }),
      providesTags: ['Document'],
    }),
    addDocuments: builder.mutation({
      query: (payload) => ({
        url: '/document',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Document'],
    }),
    updateDocument: builder.mutation({
      query: ({ document_alias, payload }) => ({
        url: `/document/${document_alias}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['Document'],
    }),
    deleteDocument: builder.mutation({
      query: ({ document_alias }) => ({
        url: `/document/${document_alias}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useAddDocumentsMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
} = DocumentsApi;
