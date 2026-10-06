import Documents from './Documents/Documents';
import Templates from './Templates/Templates';

const DocumentsAndTemplates: React.FC = () => {
  return (
    <>
      <Documents />
      <hr className='my-8' />
      <Templates />
    </>
  );
};

export default DocumentsAndTemplates;
