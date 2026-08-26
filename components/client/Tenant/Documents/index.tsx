import DocumentList from './DocumentList/DocumentList';

const TenantDocumentsContainer: React.FC = () => {
  return (
    <>
      <div>
        <h1 className='text-2xl font-semibold'>Tenant Documents</h1>
        <p className='text-muted-foreground text-sm'>
          Welcome to the Tenant Documents page.
        </p>
      </div>
      <DocumentList />
    </>
  );
};

export default TenantDocumentsContainer;
