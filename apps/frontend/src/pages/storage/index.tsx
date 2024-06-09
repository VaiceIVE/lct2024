import { useState } from 'react';

import { PageWrapper } from 'shared/ui/Wrappers/PageWrapper';
import { StorageUploadCard } from 'widgets/storage-upload-card';

const StoragePage = () => {
  const [file, setFile] = useState<File | null>(null);

  return (
    <PageWrapper>
      <StorageUploadCard setFile={setFile} /> <div></div>
    </PageWrapper>
  );
};

export default StoragePage;
