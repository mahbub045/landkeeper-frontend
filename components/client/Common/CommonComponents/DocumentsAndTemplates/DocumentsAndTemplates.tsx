import Documents from './Documents/Documents';
import Templates from './Templates/Templates';

const DocumentsAndTemplates: React.FC = () => {
  return (
    <>
      <Templates />
      <hr className='my-8' />
      <Documents />
    </>
  );
};

export default DocumentsAndTemplates;
